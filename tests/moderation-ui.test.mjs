import { createSourceLoader } from './helpers/loadSource.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const read = file => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
const previewUrl = await createSourceLoader(source => source.replace('import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true"', 'true'))('stores/useModerationPreviewStore.ts');
const productionUrl = await createSourceLoader(source => source.replace('import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true"', 'false'))('stores/useModerationPreviewStore.ts');
const reasonsUrl = await createSourceLoader()('pages/Main/components/ReportDialog/reportReasons.ts');
const preview = await import(previewUrl);
const production = await import(productionUrl);

const reactStub = url(`
export const useId = () => 'moderation-title';
export const useEffect = () => {};
export const useState = initial => {
  const state = globalThis.__moderationHarness;
  const index = state.next++;
  if (!(index in state.values)) state.values[index] = initial;
  return [state.values[index], value => {state.values[index] = typeof value === 'function' ? value(state.values[index]) : value;}];
};
export const useRef = initial => {
  const state = globalThis.__moderationHarness;
  const index = state.next++;
  return state.values[index] ??= {current:initial};
};`);
const styleUrl = url(`export const MenuWrap='div', MoreButton='button', Menu='div', MenuItem='button',
Overlay='dialog', ReportPanel='form', Title='h2', ReasonList='fieldset', Reason='label', Details='textarea', Actions='div';`);
const modalUrl = url('export default ()=>({current:null});');
async function component(file) {
  let code = compile(await read(file));
  for (const [from, to] of Object.entries({
    'react/jsx-runtime': import.meta.resolve('react/jsx-runtime'),
    react: reactStub,
    './QuoteActionsMenu.styles': styleUrl,
    './ReportDialog.styles': styleUrl,
    './reportReasons': reasonsUrl,
    '@/hooks/ui/useModalDialog': modalUrl,
  })) code = code.replaceAll(`"${from}"`, JSON.stringify(to));
  return (await import(url(code))).default;
}
const Menu = await component('components/QuoteFeed/QuoteActionsMenu.tsx');
const Report = await component('pages/Main/components/ReportDialog/ReportDialog.tsx');
function harness(Component, props) {
  const state={next:0,values:[]};
  return () => {globalThis.__moderationHarness=state;state.next=0;return Component(props);};
}
function all(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat(Infinity).flatMap(all)];
}
const find = (tree, predicate) => all(tree).find(predicate);
const preventDefault = () => {};

test('dropdown opens, invokes report/block separately, and closes with Escape or outside focus', () => {
  let reports=0,blocks=0;
  const render=harness(Menu,{authorName:'친구',onReport:()=>reports++,onBlock:()=>blocks++});
  let tree=render();
  const trigger=()=>find(tree,node=>node.props?.['aria-haspopup']==='menu');
  assert.equal(trigger().props['aria-expanded'],false);
  trigger().props.onClick();tree=render();
  assert.equal(all(tree).filter(node=>node.props?.role==='menuitem').length,2);
  find(tree,node=>node.props?.role==='menuitem').props.onClick();tree=render();
  assert.equal(reports,1);assert.equal(blocks,0);assert.equal(trigger().props['aria-expanded'],false);
  trigger().props.onClick();tree=render();
  all(tree).filter(node=>node.props?.role==='menuitem')[1].props.onClick();tree=render();
  assert.equal(blocks,1);
  trigger().props.onClick();tree=render();
  tree.props.onKeyDown({key:'Escape',preventDefault,stopPropagation(){}});tree=render();
  assert.equal(trigger().props['aria-expanded'],false);
  trigger().props.onClick();tree=render();
  tree.props.onBlur({currentTarget:{contains:()=>false},relatedTarget:null});tree=render();
  assert.equal(trigger().props['aria-expanded'],false);
});

test('report allows one reason, requires nonblank other text, and excludes AI by default', () => {
  let submitted,closed=0;
  const render=harness(Report,{authorName:'친구',onClose:()=>closed++,onSubmit:(...args)=>{submitted=args;}});
  let tree=render();
  const boxes=()=>all(tree).filter(node=>node.type==='input');
  const submit=()=>find(tree,node=>node.props?.type==='submit');
  const send=()=>find(tree,node=>node.type==='form').props.onSubmit({preventDefault});
  assert.equal(boxes().length,7);assert.equal(submit().props.disabled,true);
  assert.equal(all(tree).some(node=>node.props?.children==='AI가 만든 문장이 이상해요'),false);
  send();assert.equal(submitted,undefined);
  boxes()[3].props.onChange({target:{checked:true}});tree=render();
  boxes()[6].props.onChange({target:{checked:true}});tree=render();
  assert.equal(boxes()[3].props.checked,false);
  assert.equal(boxes().filter(node=>node.props.checked).length,1);
  assert.equal(submit().props.disabled,true);
  find(tree,node=>node.type==='textarea').props.onChange({target:{value:'   '}});tree=render();
  send();assert.equal(submitted,undefined);
  assert.equal(submit().props.disabled,true);
  find(tree,node=>node.type==='textarea').props.onChange({target:{value:'  추가 사유  '}});tree=render();
  assert.equal(submit().props.disabled,false);send();
  assert.deepEqual(submitted,['other','추가 사유']);
  boxes()[3].props.onChange({target:{checked:true}});tree=render();
  assert.equal(find(tree,node=>node.type==='textarea'),undefined);send();
  assert.deepEqual(submitted,['privacy','']);
  boxes()[3].props.onChange({target:{checked:false}});tree=render();
  assert.equal(submit().props.disabled,true);
  find(tree,node=>node.props?.children==='취소').props.onClick();assert.equal(closed,1);
  tree.props.onCancel({preventDefault});assert.equal(closed,2);
});

test('report exposes AI reason only for a confirmed AI quote', () => {
  let submitted;
  const render=harness(Report,{authorName:'친구',isAiGenerated:true,onClose(){},onSubmit:(...args)=>{submitted=args;}});
  let tree=render();
  const boxes=all(tree).filter(node=>node.type==='input');
  assert.equal(boxes.length,8);
  boxes[5].props.onChange({target:{checked:true}});tree=render();
  find(tree,node=>node.type==='form').props.onSubmit({preventDefault});
  assert.deepEqual(submitted,['ai','']);
});

test('preview blocking uses fixture IDs, deduplicates and separates sessions; live mode cannot change blocks', () => {
  const state=preview.useModerationPreviewStore.getState();
  const target={quoteId:2,nickname:'동명이인'};
  assert.equal(state.block(1,target),true);
  assert.equal(state.block(1,target),true);
  assert.equal(state.block(1,{...target,quoteId:3}),true);
  assert.equal(state.block(1,{...target,quoteId:999}),false);
  assert.equal(preview.useModerationPreviewStore.getState().blockedBySession[1].length,2);
  assert.equal(preview.useModerationPreviewStore.getState().blockedBySession[2],undefined);
  state.unblock(1,2);
  assert.deepEqual(preview.useModerationPreviewStore.getState().blockedBySession[1].map(member=>member.memberId),[6]);
  assert.equal(production.useModerationPreviewStore.getState().block(1,target),false);
  assert.deepEqual(production.useModerationPreviewStore.getState().blockedBySession,{});
});
