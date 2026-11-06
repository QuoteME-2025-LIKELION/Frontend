import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { setupServer } from 'msw/node';
import ts from 'typescript';

// 브라우저용 상대 API 경로를 Node에서도 같은 origin으로 해석한다.
globalThis.location = new URL("http://localhost");

const source = await readFile(new URL('../src/mocks/handlers.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const code = outputText.replace('from "msw"', `from "${import.meta.resolve('msw')}"`);
const { handlers } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const server = setupServer(...handlers);

test('nonfriend acceptance permits PATCH while unselected request stays pending', async () => {
  server.listen({ onUnhandledRequest: 'error' });
  try {
    const request = (path, method = 'GET', body) => fetch(`http://localhost${path}`, {
      method, ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    assert.equal((await request('/api/quotes/1/tags', 'PATCH', { taggedMemberIds: [8] })).status, 400);
    assert.equal((await request('/api/quotes/requests/102/accept', 'POST')).status, 200);
    let quotes = await (await request('/api/quotes?date=2026-11-06')).json();
    assert.ok(quotes.myQuotes[0].tags.some(tag => tag.memberId === 8));
    assert.equal((await request('/api/quotes/1/tags', 'PATCH', { taggedMemberIds: [91, 92, 8] })).status, 200);
    const remaining = await (await request('/api/quotes/1/requests')).json();
    assert.deepEqual(remaining.map(item => item.requestId), [101]);
    quotes = await (await request('/api/quotes?date=2026-11-06')).json();
    assert.ok(!quotes.myQuotes[0].tags.some(tag => tag.memberId === 2));
    assert.equal((await request('/api/quotes/requests/102/accept', 'POST')).status, 404);
  } finally {
    server.close();
  }
});
