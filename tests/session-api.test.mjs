import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import axios from 'axios';
import ts from 'typescript';

// 실제 TypeScript 구현을 변환해 Axios adapter로 HTTP 응답만 대체한다.
const source = await readFile(new URL('../src/api/createSessionApi.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replaceAll('from "axios"', `from "${import.meta.resolve('axios')}"`);
const { createSessionApi } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

function fixture(handler) {
  const state = { version: 0, token: 'old', logouts: 0, refreshes: 0 };
  const api = createSessionApi({ withCredentials: true, adapter: async config => {
    const result = await handler(config, state);
    const response = { config, status: result.status ?? 200, data: result.data, headers: {}, statusText: '' };
    if (response.status >= 400) throw new axios.AxiosError('HTTP error', 'ERR_BAD_REQUEST', config, null, response);
    return response;
  } }, () => ({
    ...state,
    refreshAccessToken(token) { state.token = token; },
    logout() { state.version++; state.token = null; state.logouts++; },
  }));
  return { api, state };
}
const unauthorized = { status: 401, data: { resultCode: '401-1' } };
const renewed = { data: { data: { accessToken: 'new' } } };

test('concurrent failures share refresh; original method/body and cookie setting survive retry', async () => {
  const { api, state } = fixture(async (config, state) => {
    assert.equal(config.withCredentials, true);
    if (config.url === '/api/auth/refresh') {
      state.refreshes++;
      await new Promise(resolve => setImmediate(resolve));
      return renewed;
    }
    if (config.headers.Authorization === 'Bearer old') return unauthorized;
    assert.equal(config.method, 'post');
    assert.equal(config.data, '{"content":"hello"}');
    return { data: 'ok' };
  });
  const results = await Promise.all([api.post('/api/quotes', { content: 'hello' }), api.post('/api/quotes', { content: 'hello' })]);
  assert.deepEqual(results.map(result => result.data), ['ok', 'ok']);
  assert.equal(state.refreshes, 1);
  assert.equal(state.logouts, 0);
});

test('refresh rejection logs out once for concurrent failures', async () => {
  const { api, state } = fixture(async (config, state) => {
    if (config.url === '/api/auth/refresh') {
      state.refreshes++;
      await new Promise(resolve => setImmediate(resolve));
    }
    return unauthorized;
  });
  const results = await Promise.allSettled([api.get('/api/profile'), api.get('/api/groups/me')]);
  assert.ok(results.every(result => result.status === 'rejected'));
  assert.equal(state.refreshes, 1);
  assert.equal(state.logouts, 1);
});

test('retry is limited to once', async () => {
  const { api, state } = fixture(async (config, state) => {
    if (config.url === '/api/auth/refresh') { state.refreshes++; return renewed; }
    return unauthorized;
  });
  await assert.rejects(api.get('/api/profile'));
  assert.equal(state.refreshes, 1);
  assert.equal(state.logouts, 1);
});

test('permission errors, login errors and network errors do not refresh or log out', async () => {
  const { api, state } = fixture(async config => {
    if (config.url === '/network') throw new axios.AxiosError('offline', 'ERR_NETWORK', config);
    return config.url === '/api/auth/login' ? unauthorized : { status: 403, data: { resultCode: '403-2' } };
  });
  await assert.rejects(api.post('/api/auth/login'));
  await assert.rejects(api.get('/api/profile'));
  await assert.rejects(api.get('/network'));
  assert.equal(state.token, 'old');
  assert.equal(state.logouts, 0);
});

test('recognized unauthenticated 403 refreshes', async () => {
  const { api } = fixture(async config => {
    if (config.url === '/api/auth/refresh') return renewed;
    return config.headers.Authorization === 'Bearer old'
      ? { status: 403, data: { resultCode: '403-1' } }
      : { data: 'ok' };
  });
  assert.equal((await api.get('/api/profile')).data, 'ok');
});

test('late refresh cannot restore logged-out session or overwrite another account', async () => {
  for (const nextToken of [null, 'other-account']) {
    let release;
    let started;
    const ready = new Promise(resolve => { started = resolve; });
    const { api, state } = fixture(async config => {
      if (config.url === '/api/auth/refresh') {
        started();
        await new Promise(resolve => { release = resolve; });
        return renewed;
      }
      return unauthorized;
    });
    const request = api.get('/api/profile');
    await ready;
    state.version++;
    state.token = nextToken;
    release();
    await assert.rejects(request, error => axios.isCancel(error));
    assert.equal(state.token, nextToken);
    assert.equal(state.logouts, 0);
  }
});

test('malformed refresh response ends session', async () => {
  const { api, state } = fixture(async config => config.url === '/api/auth/refresh' ? { data: {} } : unauthorized);
  await assert.rejects(api.get('/api/profile'));
  assert.equal(state.logouts, 1);
});

test('late failure from old token reuses new token without another refresh', async () => {
  let release;
  let started;
  const ready = new Promise(resolve => { started = resolve; });
  const { api, state } = fixture(async (config, state) => {
    if (config.url === '/api/auth/refresh') { state.refreshes++; return renewed; }
    if (config.headers.Authorization === 'Bearer new') return { data: 'ok' };
    if (config.url === '/slow') {
      started();
      await new Promise(resolve => { release = resolve; });
    }
    return unauthorized;
  });
  const slow = api.get('/slow');
  await ready;
  assert.equal((await api.get('/fast')).data, 'ok');
  release();
  assert.equal((await slow).data, 'ok');
  assert.equal(state.refreshes, 1);
});
