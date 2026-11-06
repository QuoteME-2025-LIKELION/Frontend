import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

globalThis.__sessionRouteReact = React;
globalThis.__sessionRouteState = {};
globalThis.__sessionRouteProfile = {};
const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const modules = {
  'react-router-dom': url(`export const Navigate = ({to}) => globalThis.__sessionRouteReact.createElement('span', {'data-redirect': to}); export const Outlet = () => globalThis.__sessionRouteReact.createElement('span', {}, 'PROTECTED_HOME');`),
  '@/components/Spinner/Spinner': url(`export default () => globalThis.__sessionRouteReact.createElement('span', {}, 'CHECKING_SESSION');`),
  '@/hooks/useProfileQueries': url('export const useMyProfileQuery = () => globalThis.__sessionRouteProfile;'),
  '@/stores/useAuthStore': url('export default () => globalThis.__sessionRouteState;'),
};
const source = await readFile(new URL('../src/layouts/ProtectedRoute.tsx', import.meta.url), 'utf8');
let { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
});
outputText = outputText.replace(/from "([^"]+)"/g, (_, spec) => `from "${modules[spec] ?? import.meta.resolve(spec)}"`);
const { default: ProtectedRoute } = await import(url(outputText));
function render(state, profile) {
  globalThis.__sessionRouteState = { isLoading: false, isAuthenticated: true, logout() {}, ...state };
  globalThis.__sessionRouteProfile = profile;
  return renderToStaticMarkup(React.createElement(ProtectedRoute));
}

test('expired/revoked session redirects to first screen even if old profile data remains', () => {
  const html = render({ isAuthenticated: false }, { data: { id: 1, nickname: 'old' } });
  assert.ok(html.includes('data-redirect="/"'));
  assert.ok(!html.includes('PROTECTED_HOME'));
});

test('profile failure or paused initial request returns to first screen without extra error UI', () => {
  for (const profile of [
    { isError: true },
    { isError: true, data: { id: 1, nickname: 'cached' } },
    { isPending: true, fetchStatus: 'paused' },
  ]) {
    const html = render({}, profile);
    assert.ok(html.includes('data-redirect="/"'));
    assert.ok(!html.includes('로그인 상태를 확인하지 못했어요.'));
    assert.ok(!html.includes('PROTECTED_HOME'));
  }
});

test('initial verification waits; confirmed profile allows protected screen', () => {
  assert.ok(render({}, { isPending: true, fetchStatus: 'fetching' }).includes('CHECKING_SESSION'));
  assert.ok(render({}, { data: { id: 1, nickname: 'member' } }).includes('PROTECTED_HOME'));
});
