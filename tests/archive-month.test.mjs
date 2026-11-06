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
const apiSource = await readFile(new URL('../src/api/archiveApi.ts', import.meta.url), 'utf8');
const axiosModule = `import axios from "${import.meta.resolve('axios')}"; export default axios.create({ baseURL: 'http://localhost' });`;
const axiosUrl = `data:text/javascript;base64,${Buffer.from(axiosModule).toString('base64')}`;
const apiCode = ts.transpileModule(apiSource.replace('"@/api/api"', JSON.stringify(axiosUrl)), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { archiveApi } = await import(`data:text/javascript;base64,${Buffer.from(apiCode).toString('base64')}`);

test('bookmark month parameter filters by quote creation month and survives removal refetch', async () => {
  server.listen({ onUnhandledRequest: 'error' });
  try {
    const all = (await archiveApi.getBookmarkedArchives()).data;
    assert.equal(all.length, 1);
    assert.equal((await archiveApi.getBookmarkedArchives('2025-11')).data.length, 1);
    assert.deepEqual((await archiveApi.getBookmarkedArchives('2025-10')).data, []);
    await assert.rejects(archiveApi.getBookmarkedArchives('2025-13'), error => error.response?.status === 400);
    await fetch('http://localhost/api/quotes/6/bookmark', { method: 'DELETE' });
    assert.deepEqual((await archiveApi.getBookmarkedArchives('2025-11')).data, []);
    await fetch('http://localhost/api/quotes/6/bookmark', { method: 'POST' });
    assert.equal((await archiveApi.getBookmarkedArchives('2025-11')).data.length, 1);
  } finally {
    server.close();
  }
});
