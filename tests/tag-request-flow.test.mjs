import assert from 'node:assert/strict';
import test from 'node:test';
import { setupServer } from 'msw/node';
import { createSourceLoader } from './helpers/loadSource.mjs';

// 브라우저용 상대 API 경로를 Node에서도 같은 origin으로 해석한다.
globalThis.location = new URL("http://localhost");

const { handlers } = await import(await createSourceLoader()('mocks/handlers.ts'));
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
