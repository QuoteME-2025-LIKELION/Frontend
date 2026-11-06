import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/quoteTags.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getTagCandidates, hasInvalidTagSelection } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('keeps same-nickname members distinct and preserves tags outside the friend list', () => {
  const candidates = getTagCandidates(
    [{ id: 1, nickname: '동명' }, { id: 2, nickname: '동명' }],
    [{ memberId: 2, nickname: '동명', profileImage: '/2.png' }, { memberId: 3, nickname: '이전 친구', profileImage: '/3.png' }]
  );
  assert.deepEqual(candidates.map(member => member.id), [1, 2, 3]);
  assert.equal(candidates.find(member => member.id === 2).profileImage, '/2.png');
  assert.equal(candidates.find(member => member.id === 3).profileImage, '/3.png');
});

test('renamed tags are matched by id', () => {
  const candidates = getTagCandidates(
    [{ id: 1, nickname: '이전 이름' }],
    [{ memberId: 1, nickname: '새 이름', profileImage: '/1.png' }]
  );
  assert.deepEqual(candidates, [{ id: 1, nickname: '새 이름', profileImage: '/1.png' }]);
});


test('allows only friends or existing tags and excludes self even in malformed friend data', () => {
  const friends = [{ id: 1, nickname: '나' }, { id: 2, nickname: '친구' }];
  const tags = [{ memberId: 3, nickname: '이전 친구' }];
  assert.deepEqual(getTagCandidates(friends, tags, 1).map(member => member.id), [2, 3]);
  assert.equal(hasInvalidTagSelection([2, 3], friends, tags, 1), false);
  assert.equal(hasInvalidTagSelection([1], friends, tags, 1), true);
  assert.equal(hasInvalidTagSelection([8], friends, tags, 1), true);
  assert.equal(hasInvalidTagSelection([3], friends, [], 1), true);
});


test('pending requesters appear first without becoming direct tag candidates', () => {
  const friends = [{ id: 2, nickname: '동명' }];
  const tags = [{ memberId: 3, nickname: '이전 친구' }];
  const requests = [{ requestId: 10, requesterId: 8, requesterName: '동명' }];
  assert.deepEqual(getTagCandidates(friends, tags, 1, requests).map(member => member.id), [8, 2, 3]);
  assert.equal(hasInvalidTagSelection([8], friends, tags, 1), true);
});
