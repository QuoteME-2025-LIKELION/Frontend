import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const url=code=>`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const react=url(`
export const useState=initial=>{const h=globalThis.__inviteHarness;const i=h.next++;if(!(i in h.values))h.values[i]=initial;return [h.values[i],value=>{h.values[i]=typeof value==='function'?value(h.values[i]):value}];};
export const useRef=initial=>{const h=globalThis.__inviteHarness;const i=h.next++;return h.values[i]??={current:initial};};
export const useMemo=fn=>fn(); export const useCallback=fn=>fn; export const useEffect=()=>{};`);
const styles=url(`export const Container='main', Content='content', Title='h2', FriendList='list', PendingSection='pending-section', EmptyBox='empty', Footer='footer', LinkInviteButton='link-invite-button';`);
const queries=url(`export const useGroupQuery=()=>({data:globalThis.__inviteHarness.data.group});
export const useGroupSentInvitationsQuery=()=>({data:globalThis.__inviteHarness.data.sent,isPending:false,isError:false,...globalThis.__inviteHarness.data.sentQuery});
export const useInviteGroupMemberMutation=()=>({mutateAsync:globalThis.__inviteHarness.invite});
export const useCancelGroupInvitationMutation=()=>({mutateAsync:globalThis.__inviteHarness.cancel});`);
const friends=url(`export const useFriendsQuery=()=>({data:globalThis.__inviteHarness.data.friends,isPending:false,isError:false,...globalThis.__inviteHarness.data.friendQuery});`);
const source=await readFile(new URL('../src/pages/Group/pages/Invite/Invite.tsx',import.meta.url),'utf8');
let code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
const mappings={react, 'react/jsx-runtime':import.meta.resolve('react/jsx-runtime'), axios:import.meta.resolve('axios'), './Invite.styles':styles,
 'react-router-dom':url(`export const useParams=()=>({groupId:'1'});export const useNavigate=()=>path=>globalThis.__inviteHarness.paths.push(path);`),
 '@/hooks/queries/useFriendQueries':friends, '@/hooks/queries/useGroupQueries':queries,
 '@/hooks/ui/useDebounce':url('export default value=>value;'),
};
for(const name of ['ConfirmModal','Header','PageTitle','Search','ToastModal','UserListItem']) mappings[`@/components/${name}/${name}`]=url(`export default '${name}';`);
for(const [from,to] of Object.entries(mappings))code=code.replaceAll(`"${from}"`,JSON.stringify(to));
const Invite=(await import(url(code))).default;
function nodes(tree){if(tree==null||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)];}
function fixture(){
 const h={next:0,values:[],paths:[],calls:[],data:{group:{members:[{id:1},{id:2}]},friends:[{id:2,nickname:'이미멤버'},{id:6,nickname:'새친구'},{id:7,nickname:'대기친구'}],sent:[{requestId:201,requesterId:7,requesterNickname:'대기친구',requesterIntroduction:'소개'}]}};
 h.invite=async vars=>{h.calls.push(['invite',vars]);h.data.sent.push({requestId:202,requesterId:vars.friendId,requesterNickname:'새친구'});};
 h.cancel=async vars=>{h.calls.push(['cancel',vars]);h.data.sent=h.data.sent.filter(item=>item.requestId!==vars.requestId);};
 globalThis.__inviteHarness=h;
 h.render=()=>{h.next=0;return nodes(Invite());};
 return h;
}
const items=tree=>tree.filter(n=>n.type==='UserListItem');
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('only available friends can be invited; pending request retains requestId and link button shows an unimplemented-feature toast',()=>{
 const h=fixture();let tree=h.render();
 assert.deepEqual(items(tree).map(n=>[n.props.friend.id,n.props.actionButton.text]),[[6,'초대'],[7,'취소']]);
 const link=tree.find(n=>n.type==='link-invite-button');assert.notEqual(link.props.disabled,true);link.props.onClick();
 assert.ok(h.render().some(n=>n.type==='ToastModal' && n.props.text==='아직 구현되지 않은 기능이에요'));
 assert.deepEqual(h.calls,[]);
 tree.find(n=>n.type==='Search').props.onChange({target:{value:'대기친구'}});
 tree=h.render();assert.equal(items(tree).filter(n=>n.props.actionButton.text==='초대').length,0);
 assert.equal(items(tree)[0].props.friend.introduction,'소개');
 tree.find(n=>n.type==='Search').props.onClear();assert.equal(items(h.render()).filter(n=>n.props.actionButton.text==='초대').length,1);
});
test('invite confirmation locks duplicate actions and cancellation returns recipient to candidates after query data changes',async()=>{
 const h=fixture();let release;const original=h.invite;h.invite=vars=>new Promise(resolve=>{release=async()=>{await original(vars);resolve();};});
 let tree=h.render();items(tree)[0].props.actionButton.onClick();assert.deepEqual(h.calls,[]);
 tree=h.render();const modal=tree.find(n=>n.type==='ConfirmModal');const pending=modal.props.onConfirm();
 await modal.props.onConfirm();tree=h.render();assert.ok(items(tree).every(n=>n.props.actionButton.disabled));
 tree.find(n=>n.type==='ConfirmModal').props.onClose();assert.ok(h.render().some(n=>n.type==='ConfirmModal'));
 await release();await pending;tree=h.render();assert.equal(h.calls.length,1);
 assert.ok(tree.some(n=>n.type==='ToastModal'&&n.props.text==='초대 요청을 보냈어요'));
 items(tree).find(n=>n.props.friend.id===6).props.actionButton.onClick();await settle();tree=h.render();
 assert.deepEqual(h.calls,[['invite',{groupId:'1',friendId:6}],['cancel',{groupId:'1',requestId:202}]]);
 assert.ok(items(tree).some(n=>n.props.friend.id===6&&n.props.actionButton.text==='초대'));
});
test('cancel failure keeps pending row, shows error and releases processing lock',async()=>{
 const h=fixture();h.cancel=async()=>{throw Error('network');};
 items(h.render()).find(n=>n.props.actionButton.text==='취소').props.actionButton.onClick();await settle();
 const tree=h.render();const pending=items(tree).find(n=>n.props.actionButton.text==='취소');assert.equal(pending.props.friend.id,7);assert.equal(pending.props.actionButton.disabled,false);
 assert.ok(tree.some(n=>n.type==='ToastModal'&&n.props.text.includes('취소에 실패')));
 assert.equal(tree.some(n=>n.type==='ToastModal'&&n.props.text==='그룹 초대를 취소했어요'),false);
});
test('loading/error states avoid inviting from incomplete lists; capacity blocks POST and empty pending section disappears',async()=>{
 const h=fixture();h.data.sent=[];h.data.sentQuery={isPending:true};assert.equal(items(h.render()).length,0);
 h.data.sentQuery={isError:true};assert.equal(items(h.render()).length,0);
 h.data.sentQuery={};h.data.group.members=[{id:1},{id:2},{id:3},{id:4},{id:5}];
 let tree=h.render();assert.equal(tree.some(n=>n.type==='pending-section'),false);
 items(tree)[0].props.actionButton.onClick();tree=h.render();await tree.find(n=>n.type==='ConfirmModal').props.onConfirm();
 assert.deepEqual(h.calls,[]);assert.ok(h.render().some(n=>n.type==='ToastModal'&&n.props.redText?.includes('최대 인원 5명')));
});
