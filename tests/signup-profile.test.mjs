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
const { saveSignupProfile } = await loadModule('../src/hooks/queries/saveSignupProfile.ts');
const payload = { nickname: '이름', introduction: '소개', birthYear: 1995 };
function fixture(failure) {
  const calls = [];
  const api = {
    async updateSettingsProfile(body) {
      calls.push(['image', body]);
      if (failure === 'image') throw new Error('image failed');
    },
    async setupProfile(body) {
      calls.push(['setup', body]);
      if (failure === 'setup') throw new Error('setup failed');
      return { data: { profileCompleted: true } };
    },
  };
  return { api, calls };
}

test('setup sends birth year as JSON string without account read/write or image', async () => {
  const { api, calls } = fixture();
  await saveSignupProfile(payload, api);
  assert.deepEqual(calls, [['setup', { ...payload, birthYear: '1995' }]]);
});

test('optional image is uploaded before completing setup', async () => {
  const image = new File(['image'], 'profile.png', { type: 'image/png' });
  const { api, calls } = fixture();
  await saveSignupProfile({ ...payload, image }, api);
  assert.deepEqual(calls, [
    ['image', { nickname: payload.nickname, introduction: payload.introduction, image }],
    ['setup', { ...payload, birthYear: '1995' }],
  ]);
});

test('image failure stops completion; setup failure is propagated and can be retried', async () => {
  const image = new File(['image'], 'profile.png');
  const failed = fixture('image');
  await assert.rejects(saveSignupProfile({ ...payload, image }, failed.api));
  assert.deepEqual(failed.calls.map(call => call[0]), ['image']);
  const partial = fixture('setup');
  await assert.rejects(saveSignupProfile({ ...payload, image }, partial.api));
  assert.deepEqual(partial.calls.map(call => call[0]), ['image', 'setup']);
  await saveSignupProfile({ ...payload, image }, fixture().api);
});

test('invalid birth years perform no writes', async () => {
  for (const birthYear of [1899, new Date().getFullYear() + 1, 1995.5, NaN]) {
    const { api, calls } = fixture();
    await assert.rejects(saveSignupProfile({ ...payload, birthYear }, api));
    assert.deepEqual(calls, []);
  }
});

test('actual transport separates multipart image and setup JSON contracts', async () => {
  const calls = [];
  globalThis.__signupProfileTransport = {
    async put(path, body) { calls.push([path, body]); return { data: { profileCompleted: true } }; },
  };
  const stub = `data:text/javascript;base64,${Buffer.from('export default globalThis.__signupProfileTransport;').toString('base64')}`;
  const { profileApi } = await loadModule('../src/api/profileApi.ts', source => source
    .replace('"@/api/api"', JSON.stringify(stub))
    .replaceAll('import.meta.env.VITE_API_URL', '"https://api.example.test"'));
  const image = new File(['image'], 'profile.png', { type: 'image/png' });
  await saveSignupProfile({ ...payload, image }, profileApi);
  assert.equal(calls[0][0], '/api/profile');
  assert.equal(calls[0][1].get('image').name, 'profile.png');
  assert.deepEqual(JSON.parse(await calls[0][1].get('data').text()), { nickname: '이름', introduction: '소개' });
  assert.deepEqual(calls[1], ['/api/profile/setup', { ...payload, birthYear: '1995' }]);
  delete globalThis.__signupProfileTransport;
});
