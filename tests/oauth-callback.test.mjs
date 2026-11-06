import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/oauthCallback.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { resolveOAuthCallback, getOAuthFailureMessage } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const resolve = query => resolveOAuthCallback(new URLSearchParams(query));

test('only explicitly new members enter profile setup', () => {
  assert.deepEqual(resolve('accessToken=test&isNewUser=true'), { path: '/profile', token: 'test' });
  for (const flag of ['', '&isNewUser=false', '&isNewUser=TRUE']) {
    assert.deepEqual(resolve(`accessToken=test${flag}`), { path: '/home', token: 'test' });
  }
});

test('link success without token returns to account settings and does not create a session', () => {
  for (const provider of ['google', 'kakao']) {
    const result = resolve(`linked=${provider}`);
    assert.equal(result.path, '/account-setting');
    assert.equal(result.linked, true);
    assert.equal(result.token, undefined);
  }
});

test('failure reason prevents login and unknown input is never echoed', () => {
  for (const reason of ['account_not_found', 'email_not_verified', 'unknown']) {
    const result = resolve(`reason=${reason}&accessToken=test`);
    assert.equal(result.path, '/');
    assert.equal(result.token, undefined);
    assert.equal(result.message, getOAuthFailureMessage(reason));
  }
  assert.ok(!getOAuthFailureMessage('<script>').includes('<script>'));
  for (const reason of ['already_linked', 'provider_already_linked']) {
    assert.equal(resolve(`reason=${reason}`).path, '/account-setting');
  }
});

test('empty token and invalid link provider do not authenticate', () => {
  for (const query of ['', 'accessToken=%20', 'linked=other']) {
    const result = resolve(query);
    assert.equal(result.path, '/');
    assert.equal(result.token, undefined);
    assert.ok(result.message);
  }
});
