import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/saveQuoteTags.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { saveQuoteTags } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const requests = [
  { requestId: 10, requesterId: 2, requesterName: '선택' },
  { requestId: 11, requesterId: 3, requesterName: '미선택' },
];

test('accepts selected requests before PATCH and leaves unselected requests untouched', async () => {
  const calls = [];
  await saveQuoteTags([1, 2, 2], requests,
    async id => { calls.push(['accept', id]); },
    async ids => { calls.push(['patch', ids]); });
  assert.deepEqual(calls, [['accept', 10], ['patch', [1, 2]]]);
});

test('does not PATCH when acceptance fails; retry uses refreshed pending requests', async () => {
  let patched = false;
  const accepted = [];
  await assert.rejects(saveQuoteTags([2, 3], requests, async id => {
    if (id === 11) throw new Error('network');
    accepted.push(id);
  }, async () => { patched = true; }));
  assert.equal(patched, false);
  assert.deepEqual(accepted, [10]);
  await saveQuoteTags([2, 3], requests.filter(request => request.requestId !== 10),
    async id => { accepted.push(id); }, async () => { patched = true; });
  assert.deepEqual(accepted, [10, 11]);
  assert.equal(patched, true);
});

test('unselecting all only updates tags; PATCH errors propagate without rejecting requests', async () => {
  let accepts = 0;
  let payload;
  await saveQuoteTags([], requests, async () => { accepts++; }, async ids => { payload = ids; });
  assert.equal(accepts, 0);
  assert.deepEqual(payload, []);
  await assert.rejects(saveQuoteTags([2], requests, async () => {}, async () => { throw new Error('patch'); }));
});
