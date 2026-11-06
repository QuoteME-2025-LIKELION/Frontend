import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/quoteShareImage.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getShareDate, getShareAuthor, wrapShareText, createQuoteShareImage } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

test('uses quote date, handles ISO date prefix and rejects invalid calendar dates', () => {
  assert.deepEqual(getShareDate('2023-10-31'), { month: 'oct', day: '31', weekday: '화요일' });
  assert.deepEqual(getShareDate('2023-10-31T23:59:00'), getShareDate('2023-10-31'));
  for (const date of ['', 'invalid', '2026-02-30', '2026-13-01']) {
    assert.throws(() => getShareDate(date));
  }
});

test('shows real birth year only, never adds a made-up year', () => {
  assert.equal(getShareAuthor('시베리아', '2001'), '시베리아 (2001~)');
  assert.equal(getShareAuthor('시베리아', 2001), '시베리아 (2001~)');
  for (const year of [null, undefined, '', 0, 'unknown', 9999]) {
    assert.equal(getShareAuthor('시베리아', year), '시베리아');
  }
});

test('wraps on words and preserves all content when a long word or emoji wraps', () => {
  const measure = (text) => Array.from(text).length;
  assert.deepEqual(wrapShareText('오늘도 힘내자', 5, measure), ['오늘도', '힘내자']);
  for (const text of ['가'.repeat(30), '오늘도😀힘내😀', 'hello longwordwithoutspaces']) {
    const lines = wrapShareText(text, 5, measure);
    assert.ok(lines.every(line => measure(line) <= 5));
    assert.equal(lines.join('').replaceAll(' ', ''), text.replaceAll(' ', ''));
  }
  assert.deepEqual(wrapShareText('첫째\n둘째', 10, measure), ['첫째', '둘째']);
  const words = 'abcdef ghijkl mnopqr stuvwx';
  assert.equal(wrapShareText(words, 10, measure).length, 4);
  const packed = wrapShareText(words, 10, measure, false);
  assert.equal(packed.length, 3);
  assert.equal(packed.join('').replaceAll(' ', ''), words.replaceAll(' ', ''));
});

test('renders a fixed 1080x1350 card using local background and selected quote data', async () => {
  const text = [];
  const backgrounds = [];
  const fonts = [];
  const textFonts = new Map();
  const ctx = {
    font: '',
    drawImage: (...args) => backgrounds.push(args),
    fillText(...args) { text.push(args); textFonts.set(args[0], this.font); },
    measureText(value) { return { width: Array.from(value).length * Number(/(\d+)px/.exec(this.font)?.[1] ?? 34) * 0.9 }; },
    beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
  };
  const canvas = { width: 0, height: 0, getContext: () => ctx,
    toBlob(callback, type) { callback(new Blob(['canvas-test'], { type })); } };
  const originalDocument = globalThis.document;
  const originalImage = globalThis.Image;
  globalThis.document = { fonts: { load: async (font) => { fonts.push(font); } }, createElement: () => canvas };
  globalThis.Image = class {
    set src(value) { this.path = value; queueMicrotask(() => this.onload()); }
  };
  try {
    const blob = await createQuoteShareImage({ date: '2023-10-31', content: '새까만 것보다는 회색이 낫다',
      authorName: '시베리아', authorBirthYear: '2001', taggedNames: ['로보', '모니카'] });
    assert.equal(blob.type, 'image/png');
    assert.equal(canvas.width, 1080);
    assert.equal(canvas.height, 1350);
    assert.equal(backgrounds[0][0].path, '/images/share/quote-background.png');
    for (const label of ['oct', '화요일', '31', '시베리아 (2001~)', 'with 로보, 모니카', 'QuoteMe']) {
      assert.ok(text.some(([value]) => value === label), label);
    }
    assert.ok(fonts.some(font => font.includes('"HSBombaram"')));
    assert.ok(textFonts.get('oct').includes('"HSBombaram"'));
    assert.ok(textFonts.get('31').includes('"HSBombaram"'));
    assert.ok(textFonts.get('화요일').includes('"KoPubWorldBatang"'));
    assert.equal(text.find(([value]) => value === 'oct')[2], 100);
    assert.equal(text.find(([value]) => value === '화요일')[2], 188);
    const quoteLines = text.filter(([value]) => ['새까만 것보다는', '회색이 낫다'].includes(value));
    assert.equal(quoteLines.length, 2);
    assert.ok(quoteLines.every(([value]) => textFonts.get(value) === '500 92px "KoPubWorldBatang"'));
    const lastQuoteY = quoteLines.at(-1)[2];
    const twoLineMarkY = text.find(([value]) => value === '“')[2];
    const markGap = quoteLines[0][2] - twoLineMarkY;
    text.length = 0;
    await createQuoteShareImage({ date: '2026-11-02', content: '한 줄 명언', authorName: '사용자' });
    const singleLineY = text.find(([value]) => value === '한 줄 명언')[2];
    const singleLineMarkY = text.find(([value]) => value === '“')[2];
    assert.equal(singleLineY, lastQuoteY);
    assert.equal(singleLineY - singleLineMarkY, markGap);
    assert.ok(singleLineMarkY > twoLineMarkY);
    text.length = 0;
    await createQuoteShareImage({ date: '2026-11-02', content: '가'.repeat(30), authorName: '사용자' });
    assert.ok(text.some(([value]) => value === '사용자'));
    assert.ok(!text.some(([value]) => value.startsWith('with ')));
    assert.equal(text.filter(([value]) => /^가+$/.test(value)).map(([value]) => value).join(''), '가'.repeat(30));
    const longLines = text.filter(([value]) => /^가+$/.test(value));
    assert.ok(longLines.every(([, , y]) => y < 993));
    assert.equal(longLines[0][2] - text.find(([value]) => value === '“')[2], markGap);
    for (const content of ['가\n나\n다\n라\n마', '가\r\n\r\n나\r\n다', '첫째\n\n둘째\n\n셋째',
      '가나다라마바 사아자차카타 파하가나다라 마바사아자차']) {
      text.length = 0;
      const data = { date: '2026-11-02', content, authorName: '사용자' };
      await createQuoteShareImage(data);
      assert.equal(data.content, content);
      const bodyLines = text.filter(([value]) => textFonts.get(value) === '500 92px "KoPubWorldBatang"');
      assert.ok(bodyLines.length <= 3);
      assert.equal(bodyLines.map(([value]) => value).join('').replace(/\s/g, ''), content.replace(/\s/g, ''));
      assert.ok(bodyLines.every(([, , y]) => y < 993));
      assert.equal(bodyLines[0][2] - text.find(([value]) => value === '“')[2], markGap);
    }
    await assert.rejects(createQuoteShareImage({ date: '2026-11-02', content: ' ', authorName: '사용자' }));
  } finally {
    if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
    if (originalImage === undefined) delete globalThis.Image; else globalThis.Image = originalImage;
  }
});
