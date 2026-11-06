import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/archiveDate.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { isFutureArchiveMonth, getArchiveMonthInYear, getArchiveDateInMonth, isFutureArchiveDate } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const today = new Date(2026, 10, 7);
const parts = date => [date.getFullYear(), date.getMonth(), date.getDate()];

test('blocks future months across year boundaries, but not later days of the current month', () => {
  assert.equal(isFutureArchiveMonth(new Date(2026, 10, 30), today), false);
  assert.equal(isFutureArchiveMonth(new Date(2026, 11, 1), today), true);
  assert.equal(isFutureArchiveMonth(new Date(2027, 0, 1), today), true);
  assert.equal(isFutureArchiveMonth(new Date(2025, 11, 1), today), false);
  const december = new Date(2026, 11, 31);
  assert.equal(isFutureArchiveMonth(new Date(2027, 0, 1), december), true);
  const january = new Date(2026, 0, 1);
  assert.equal(isFutureArchiveMonth(new Date(2025, 11, 31), january), false);
});

test('year picker can return from a past December to this year without selecting a future month', () => {
  const result = getArchiveMonthInYear(new Date(2025, 11, 1), 2026, today);
  assert.deepEqual(parts(result), [2026, 10, 1]);
  assert.equal(isFutureArchiveMonth(result, today), false);
  assert.equal(getArchiveMonthInYear(result, 2027, today), null);
  assert.deepEqual(parts(getArchiveMonthInYear(new Date(2025, 11, 1), 2024, today)), [2024, 11, 1]);
});

test('selected day stays in an allowed target month, respects month-end and still blocks future dates', () => {
  assert.deepEqual(parts(getArchiveDateInMonth(new Date(2026, 9, 31), 2026, 10, today)), [2026, 10, 7]);
  assert.deepEqual(parts(getArchiveDateInMonth(new Date(2026, 9, 31), 2024, 1, today)), [2024, 1, 29]);
  assert.equal(isFutureArchiveDate(today, today), false);
  assert.equal(isFutureArchiveDate(new Date(2026, 10, 8), today), true);
});
