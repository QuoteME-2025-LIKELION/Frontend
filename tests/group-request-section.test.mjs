import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const url = code=>`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const styles = url(`export const Section='section', Title='h2', RequestTabs='nav', RequestTab='button', RequestList='div', RequestItem='article', RequestProfileImg='img', RequestDefaultProfileImg='span', RequestUserBox='div', RequestUsername='strong', RequestIntro='p', RequestCancelActionBox='aside', RequestActionBox='aside';`);
const react = url(`export const useId=()=> 'group-requests'; export const useState=initial=>[globalThis.__groupRequestTab ?? initial, value=>{globalThis.__groupRequestTab=value}];`);
async function load(file, joins) {
  const source = await readFile(new URL('../src/pages/Group/components/'+file, import.meta.url),'utf8');
  let code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText
    .replace('"react"',JSON.stringify(react)).replace('"react/jsx-runtime"',JSON.stringify(import.meta.resolve('react/jsx-runtime')))
    .replace('"../Group.styles"',JSON.stringify(styles));
  if (joins) code=code.replace('"./GroupJoinRequestSection"',JSON.stringify(joins));
  return url(code);
}
const Section = (await import(await load('GroupRequestSection.tsx',await load('GroupJoinRequestSection.tsx')))).default;
function nodes(tree) {
  if(tree==null || typeof tree!=='object') return [];
  if(Array.isArray(tree)) return tree.flatMap(nodes);
  if(typeof tree.type==='function') return nodes(tree.type(tree.props));
  return [tree,...nodes(tree.props?.children)];
}
const invitation={requestId:201,requesterId:6,requesterNickname:'초대상대',requesterIntroduction:'초대소개',requesterProfileImage:'/invite.png'};
const request={requestId:5,requesterId:10,requesterNickname:'신청상대',requesterIntroduction:'신청소개'};
const props={invitations:[invitation],requests:[request],onCancel(){},onAccept(){},onReject(){}};
test('leader tabs show invitee profile, cancel requestId, then preserve join accept/reject callbacks',()=>{
  globalThis.__groupRequestTab=undefined;
  const calls=[];
  const input={...props,onCancel:id=>calls.push(['cancel',id]),onAccept:id=>calls.push(['accept',id]),onReject:id=>calls.push(['reject',id])};
  let tree=nodes(Section(input));
  assert.equal(tree.find(n=>n.type==='img').props.src,'/invite.png');
  assert.ok(tree.some(n=>n.props?.children==='초대소개'));
  tree.find(n=>n.props?.['aria-label']==='초대상대 그룹 초대 취소').props.onClick();
  tree.find(n=>n.props?.id==='group-requests-requests').props.onClick();
  tree=nodes(Section(input));
  assert.ok(tree.some(n=>n.props?.children==='신청소개'));
  tree.find(n=>n.props?.['aria-label']==='신청상대 그룹 가입 요청 수락').props.onClick();
  tree.find(n=>n.props?.['aria-label']==='신청상대 그룹 가입 요청 거절').props.onClick();
  assert.deepEqual(calls,[['cancel',201],['accept',5],['reject',5]]);
});
test('empty directions disappear, remaining direction is selected and in-flight actions disable',()=>{
  for(const tab of ['invitations','requests']) {
    globalThis.__groupRequestTab=tab;
    assert.equal(Section({...props,invitations:[],requests:[]}),null);
    for(const input of [{...props,invitations:[]},{...props,requests:[]}]) {
      const tree=nodes(Section({...input,pendingRequestId:201}));
      const tabs=tree.filter(n=>n.type==='button' && n.props.id);
      assert.equal(tabs.length,1);
      assert.equal(tabs[0].props['aria-pressed'],true);
      for(const button of tree.filter(n=>n.type==='button' && n.props['aria-label'])) assert.equal(button.props.disabled,true);
    }
  }
});
