import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/codePoint.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { countCodePoints, sliceCodePoints, codePointInputProps } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

test('counts Korean and supplementary emoji by code point', () => {
  assert.equal(countCodePoints('가나다'), 3);
  assert.equal(countCodePoints('😀'.repeat(30)), 30);
  // 결합 문자/ZWJ 이모지는 보이는 글자 단위가 아닌 코드포인트 단위다.
  assert.equal(countCodePoints('e\u0301'), 2);
  assert.equal(countCodePoints('👨‍👩‍👧‍👦'), 7);
});

test('truncation never splits supplementary characters', () => {
  assert.equal(sliceCodePoints('가😀나😀', 3), '가😀나');
  for (const limit of [10, 20, 30, 50]) {
    assert.equal(sliceCodePoints('😀'.repeat(limit + 1), limit), '😀'.repeat(limit));
  }
});

test('paste applies code-point limit and composition waits until completion', () => {
  let value;
  const props = codePointInputProps(next => { value = next; }, 2);
  props.onChange({ currentTarget: { value: '😀😀😀' }, nativeEvent: { isComposing: false } });
  assert.equal(value, '😀😀');
  props.onChange({ currentTarget: { value: '가나다' }, nativeEvent: { isComposing: true } });
  assert.equal(value, '가나다');
  props.onCompositionEnd({ currentTarget: { value: '가나다' } });
  assert.equal(value, '가나');
});
