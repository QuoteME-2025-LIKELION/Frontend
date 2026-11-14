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
Overlay='dialog', ReportPanel='form', Title='h2', ReasonList='fieldset', Reason='label', Details='textarea', Actions='div', Container='div', List='div', Empty='p';`);
const modalUrl = url('export default ()=>({current:null});');
async function component(file) {
  let code = compile(await read(file));
  for (const [from, to] of Object.entries({
    'react/jsx-runtime': import.meta.resolve('react/jsx-runtime'),
    react: reactStub,
    './UserActionsMenu.styles': styleUrl,
    './ReportDialog.styles': styleUrl,
    './BlockedMembers.styles': styleUrl,
    'react-router-dom': url('export const useNavigate=()=>()=>{};'),
    '@/components/ConfirmModal/ConfirmModal': url('export default function ConfirmModal(){}'),
    '@/components/Header/Header': url('export default function Header(){}'),
    '@/components/PageTitle/PageTitle': url('export default function PageTitle(){}'),
    '@/components/ToastModal/ToastModal': url('export default function ToastModal(){}'),
    '@/components/UserListItem/UserListItem': url('export default function UserListItem(){}'),
    '@/stores/useAuthStore': url('export default selector=>selector({sessionVersion:1});'),
    '@/stores/useModerationPreviewStore': url('export const isModerationPreview=true, EMPTY_BLOCKED_MEMBERS=[]; export const useModerationPreviewStore=selector=>selector(globalThis.__blockedState);'),
    './reportReasons': reasonsUrl,
    '@/hooks/ui/useModalDialog': modalUrl,
  })) code = code.replaceAll(`"${from}"`, JSON.stringify(to));
  return (await import(url(code))).default;
}
const Menu = await component('components/UserActionsMenu/UserActionsMenu.tsx');
const Blocked = await component('pages/Setting/BlockedMembers/BlockedMembers.tsx');
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


test('friend menu deletes or blocks without invoking report', () => {
  let deleted=0,blocked=0;
  const render=harness(Menu,{authorName:'친구',onDelete:()=>deleted++,onBlock:()=>blocked++});
  let tree=render();
  const open=()=>{find(tree,node=>node.props?.['aria-haspopup']==='menu').props.onClick();tree=render();};
  open();
  let items=all(tree).filter(node=>node.props?.role==='menuitem');
  assert.equal(items.length,2);
  assert.ok(all(items[0]).some(node=>[node.props?.children].flat().includes('삭제하기')));
  items[0].props.onClick();tree=render();assert.equal(deleted,1);assert.equal(blocked,0);
  open();items=all(tree).filter(node=>node.props?.role==='menuitem');
  items[1].props.onClick();assert.equal(deleted,1);assert.equal(blocked,1);
});

test('unblock waits for confirmation; cancel preserves member and confirm updates list and toast', () => {
  const member={memberId:2,nickname:'친구'};
  const calls=[];
  globalThis.__blockedState={blockedBySession:{1:[member]},unblock:(session,id)=>{
    calls.push([session,id]);globalThis.__blockedState.blockedBySession[session]=[];
  }};
  const render=harness(Blocked,{});
  let tree=render();
  const dialog=()=>find(tree,node=>node.props?.confirmText==='해제');
  const row=()=>find(tree,node=>node.props?.actionButton?.text==='차단 해제');
  row().props.actionButton.onClick();tree=render();
  assert.deepEqual(calls,[]);assert.ok(row());
  assert.equal(dialog().props.question,'친구님의 차단을 해제할까요?');
  dialog().props.onClose();tree=render();assert.equal(dialog(),undefined);assert.ok(row());
  row().props.actionButton.onClick();tree=render();dialog().props.onConfirm();tree=render();
  assert.deepEqual(calls,[[1,2]]);assert.equal(row(),undefined);
  assert.ok(find(tree,node=>node.props?.children==='차단한 사용자가 없어요'));
  assert.ok(find(tree,node=>node.props?.text==='차단을 해제했어요'));
});

test('friend preview block uses actual member ID and production refuses it', () => {
  const member={id:42,nickname:'이름이 같아도 ID로 구분'};
  assert.equal(preview.useModerationPreviewStore.getState().blockMember(3,member),true);
  assert.equal(preview.useModerationPreviewStore.getState().blockMember(3,member),true);
  assert.deepEqual(preview.useModerationPreviewStore.getState().blockedBySession[3].map(item=>item.memberId),[42]);
  assert.equal(production.useModerationPreviewStore.getState().blockMember(3,member),false);
});
