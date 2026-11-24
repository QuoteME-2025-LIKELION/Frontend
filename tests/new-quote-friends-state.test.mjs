import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const transpile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const utility = async file => url(transpile(await readFile(new URL(`../src/utils/quote/${file}.ts`, import.meta.url), 'utf8')));
globalThis.__quoteFriendsReact = React;
globalThis.__quoteFriendsButtons = [];
globalThis.__quoteFriendsState = {};
globalThis.__quoteRequestsState = {};
const source = await readFile(new URL('../src/pages/Main/components/NewQuote/NewQuote.tsx', import.meta.url), 'utf8');
const names = [...new Set([...source.matchAll(/\bS\.(\w+)/g)].map(match => match[1]))];
const styles = names.map(name => `export const ${name} = props => {
  ${['ActionButton', 'RetryButton'].includes(name) ? 'globalThis.__quoteFriendsButtons.push(props);' : ''}
  return globalThis.__quoteFriendsReact.createElement(${JSON.stringify(['ActionButton', 'RetryButton'].includes(name) ? 'button' : 'div')},
    {disabled: props.disabled, role: props.role, type: props.type}, props.children);
};`).join('\n');
const modules = {
  'react-router-dom': url('export const useNavigate=()=>()=>{};'),
  '@/components/Search/Search': url('export default ()=>null;'),
  '@/components/ToastModal/ToastModal': url('export default props=>props.errorMessage ? globalThis.__quoteFriendsReact.createElement("div", {role:"status"}, props.errorMessage) : null;'),
  '@/hooks/queries/useFriendQueries': url('export const useFriendsQuery=()=>globalThis.__quoteFriendsState;'),
  '@/hooks/queries/useProfileQueries': url('export const useMyProfileQuery=()=>({data:{id:1},isSuccess:true});'),
  '@/hooks/queries/useQuoteQueries': url(`export const useQuoteTagRequestsQuery=()=>globalThis.__quoteRequestsState;
    export const useCreateQuoteMutation=()=>({mutateAsync:async payload=>{globalThis.__quotePublishedPayload=payload;},isPending:false});
    export const useSaveQuoteTagsMutation=useCreateQuoteMutation;`),
  '@/utils/quote/quoteInput': await utility('quoteInput'),
  '@/utils/quote/quoteTags': await utility('quoteTags'),
  './NewQuote.styles': url(styles),
};
for (const path of ['tag-checkbox-checked', 'tag-checkbox-unchecked']) {
  modules[`@/assets/icons/quote-feed/${path}.svg`] = url('export default "icon";');
}
const code = transpile(source).replace(/from "([^"]+)"/g, (_, spec) => `from "${modules[spec] ?? import.meta.resolve(spec)}"`);
const { default: NewQuote } = await import(url(code));
function render(friends, mode = 'create', requests = {}, quote = {}) {
  globalThis.__quoteFriendsState = { isSuccess: false, isError: false, isFetching: false, refetch: async () => {}, ...friends };
  globalThis.__quoteRequestsState = { data: [], isSuccess: true, ...requests };
  globalThis.__quoteFriendsButtons = [];
  return renderToStaticMarkup(React.createElement(NewQuote, { mode, quote: { id: 1, content: '정상 명언', tags: [], ...quote } }));
}
const submit = () => globalThis.__quoteFriendsButtons.find(button => ['게시하기', '수정하기'].includes(button.children));

test('friend lookup failure announces a toast without exposing a retry button or a false empty state', () => {
  const html = render({ isError: true });
  assert.match(html, /role="status">태그 정보를 불러오지 못했어요/);
  assert.doesNotMatch(html, /태그할 수 있는 친구가 없어요|다시 불러오기|다시 시도/);
  assert.equal(submit().disabled, true);
});

test('loading does not look empty; successful empty refetch allows untagged publication', () => {
  const loading = render({ isFetching: true });
  assert.match(loading, /친구 목록을 불러오는 중/);
  assert.doesNotMatch(loading, /태그할 수 있는 친구가 없어요/);
  assert.equal(submit().disabled, true);
  const recovered = render({ data: [], isSuccess: true });
  assert.match(recovered, /태그할 수 있는 친구가 없어요/);
  assert.doesNotMatch(recovered, /친구 목록을 불러오지 못했어요/);
  assert.equal(submit().disabled, false);
});

test('tag editing also recovers friend errors and still waits for tag requests', () => {
  render({ isError: true }, 'fix');
  assert.equal(submit().disabled, true);
  const pending = render({ data: [], isSuccess: true }, 'fix', { isSuccess: false });
  assert.doesNotMatch(pending, /태그할 수 있는 친구가 없어요/);
  assert.equal(submit().disabled, true);
  render({ data: [], isSuccess: true }, 'fix');
  assert.equal(submit().disabled, false);
});


test('publication forwards selected AI summary and original but direct writing has neither', async () => {
  const ai = { content: '선택한 명언', summary: '선택한 명언', originalContent: '오늘 하루를 돌아보며 충분히 긴 원문을 기록합니다' };
  for (const quote of [ai, { content: '직접 쓴 명언' }]) {
    render({ data: [], isSuccess: true }, 'create', {}, quote);
    await submit().onClick();
    assert.equal(globalThis.__quotePublishedPayload.content, quote.content);
    assert.equal(globalThis.__quotePublishedPayload.summary, quote.summary);
    assert.equal(globalThis.__quotePublishedPayload.originalContent, quote.originalContent);
  }
});
