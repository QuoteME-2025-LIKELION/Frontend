import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const codePointUrl = `data:text/javascript;base64,${Buffer.from(compile(await readFile(new URL('../src/utils/codePoint.ts', import.meta.url), 'utf8'))).toString('base64')}`;
const source = (await readFile(new URL('../src/utils/quoteInputBoundary.ts', import.meta.url), 'utf8'))
  .replace('"./codePoint"', JSON.stringify(codePointUrl));
const { fitQuoteInsertion, bindQuoteInputBoundary } = await import(
  `data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`
);

function setup(value, start = value.length, end = start) {
  const listeners = new Map();
  let changed;
  const field = {
    value, selectionStart: start, selectionEnd: end,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name),
    setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; },
  };
  const dispose = bindQuoteInputBoundary(field, value => { changed = value; }, 50);
  return { field, listeners, dispose, changed: () => changed };
}

test('blocks the 51st code point and newline before DOM mutation; allows replacement and deletion', () => {
  const { field, listeners } = setup('가'.repeat(50));
  const blocked = options => {
    let prevented = false;
    listeners.get('beforeinput')({ cancelable: true, isComposing: false,
      inputType: 'insertText', data: '😀', preventDefault() { prevented = true; }, ...options });
    return prevented;
  };
  assert.equal(blocked({}), true);
  assert.equal(blocked({ inputType: 'insertLineBreak', data: null }), true);
  field.selectionStart = 49;
  assert.equal(blocked({}), false);
  field.selectionStart = 50;
  assert.equal(blocked({ inputType: 'deleteContentBackward', data: null }), false);
  field.value = '가'.repeat(49);
  field.selectionStart = field.selectionEnd = 49;
  assert.equal(blocked({}), false);
  assert.equal(blocked({ isComposing: true }), false);
  assert.equal(blocked({ cancelable: false }), false);
});

test('paste fills remaining budget without splitting emoji or deleting the unselected suffix', () => {
  const original = '가'.repeat(48) + '😀나';
  const { field, listeners, dispose, changed } = setup(original, 48, 50);
  let prevented = false;
  listeners.get('paste')({ clipboardData: { getData: () => '😁😁😁' },
    preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(changed(), '가'.repeat(48) + '😁나');
  assert.equal(field.selectionStart, 50);
  assert.equal(field.selectionEnd, 50);
  dispose();
  assert.equal(listeners.size, 0);
});

test('paste normalizes line endings and uses the full 50 code point budget for emoji', () => {
  assert.deepEqual(fitQuoteInsertion('', 0, 0, '😀'.repeat(51), 50),
    { value: '😀'.repeat(50), caret: 100 });
  assert.deepEqual(fitQuoteInsertion('앞뒤', 1, 1, '\r\n가\r나', 50),
    { value: '앞\n가\n나뒤', caret: 5 });
  assert.deepEqual(fitQuoteInsertion('가'.repeat(50), 50, 50, '더', 50),
    { value: '가'.repeat(50), caret: 50 });
});
