import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/groupInvitationError.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getGroupInvitationErrorMessage, GROUP_CAPACITY_MESSAGE } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const fallback = '그룹 초대 수락에 실패했습니다.';

test('recognizes the user-verified server capacity response and hides code prefix', () => {
  assert.equal(getGroupInvitationErrorMessage(400, {
    resultCode: '400', message: '400-1 - 최대 인원 5명이 가득 차 들어갈 수 없어요', statusCode: 400,
  }), GROUP_CAPACITY_MESSAGE);
  assert.equal(getGroupInvitationErrorMessage(400, { message: GROUP_CAPACITY_MESSAGE }), GROUP_CAPACITY_MESSAGE);
  assert.equal(getGroupInvitationErrorMessage(400, { msg: GROUP_CAPACITY_MESSAGE }), GROUP_CAPACITY_MESSAGE);
});

test('other 400 or 400-1 errors do not become capacity errors', () => {
  for (const body of [{ resultCode: '400' }, { resultCode: '400-1', message: '잘못된 요청' },
    { message: '400-1 - 이미 존재하는 이메일' }, null, '', { message: 123 }]) {
    assert.equal(getGroupInvitationErrorMessage(400, body), fallback);
  }
});

test('network errors, permissions and 500 remain generic even with a matching message', () => {
  for (const status of [undefined, 401, 403, 404, 409, 500]) {
    assert.equal(getGroupInvitationErrorMessage(status, { message: GROUP_CAPACITY_MESSAGE }), fallback);
  }
});
