import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { QueryClient } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import ts from 'typescript';

const url = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const read = file => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
const clientUrl = url(`import axios from "${import.meta.resolve('axios')}"; export default axios.create({baseURL:'http://localhost'});`);
const apiUrl = url(compile((await read('api/appVersionApi.ts')).replace('"@/api/api"', JSON.stringify(clientUrl))));
const query = await import(url(compile(await read('hooks/useAppVersionQuery.ts'))
  .replace('"@tanstack/react-query"', JSON.stringify(url('export const useQuery=options=>options;')))
  .replace('"@/api/appVersionApi"', JSON.stringify(apiUrl))));
const server = setupServer(http.get('http://localhost/api/app-version', () => HttpResponse.json({latestVersion:'2.3.4',updateNote:'업데이트'})));

test('version query uses server value, rejects invalid/failed responses and enables only while drawer is active', async () => {
  server.listen({onUnhandledRequest:'error'});
  const client = new QueryClient({defaultOptions:{queries:{retry:false}}});
  try {
    assert.equal(query.useAppVersionQuery(false).enabled, false);
    const options = query.useAppVersionQuery(true);
    const data = await client.fetchQuery(options);
    assert.equal(data.latestVersion, '2.3.4');
    server.use(http.get('http://localhost/api/app-version', () => HttpResponse.json({latestVersion:''})));
    await assert.rejects(options.queryFn(), /Invalid app version/);
    server.use(http.get('http://localhost/api/app-version', () => new HttpResponse(null,{status:500})));
    await assert.rejects(options.queryFn(), error => error.response?.status === 500);
  } finally {client.clear();server.close();}
});

const component = await read('pages/Main/components/HomeSideMenu/HomeSideMenu.tsx');
const body = component.match(/const handleCopyMail = async \(\) => \{([\s\S]*?)\n  \};/)[1];
const runCopy = (navigator, document, HTMLElement) => {
  const messages=[];
  const handle = new Function('navigator','document','HTMLElement','CONTACT_EMAIL','showToast','console','dialogRef',
    `return async()=>{${body}}`)(navigator,document,HTMLElement,'abc123456@gmail.com',message=>messages.push(message),{error:()=>{}},{current:null});
  return handle().then(()=>messages);
};

test('email click copies displayed address and reports rejection without claiming success', async () => {
  let copied;
  const messages = await runCopy({clipboard:{writeText:async text=>{copied=text;}}});
  assert.equal(copied,'abc123456@gmail.com');
  assert.deepEqual(messages,['메일 주소가 복사되었습니다.']);
  assert.deepEqual(await runCopy({clipboard:{writeText:async()=>{throw Error('denied');}}}),['메일 주소 복사에 실패했습니다.']);
});

test('legacy copy cleans up temporary element and restores focus even when copying fails', async () => {
  let removed=0,focused=0;
  class Element {isConnected=true;focus(){focused++;}}
  const doc={activeElement:new Element(),body:{appendChild(){}},
    createElement:()=>({style:{},focus(){},select(){},remove(){removed++;}}),
    execCommand:()=>{throw Error('copy failed');}};
  assert.deepEqual(await runCopy({},doc,Element),['메일 주소 복사에 실패했습니다.']);
  assert.equal(removed,1);
  assert.equal(focused,1);
});
