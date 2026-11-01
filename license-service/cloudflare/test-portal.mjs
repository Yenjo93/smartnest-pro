import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import worker from './worker.mjs';
const ORIGIN='https://smartnest.pro';
const ADMIN='portal-test-owner-token-not-for-production';
const PASSWORD='portal-test-panel-password-only';
function fixture(t){
 const db=new DatabaseSync(':memory:'); db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));t.after(()=>db.close());
 const DB={prepare(sql){const statement=db.prepare(sql);let args={};const result={bind(...values){args=Object.fromEntries(values.map((value,i)=>[String(i+1),value]));return result;},async first(){return statement.get(args)??null;},async all(){return {results:statement.all(args)};},async run(){return {meta:{changes:statement.run(args).changes}};}};return result;}};
 const env={DB,SMARTNEST_ADMIN_TOKEN:ADMIN,SMARTNEST_PANEL_PASSWORD:PASSWORD,RATE_LIMITER:{async limit(){return {success:true};}},PUBLIC_REQUEST_LIMITER:{async limit(){return {success:true};}}};
 function call(path,data,extra={}){return worker.fetch(new Request(ORIGIN+path,{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json',Origin:ORIGIN,...extra},...(data===undefined?{}:{body:JSON.stringify(data)})}),env);}
 return {env,db,call};
}
function form(){return {submission_id:crypto.randomUUID(),type:'license',plan:'1_year',name:'Test Customer',contact_method:'email',contact:'test@example.invalid',license_reference:'',message:'',consent:true,website:''};}
test('public six-page portal renders without secrets, with executable hashed scripts and local-only assets',async t=>{
 const {call}=fixture(t);
 for(const path of ['/','/license','/renew','/support','/patreon','/privacy']){
  const response=await call(path);assert.equal(response.status,200,path);const html=await response.text(),csp=response.headers.get('Content-Security-Policy');
  assert.ok(!html.includes(ADMIN)&&!html.includes(PASSWORD));assert.match(html,/lang="ar"/);assert.match(csp,/font-src 'self'/);assert.doesNotMatch(csp,/unsafe-inline|unsafe-eval/);
  for(const tag of ['script','style'])for(const block of html.matchAll(new RegExp('<'+tag+'[^>]*>([\\s\\S]*?)</'+tag+'>','g'))){
   if(tag==='script')new vm.Script(block[1]);
   const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(block[1])));assert.ok(csp.includes("'sha256-"+btoa(String.fromCharCode(...digest))+"'"));
  }
 }
});
test('portal intake reaches only authenticated owner board and creates no license',async t=>{
 const {call,db}=fixture(t);const submission=await call('/v1/public/requests',form());assert.equal(submission.status,201);const ack=await submission.json();assert.ok(ack.reference);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM licenses').get().n,0);
 assert.equal((await call('/v1/admin/requests?status=all&search=Test')).status,401);
 const login=await call('/v1/admin/login',{password:PASSWORD});const cookie=login.headers.get('Set-Cookie').split(';')[0];
 const listed=await call('/v1/admin/requests?status=new&search=Test',undefined,{Cookie:cookie});assert.equal(listed.status,200);const data=await listed.json();assert.equal(data.requests[0].reference,ack.reference);
 const id=data.requests[0].id;
 assert.equal((await call('/v1/admin/requests/'+id+'/update',{status:'closed'},{Cookie:cookie,Origin:'https://evil.example'})).status,403);
 assert.equal((await call('/v1/admin/requests/'+id+'/update',{status:'closed',admin_note:'Handled test'},{Cookie:cookie})).status,200);
 assert.equal((await call('/v1/admin/site',{patreon_url:'https://www.patreon.com/c/test'},{Cookie:cookie,Origin:'https://evil.example'})).status,403);
 assert.equal((await call('/v1/admin/site',{patreon_url:'https://www.patreon.com/c/test'},{Cookie:cookie})).status,200);
 assert.deepEqual(await (await call('/v1/public/site')).json(),{patreon_url:'https://www.patreon.com/c/test'});
});
test('license host root remains admin redirect and public host has no public request lookup',async t=>{
 const {env,call}=fixture(t);const response=await worker.fetch(new Request('https://licenses.smartnest.pro/'),env);assert.equal(response.status,302);assert.equal(response.headers.get('Location'),'https://licenses.smartnest.pro/admin');
 assert.equal((await call('/v1/public/requests')).status,404);assert.equal((await call('/v1/public/requests/SNREQ-example')).status,404);
 assert.equal((await call('/v1/admin/requests?unsupported=1',undefined,{Authorization:'Bearer '+ADMIN})).status,400);
});
test('annual offer and free calendar-month trial replace public legacy plans',async t=>{
 const {call}=fixture(t);
 const html=await (await call('/license')).text();
 assert.match(html,/35 USD/);assert.match(html,/شهر تجربة مجاني/);assert.match(html,/Patreon/);
 for(const plan of ['3_months','6_months','lifetime']){
  assert.ok(!html.includes('value="'+plan+'"'));
  assert.equal((await call('/v1/public/requests',{...form(),plan})).status,400);
 }
 assert.equal((await call('/v1/public/requests',{...form(),plan:'trial_month'})).status,201);
 assert.equal((await call('/v1/public/requests',{...form(),type:'renewal',plan:'trial_month'})).status,400);
 const created=await call('/v1/admin/licenses',{plan:'trial_month',customer_name:'Trial customer'},{Authorization:'Bearer '+ADMIN});
 assert.equal(created.status,201);const record=await created.json();
 const start=new Date(record.created_at*1000),end=new Date(record.expires_at*1000);
 const target=new Date(start);const day=target.getUTCDate();target.setUTCDate(1);target.setUTCMonth(target.getUTCMonth()+1);const last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();target.setUTCDate(Math.min(day,last));
 assert.equal(end.getTime(),target.getTime());
});
test('payment guide is prominent and creator URL never implies annual billing is ready',async t=>{
 const {call}=fixture(t);
 for(const path of ['/','/license','/renew','/patreon']){
  const html=await (await call(path)).text();
  assert.match(html,/id="payment-title"/);
  assert.match(html,/href="https:\/\/www\.patreon\.com\/c\/Yenjo93"/);
  assert.match(html,/الدفع السنوي غير مفعّل حاليًا/);
  assert.match(html,/لا تختار الباقة الشهرية/);
  assert.match(html,/رقم العملية ورقم طلبك/);
  assert.doesNotMatch(html,/الدفع عبر Patreon متاح|patreon\.com\/[0-9]+\/join/);
  assert.equal((html.match(/id="patreon-live"/g)||[]).length,1);
 }
});
