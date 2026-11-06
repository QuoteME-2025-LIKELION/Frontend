import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const source = await readFile(new URL('../src/utils/accessTokenExpiry.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { getAccessTokenExpiry, getSessionCheckDelay } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const token = payload => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

test('reads expiry for scheduling without assuming the token is authenticated', () => {
  assert.equal(getAccessTokenExpiry(token({ exp: 1000 })), 1_000_000);
  for (const value of [null, '', 'mock-token', 'a.bad.b', token({}), token({ exp: '1000' }), token({ exp: -1 })]) {
    assert.equal(getAccessTokenExpiry(value), null);
  }
});

test('rechecks shortly after expiry and periodically when expiry is unavailable', () => {
  assert.equal(getSessionCheckDelay(1_010_000, 1_000_000), 11_000);
  assert.equal(getSessionCheckDelay(999_000, 1_000_000), 1_000);
  assert.equal(getSessionCheckDelay(2_000_000, 1_000_000), 60_000);
  assert.equal(getSessionCheckDelay(null, 1_000_000), 60_000);
});
