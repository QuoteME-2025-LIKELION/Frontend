import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { QueryClient, MutationObserver } from '@tanstack/react-query';
import ts from 'typescript';

const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const compile = code => ts.transpileModule(code, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const read = file => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
globalThis.location = new URL('http://localhost');
const { handlers } = await import(url(compile(await read('mocks/handlers.ts'))
  .replace('from "msw"', `from "${import.meta.resolve('msw')}"`)));
const server = setupServer(...handlers);
const apiUrl = url(`import axios from "${import.meta.resolve('axios')}"; export default axios.create({baseURL:'http://localhost'});`);
const apiModule = async file => url(compile((await read(`api/${file}.ts`)).replace('"@/api/api"', JSON.stringify(apiUrl))));
const friendUrl = await apiModule('friendApi');
const groupUrl = await apiModule('groupApi');
const { friendApi } = await import(friendUrl);
const { groupApi } = await import(groupUrl);
const fakeHooks = url(`export const useMutation = options => options;
export const useQuery = options => options;
export const useQueryClient = () => globalThis.__cancellationClient;`);
const notificationUrl = url('export const notificationQueryKeys={all:["notifications"]};');
const friendHooksUrl = url(compile(await read('hooks/useFriendQueries.ts'))
  .replace('"@tanstack/react-query"', JSON.stringify(fakeHooks))
  .replace('"@/api/friendApi"', JSON.stringify(friendUrl))
  .replace('"@/hooks/useNotificationsQuery"', JSON.stringify(notificationUrl)));
const friendHooks = await import(friendHooksUrl);
const groupHooks = await import(url(compile(await read('hooks/useGroupQueries.ts'))
  .replace('"@tanstack/react-query"', JSON.stringify(fakeHooks))
  .replace('"@/api/groupApi"', JSON.stringify(groupUrl))
  .replace('"@/hooks/useFriendQueries"', JSON.stringify(friendHooksUrl))
  .replace('"@/hooks/useNotificationsQuery"', JSON.stringify(notificationUrl))));

const keys = [['friends', 'requests'], ['friends', 'search', 'test'], ['groups', 'sent-join-requests'], ['groups', 'detail', '20'], ['notifications', 'unread-count']];
function client() {
  const value = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } } });
  globalThis.__cancellationClient = value;
  for (const key of keys) value.setQueryData(key, ['original']);
  return value;
}

test('friend cancellation uses receiverId, removes only sent request, invalidates caches and permits resending', async () => {
  server.listen({ onUnhandledRequest: 'error' });
  const qc = client();
  try {
    // Existing received request is not cancellable and must remain intact.
    await assert.rejects(friendApi.cancelFriendRequest(8), error => error.response?.status === 403);
    await friendApi.rejectFriendRequest(12);
    await friendApi.requestFriend(8);
    const before = (await friendApi.getFriendRequests()).data;
    const sent = before.find(item => item.direction === 'SENT' && item.receiverId === 8);
    assert.ok(sent);
    assert.notEqual(sent.requestId, sent.receiverId);
    const mutation = new MutationObserver(qc, friendHooks.useCancelFriendRequestMutation());
    await mutation.mutate(sent.receiverId);
    assert.equal((await friendApi.getFriendRequests()).data.some(item => item.requestId === sent.requestId), false);
    assert.equal(qc.getQueryState(keys[0]).isInvalidated, true);
    assert.equal(qc.getQueryState(keys[1]).isInvalidated, true);
    assert.equal(qc.getQueryState(keys[4]).isInvalidated, true);
    await assert.rejects(friendApi.cancelFriendRequest(8), error => error.response?.status === 404);
    await friendApi.requestFriend(8);
    assert.equal((await friendApi.getFriendRequests()).data.filter(item => item.direction === 'SENT' && item.receiverId === 8).length, 1);
  } finally { server.close(); qc.clear(); }
});

test('sent group list, cancellation by requestId, failure preservation and resend use actual API methods', async () => {
  server.listen({ onUnhandledRequest: 'error' });
  const qc = client();
  try {
    await groupApi.requestJoin(20);
    const query = groupHooks.useGroupSentJoinRequestsQuery();
    const sent = await query.queryFn();
    assert.equal(sent.length, 1);
    assert.equal(sent[0].groupId, 20);
    assert.notEqual(sent[0].requestId, sent[0].groupId);
    const observer = new MutationObserver(qc, groupHooks.useCancelGroupJoinRequestMutation());
    server.use(http.delete('http://localhost/api/groups/join-requests/:id', () => HttpResponse.json({message:'already processed'}, {status:400})));
    await assert.rejects(observer.mutate(sent[0].requestId), error => error.response?.status === 400);
    assert.equal((await query.queryFn()).length, 1);
    assert.equal(qc.getQueryState(keys[2]).isInvalidated, false);
    server.resetHandlers();
    await assert.rejects(groupApi.cancelJoinRequest(5), error => error.response?.status === 403);
    await observer.mutate(sent[0].requestId);
    assert.deepEqual(await query.queryFn(), []);
    for (const key of keys) assert.equal(qc.getQueryState(key).isInvalidated, true);
    await assert.rejects(groupApi.cancelJoinRequest(sent[0].requestId), error => error.response?.status === 404);
    await groupApi.requestJoin(20);
    assert.equal((await query.queryFn()).length, 1);
  } finally { server.resetHandlers(); server.close(); qc.clear(); }
});
