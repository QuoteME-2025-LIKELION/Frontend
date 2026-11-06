import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import axios from 'axios';
import ts from 'typescript';

const memory = new Map();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: key => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: key => memory.delete(key),
} });
const loaded = new Map();
async function load(path) {
  if (loaded.has(path)) return loaded.get(path);
  let source = await readFile(new URL(`../src/${path}.ts`, import.meta.url), 'utf8');
  const imports = [...source.matchAll(/from "([^"]+)"/g)];
  for (const [, spec] of imports) {
    const target = spec.startsWith('@/') ? await load(spec.slice(2)) : import.meta.resolve(spec);
    source = source.replaceAll(`from "${spec}"`, `from "${target}"`);
  }
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
  loaded.set(path, url);
  return url;
}
const { default: auth } = await import(await load('stores/useAuthStore'));
const { queryClient } = await import(await load('app/queryClient'));
const { createSessionApi } = await import(await load('api/createSessionApi'));
const token = exp => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;

test('refresh updates expiry without clearing same-account data', () => {
  auth.getState().login(token(1000));
  queryClient.setQueryData(['profile', 'my'], { id: 1 });
  const version = auth.getState().sessionVersion;
  auth.getState().refreshAccessToken(token(2000));
  assert.equal(auth.getState().accessTokenExpiresAt, 2_000_000);
  assert.equal(auth.getState().sessionVersion, version);
  assert.deepEqual(queryClient.getQueryData(['profile', 'my']), { id: 1 });
});

test('expired-session authentication failure clears token/cache and auth flag', async () => {
  auth.getState().login(token(1));
  queryClient.setQueryData(['profile', 'my'], { id: 1, nickname: 'old' });
  const api = createSessionApi({ adapter: async config => {
    const response = { config, status: config.url === '/api/auth/refresh' ? 401 : 403, data: {}, headers: {}, statusText: '' };
    throw new axios.AxiosError('unauthenticated', 'ERR_BAD_REQUEST', config, null, response);
  } }, () => {
    const state = auth.getState();
    return { version: state.sessionVersion, token: localStorage.getItem('accessToken'), logout: state.logout, refreshAccessToken: state.refreshAccessToken };
  });
  await assert.rejects(api.get('/api/profile'));
  assert.equal(auth.getState().isAuthenticated, false);
  assert.equal(auth.getState().accessTokenExpiresAt, null);
  assert.equal(localStorage.getItem('accessToken'), null);
  assert.equal(queryClient.getQueryData(['profile', 'my']), undefined);
});

test('initialization with no token resets a stale authenticated flag', () => {
  auth.getState().login(token(1000));
  localStorage.removeItem('accessToken');
  auth.getState().initializeAuth();
  assert.equal(auth.getState().isAuthenticated, false);
  assert.equal(auth.getState().accessTokenExpiresAt, null);
});
