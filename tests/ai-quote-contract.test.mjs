import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
globalThis.__aiContractHooks = {
  useState(initial) {
    const state = globalThis.__aiContractState, i = state.next++;
    if (!(i in state.values)) state.values[i] = initial;
    return [state.values[i], value => { state.values[i] = typeof value === 'function' ? value(state.values[i]) : value; }];
  },
  useEffect() {}, useRef: initial => ({ current: initial }), useMemo: fn => fn(),
  useNavigate: () => () => {}, useLocation: () => ({ state: null }),
  useAiUsageQuery: () => ({ data: { usedCount: 0, remainingCount: 1, limitPerDay: 1 } }),
  getAiRequestState: () => 'available',
  useAuthStore: selector => selector({ sessionVersion: 1 }),
  useModerationPreviewStore: selector => selector({ block() {} }),
  useMyQuoteTagRequestQuery: () => ({ data: { status: 'NONE' } }),
};
async function loadComponent(file) {
  const source = await readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
  const styles = [...new Set([...source.matchAll(/\bS\.(\w+)/g)].map(m => m[1]))];
  const code = compile(source).replace(/import\s+([\s\S]*?)\s+from\s+"([^"]+)";/g, (statement, clause, spec) => {
    if (spec === 'react/jsx-runtime') return statement.replace(spec, import.meta.resolve(spec));
    let stub;
    if (clause.startsWith('* as')) stub = styles.map(name => `export const ${name}='div';`).join('\n');
    else {
      const names = clause.startsWith('{') ? clause.slice(1, -1).split(',').map(x => x.trim()).filter(Boolean) : ['default'];
      stub = names.map(name => {
        const key = name === 'default' ? spec.split('/').at(-1) : name;
        const value = key === 'isModerationPreview' ? 'false' : key === 'formatDateToYYYYMMDD' ? '()=>"2026-11-14"' :
          `globalThis.__aiContractHooks[${JSON.stringify(key)}] ?? function ${key.replace(/\W/g, '')}(){return {mutateAsync:async()=>{}}}`;
        return name === 'default' ? `export default ${value};` : `export const ${name}=${value};`;
      }).join('\n');
    }
    return statement.replace(`"${spec}"`, JSON.stringify(url(stub)));
  });
  return (await import(url(code))).default;
}
const Write = await loadComponent('pages/Main/Write.tsx');
const FeedList = await loadComponent('pages/Main/components/FeedList/FeedList.tsx');
function harness(Component, props) {
  const state = { next: 0, values: [] };
  return () => { globalThis.__aiContractState = state; state.next = 0; return Component(props); };
}
function all(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat(Infinity).flatMap(all)];
}
const find = (tree, predicate) => all(tree).find(predicate);
test('feed report passes only explicit server true to ReportDialog', () => {
  for (const flag of [true, false, undefined, null, 'true']) {
    const render = harness(FeedList, {
      otherQuotes: [{ id: 2, authorNickname: '친구', content: '명언', isAiGenerated: flag }],
      unwrittenMembers: [], groups: [], isGroupsReady: true, selectedGroupId: null,
      onSelectGroup() {}, onShare() {}, isLoading: false,
    });
    const item = find(render(), node => node.type?.name === 'FeedListItem');
    const card = item.type(item.props);
    card.props.onReport();
    const dialog = find(render(), node => node.props?.authorName === '친구' && typeof node.props?.onSubmit === 'function');
    assert.equal(dialog.props.isAiGenerated, flag === true);
  }
});
test('AI selection preserves original and summary; returning to direct replaces AI draft', () => {
  const render = harness(Write, {});
  let tree = render();
  find(tree, node => typeof node.props?.onAI === 'function').props.onAI('오늘 하루를 돌아보며 충분히 긴 원문을 기록합니다');
  tree = render();
  find(tree, node => typeof node.props?.onSelectComplete === 'function').props.onSelectComplete('선택한 추천 명언');
  tree = render();
  let editor = find(tree, node => node.props?.quote);
  assert.equal(editor.props.quote.summary, '선택한 추천 명언');
  assert.equal(editor.props.quote.originalContent, '오늘 하루를 돌아보며 충분히 긴 원문을 기록합니다');
  editor.props.onBack();
  tree = render();
  find(tree, node => typeof node.props?.onSelectComplete === 'function').props.onBack();
  tree = render();
  find(tree, node => typeof node.props?.onComplete === 'function').props.onComplete({ content: '직접 쓴 명언' });
  editor = find(render(), node => node.props?.quote);
  assert.equal(editor.props.quote.content, '직접 쓴 명언');
  assert.equal(editor.props.quote.summary, undefined);
  assert.equal(editor.props.quote.originalContent, undefined);
});


test('quote transport serializes direct and AI creation with the existing server contract', async () => {
  const calls = [];
  globalThis.__aiContractTransport = { post: async (path, body) => calls.push([path, JSON.parse(JSON.stringify(body))]) };
  const stub = url('export default globalThis.__aiContractTransport;');
  const source = await readFile(new URL('../src/api/quoteApi.ts', import.meta.url), 'utf8');
  const { quoteApi } = await import(url(compile(source).replace('"@/api/api"', JSON.stringify(stub))));
  await quoteApi.createQuote({ content: '직접 쓴 명언', taggedMemberIds: [] });
  await quoteApi.createQuote({ content: '추천 명언', originalContent: '기록한 원문', summary: '추천 명언', taggedMemberIds: [2] });
  assert.deepEqual(calls, [
    ['/api/quotes', { content: '직접 쓴 명언', taggedMemberIds: [] }],
    ['/api/quotes', { content: '추천 명언', originalContent: '기록한 원문', summary: '추천 명언', taggedMemberIds: [2] }],
  ]);
  delete globalThis.__aiContractTransport;
});
