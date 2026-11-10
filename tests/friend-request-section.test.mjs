import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const react = url(`export const useId=()=> 'requests'; export const useState=initial=>[globalThis.__requestDirection ?? initial, value=>{globalThis.__requestDirection=value}];`);
const styles = url(`export const Section='section', RequestTabs='nav', RequestTab='button', FriendList='div', RequestItem='article', SentRequestItem='article', RequestProfileImg='img', RequestDefaultProfileImg='span', RequestUserBox='div', RequestUsername='strong', RequestIntro='p', RequestCancelActionBox='aside', RequestActionBox='aside', EmptyBox='div', EmptyTitle='p';`);
const source = await readFile(new URL('../src/pages/FriendGroup/components/FriendRequestSection.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText
.replace('"react"', JSON.stringify(react)).replace('"../FriendGroup.styles"', JSON.stringify(styles))
.replace('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const Section = (await import(url(code))).default;
function nodes(tree) {
  if (tree == null || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
const received = { requestId: 101, senderId: 8, senderNickname: '받은상대', direction: 'RECEIVED' };
const sent = { requestId: 202, senderId: 1, senderNickname: '나', receiverId: 9, receiverNickname: '보낸상대', receiverIntroduction: '보낸소개', receiverProfileImage: '/receiver.png', direction: 'SENT' };
const props = { requests: [received, sent], onAccept() {}, onReject() {}, onCancel() {} };
test('tab switching displays recipient data and cancellation passes receiverId instead of requestId', () => {
  globalThis.__requestDirection = undefined;
  const calls = [];
  const input = { ...props, onAccept: id=>calls.push(['accept',id]), onReject: id=>calls.push(['reject',id]), onCancel: id=>calls.push(['cancel',id]) };
  let tree = nodes(Section(input));
  tree.find(n=>n.props?.['aria-label']==='받은상대 친구 요청 승인').props.onClick();
  tree.find(n=>n.props?.['aria-label']==='받은상대 친구 요청 거절').props.onClick();
  assert.equal(tree.some(n=>n.props?.['aria-label']?.includes('보낸상대')), false);
  tree.find(n=>n.props?.id==='requests-sent').props.onClick();
  tree = nodes(Section(input));
  assert.equal(tree.find(n=>n.type==='img').props.src, '/receiver.png');
  assert.ok(tree.some(n=>n.props?.children==='보낸소개'));
  const cancel = tree.find(n=>n.props?.['aria-label']==='보낸상대에게 보낸 친구 요청 취소');
  assert.equal(cancel.props.disabled, false);
  cancel.props.onClick();
  assert.deepEqual(calls, [['accept',101], ['reject',101], ['cancel',9]]);
});
test('only nonempty request tabs are shown and selection falls back to the remaining direction', () => {
  for (const direction of ['RECEIVED', 'SENT']) {
    globalThis.__requestDirection = direction;
    assert.equal(Section({ ...props, requests: [] }), null);
    for (const [requests, tabId, nickname] of [
      [[received], 'requests-received', '받은상대'],
      [[sent], 'requests-sent', '보낸상대'],
    ]) {
      const tree = nodes(Section({ ...props, requests }));
      const tabs = tree.filter(n=>n.type==='button' && n.props.id);
      assert.equal(tabs.length, 1);
      assert.equal(tabs[0].props.id, tabId);
      assert.equal(tabs[0].props['aria-pressed'], true);
      assert.equal(tree.filter(n=>n.type==='article').length, 1);
      assert.ok(tree.some(n=>n.props?.children===nickname));
      assert.equal(tree.some(n=>n.props?.children?.includes?.('없어요')), false);
    }
  }
});
test('pending cancellation disables sent actions; absent receiverId cannot trigger a request', () => {
  globalThis.__requestDirection = 'SENT';
  let tree = nodes(Section({ ...props, pendingCancellationId: 9 }));
  assert.equal(tree.find(n=>n.props?.['aria-label']?.includes('취소')).props.disabled, true);
  const calls = [];
  tree = nodes(Section({ ...props, requests: [{ ...sent, receiverId: undefined }], onCancel: id=>calls.push(id) }));
  const cancel = tree.find(n=>n.props?.['aria-label']?.includes('취소'));
  assert.equal(cancel.props.disabled, true);
  cancel.props.onClick();
  assert.deepEqual(calls, []);
});
