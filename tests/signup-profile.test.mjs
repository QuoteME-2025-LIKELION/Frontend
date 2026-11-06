import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function loadModule(path, transform = source => source) {
  const source = transform(await readFile(new URL(path, import.meta.url), 'utf8'));
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { saveSignupProfile } = await loadModule('../src/utils/saveSignupProfile.ts');
const payload = { nickname: '이름', introduction: '소개', birthYear: 1995 };
function fixture(account, failure) {
  const calls = [];
  const api = {
    async getAccountProfile() { return { data: account }; },
    async updateAccount(body) {
      calls.push(['account', body]);
      if (failure === 'account') throw new Error('account failed');
      Object.assign(account, body);
    },
    async setupProfile(body) {
      calls.push(['profile', body]);
      if (failure === 'profile') throw new Error('profile failed');
    },
  };
  return { api, calls, account };
}

test('preserves email and gender; birthYear goes only to account API', async () => {
  const { api, calls } = fixture({ email: 'member@example.test', gender: 'FEMALE', birthYear: '2000' });
  await saveSignupProfile(payload, api);
  assert.deepEqual(calls, [
    ['account', { email: 'member@example.test', gender: 'FEMALE', birthYear: '1995' }],
    ['profile', { nickname: '이름', introduction: '소개' }],
  ]);
});

test('missing gender becomes ETC and existing ETC is preserved', async () => {
  for (const gender of [null, undefined, 'ETC']) {
    const { api, calls } = fixture({ email: 'member@example.test', gender });
    await saveSignupProfile(payload, api);
    assert.equal(calls[0][1].gender, 'ETC');
  }
});

test('account failure stops profile upload; retry after profile failure skips already saved account', async () => {
  const failedAccount = fixture({ email: 'member@example.test', gender: 'MALE' }, 'account');
  await assert.rejects(saveSignupProfile(payload, failedAccount.api));
  assert.equal(failedAccount.calls.length, 1);
  const partial = fixture({ email: 'member@example.test', gender: 'MALE' }, 'profile');
  await assert.rejects(saveSignupProfile(payload, partial.api));
  assert.equal(partial.account.birthYear, '1995');
  const retry = fixture(partial.account);
  await saveSignupProfile(payload, retry.api);
  assert.deepEqual(retry.calls.map(call => call[0]), ['profile']);
});

test('missing email or invalid year performs no writes', async () => {
  const missing = fixture({ gender: 'MALE' });
  await assert.rejects(saveSignupProfile(payload, missing.api));
  assert.deepEqual(missing.calls, []);
  for (const birthYear of [1899, new Date().getFullYear() + 1, 1995.5, NaN]) {
    const current = fixture({ email: 'member@example.test' });
    await assert.rejects(saveSignupProfile({ ...payload, birthYear }, current.api));
    assert.deepEqual(current.calls, []);
  }
});

test('actual profileApi uses separate account JSON and profile multipart contracts', async () => {
  const calls = [];
  globalThis.__signupProfileTransport = {
    async get() { return { data: { email: 'member@example.test', gender: 'MALE' } }; },
    async put(path, body) { calls.push([path, body]); return { data: {} }; },
  };
  const stub = `data:text/javascript;base64,${Buffer.from('export default globalThis.__signupProfileTransport;').toString('base64')}`;
  const { profileApi } = await loadModule('../src/api/profileApi.ts', source => source
    .replace('"@/api/api"', JSON.stringify(stub))
    .replaceAll('import.meta.env.VITE_API_URL', '"https://api.example.test"'));
  await saveSignupProfile(payload, profileApi);
  assert.equal(calls[0][0], '/api/profile/account');
  assert.equal(calls[0][1].birthYear, '1995');
  assert.equal(calls[1][0], '/api/profile');
  assert.deepEqual(JSON.parse(await calls[1][1].get('data').text()), { nickname: '이름', introduction: '소개' });
  delete globalThis.__signupProfileTransport;
});
