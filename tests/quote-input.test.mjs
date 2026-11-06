import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/quoteInput.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { hasQuoteText, getQuoteInputError } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

test('blocks empty, jamo, digits, symbols and emoji, including mixed junk', () => {
  for (const value of ['', '  \n ', 'ㅋㅋㅋ', 'ㄱㄴㅏ', 'ᄀᄂ', 'ﾡﾢ', '12345', '１２３', '!!!', '😀😀', '👨‍👩‍👧‍👦', 'ㅋㅋ123!!😀']) {
    assert.equal(hasQuoteText(value), false, value);
    for (const mode of ['quote', 'ai']) assert.notEqual(getQuoteInputError(value, mode), null, value);
  }
});

test('allows real letters, multilingual text and mixed emoji/jamo without changing input', () => {
  for (const value of ['오늘ㅋㅋ', '오늘도 힘내😀', 'hello!', '你好', 'こんにちは', 'café', '가', '가']) {
    assert.equal(hasQuoteText(value), true, value);
    assert.equal(getQuoteInputError(value, 'quote'), null, value);
  }
});

test('preserves quote 30 and AI 16–50 code point limits after trimming', () => {
  assert.equal(getQuoteInputError('가'.repeat(30), 'quote'), null);
  assert.notEqual(getQuoteInputError('가'.repeat(31), 'quote'), null);
  assert.notEqual(getQuoteInputError('가'.repeat(15), 'ai'), null);
  assert.equal(getQuoteInputError('  ' + '가'.repeat(16) + '\n', 'ai'), null);
  assert.equal(getQuoteInputError('가'.repeat(50), 'ai'), null);
  assert.notEqual(getQuoteInputError('가'.repeat(51), 'ai'), null);
  assert.equal(getQuoteInputError('가' + '😀'.repeat(29), 'quote'), null);
  assert.notEqual(getQuoteInputError('가' + '😀'.repeat(30), 'quote'), null);
  assert.equal(getQuoteInputError('가' + '😀'.repeat(15), 'ai'), null);
});
