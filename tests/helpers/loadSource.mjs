import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const sourceRoot = fileURLToPath(new URL('../../src/', import.meta.url));

/** 분리된 실제 소스와 의존 모듈을 같은 캐시로 읽어 MSW 공유 상태를 유지한다. */
export function createSourceLoader(transform = source => source) {
  const cache = new Map();
  async function load(path) {
    const absolute = resolve(sourceRoot, path);
    if (cache.has(absolute)) return cache.get(absolute);
    const pending = (async () => {
      const source = transform(await readFile(absolute, 'utf8'));
      let code = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      const imports = [...code.matchAll(/from ["']([^"']+)["']/g)];
      for (const [, specifier] of imports) {
        let target;
        if (specifier.startsWith('@/') || specifier.startsWith('.')) {
          const dependency = specifier.startsWith('@/') ? resolve(sourceRoot, specifier.slice(2))
            : resolve(dirname(absolute), specifier);
          let extension;
          for (const suffix of ['.ts', '.tsx']) {
            try { await readFile(dependency + suffix); extension = suffix; break; }
            catch (error) { if (error.code !== 'ENOENT') throw error; }
          }
          if (!extension) throw new Error(`모듈을 찾을 수 없습니다: ${dependency}`);
          target = await load(dependency + extension);
        } else target = import.meta.resolve(specifier);
        code = code.replaceAll(`"${specifier}"`, JSON.stringify(target));
      }
      return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
    })();
    cache.set(absolute, pending);
    return pending;
  }
  return load;
}
