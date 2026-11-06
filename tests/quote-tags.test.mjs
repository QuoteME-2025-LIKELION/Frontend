import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/quoteTags.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getTagCandidates } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('keeps same-nickname members distinct and preserves tags outside the friend list', () => {
  const candidates = getTagCandidates(
    [{ id: 1, nickname: '동명' }, { id: 2, nickname: '동명' }],
    [{ memberId: 2, nickname: '동명', profileImage: '/2.png' }, { memberId: 3, nickname: '이전 친구', profileImage: '/3.png' }],
    [{ requestId: 10, requesterId: 2, requesterName: '동명' }]
  );
  assert.deepEqual(candidates.map(member => member.id), [1, 2, 3]);
  assert.equal(candidates.find(member => member.id === 2).profileImage, '/2.png');
  assert.equal(candidates.find(member => member.id === 3).profileImage, '/3.png');
});

test('renamed tags are matched by id and requests do not overwrite tag photos', () => {
  const candidates = getTagCandidates(
    [{ id: 1, nickname: '이전 이름' }],
    [{ memberId: 1, nickname: '새 이름', profileImage: '/1.png' }],
    [{ requestId: 10, requesterId: 1, requesterName: '이전 이름' }, { requestId: 11, requesterId: 2, requesterName: '요청자' }]
  );
  assert.deepEqual(candidates, [{ id: 1, nickname: '새 이름', profileImage: '/1.png' }, { id: 2, nickname: '요청자' }]);
});
