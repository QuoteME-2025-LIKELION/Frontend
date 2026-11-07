import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import { QueryClient, QueryObserver } from '@tanstack/react-query';

const utility = await readFile(new URL('../src/utils/quote/aiUsage.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(utility, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { normalizeAiUsage, getAiRequestState } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const hooks = await readFile(new URL('../src/hooks/queries/useQuoteQueries.ts', import.meta.url), 'utf8');
const summaryHook = hooks.match(/export function useQuoteSummaryQuery\([\s\S]*?\n\}/)[0];
const compiled = ts.transpileModule(summaryHook.replace('export ', ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
const loadSummary = (quoteApi) => new Function('useQuery', 'quoteApi', 'quoteQueryKeys',
  `${compiled}; return useQuoteSummaryQuery;`)(options => options, quoteApi, {
  summary: content => ['quotes', 'summary', content],
});

test('server one-use contract switches from available to exhausted; failed lookup stays unavailable', () => {
  const unused = normalizeAiUsage({ used: 0, remaining: 1, limit: 1 });
  const used = normalizeAiUsage({ used: 1, remaining: 0, limit: 1 });
  assert.deepEqual(unused, { usedCount: 0, remainingCount: 1, limitPerDay: 1 });
  assert.equal(getAiRequestState(unused, false, false), 'available');
  assert.equal(getAiRequestState(used, false, false), 'exhausted');
  assert.equal(getAiRequestState(used, true, false), 'loading');
  assert.equal(getAiRequestState(used, false, true), 'unavailable');
  assert.throws(() => normalizeAiUsage({ used: 0, limit: 1 }));
});

test('one successful generation remains selectable after exhaustion without another generation POST', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  let calls = 0;
  const options = loadSummary({ summarizeQuote: async () => {
    calls++;
    return { data: { summaries: ['추천 명언'] } };
  } });
  const observer = new QueryObserver(client, options('오늘 하루를 돌아보는 충분히 긴 글입니다', false));
  const unsubscribe = observer.subscribe(() => {});
  try {
    observer.setOptions(options('오늘 하루를 돌아보는 충분히 긴 글입니다', true));
    await observer.refetch();
    observer.setOptions(options('오늘 하루를 돌아보는 충분히 긴 글입니다', false));
    assert.equal(calls, 1);
    assert.deepEqual(observer.getCurrentResult().data.summaries, ['추천 명언']);
    // Usage reloads can toggle enabled; cached generation must not repeat.
    observer.setOptions(options('오늘 하루를 돌아보는 충분히 긴 글입니다', true));
    assert.equal(calls, 1);
  } finally { unsubscribe(); client.clear(); }
});

test('empty results do not imply exhaustion and server errors are not automatically retried', async () => {
  assert.equal(getAiRequestState(normalizeAiUsage({ used: 0, remaining: 1, limit: 1 }), false, false), 'available');
  const options = loadSummary({ summarizeQuote: async () => { throw new Error('429'); } });
  const client = new QueryClient();
  try {
    const config = options('긴 일기 내용', true);
    assert.equal(config.retry, false);
    await assert.rejects(client.fetchQuery(config), /429/);
  } finally { client.clear(); }
});
