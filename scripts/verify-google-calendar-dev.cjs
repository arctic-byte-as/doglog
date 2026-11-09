const { PrismaClient } = require('@prisma/client');
const { randomUUID, randomBytes, createHash } = require('node:crypto');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { spawnSync } = require('node:child_process');
require('@next/env').loadEnvConfig(process.cwd());
const deployment = process.argv[2], origin = 'https://doglog-development-tectrap-projects.vercel.app';
if (deployment !== origin || !process.env.DATABASE_URL?.includes('gksrxfnghehimzuiqyfs')) throw Error('Only the isolated Dev alias/database are allowed.');
const db = new PrismaClient(), dir = fs.mkdtempSync(path.join(os.tmpdir(),'google-calendar-check-')), trainerId = randomUUID(), tag = randomUUID();
const users = [], sessions = []; let sequence = 0;
function assert(ok, message) { if (!ok) throw Error(message); }
async function login(role) {
  const email = `calendar-${role.toLowerCase()}-${tag}@example.test`;
  if (role === 'TRAINER') await db.trainer.create({data:{id:trainerId,email,name:'Disposable Calendar check'}});
  const user = await db.user.create({data:{email,name:'Disposable Calendar check',role}}); users.push(user.id);
  const token = randomBytes(32).toString('base64url');
  const session = await db.session.create({data:{userId:user.id,sessionToken:createHash('sha256').update(token).digest('base64url'),expires:new Date(Date.now()+600000)}}); sessions.push(session.id); return token;
}
function request(route, token, method='GET', extra={}) {
  const bodyFile=path.join(dir,`${++sequence}.body`), headersFile=path.join(dir,`${sequence}.headers`);
  const args=['curl',route,'--deployment',deployment,'--','--silent','--show-error','--output',bodyFile,'--dump-header',headersFile,'--write-out','%{http_code}','--request',method];
  if(token)args.push('--header',`Cookie: doglog_session=${token}${extra.cookie ? `; ${extra.cookie}` : ''}`);
  if(extra.origin!==null)args.push('--header',`Origin: ${extra.origin || origin}`);
  const result=spawnSync('vercel',args,{encoding:'utf8',timeout:45000}); assert(result.status===0,`Request failed: ${method} ${route.split('?')[0]}`);
  const body=fs.readFileSync(bodyFile,'utf8'), headers=fs.readFileSync(headersFile,'utf8');let data;try{data=JSON.parse(body);}catch{}
  return {status:Number(result.stdout.trim().slice(-3)),body,headers,data};
}
(async()=>{
  const trainer=await login('TRAINER'), customer=await login('CUSTOMER');
  for(const route of ['connect','check','disconnect']) {
    assert(request(`/api/integrations/google/${route}`,null,'POST').status===401,`${route}: signed-out request denied`);
    assert(request(`/api/integrations/google/${route}`,customer,'POST').status===403,`${route}: customer request denied`);
  }
  const page=request('/services/consultations/google',trainer);
  assert(page.status===200 && page.body.includes('Connect Google Calendar') && !page.body.includes('setup is not complete'),'Configured trainer connection page is available');
  assert(!page.body.includes(process.env.GOOGLE_CALENDAR_CLIENT_SECRET),'No client secret in page response');
  assert(request('/api/integrations/google/connect',trainer,'POST',{origin:'https://external.example.test'}).status===403,'Cross-site connect denied');
  assert(request('/api/integrations/google/connect',trainer,'POST',{origin:null}).status===403,'Missing Origin denied');
  assert(request('/api/integrations/google/connect',trainer).status===405,'GET cannot start OAuth');
  const start=request('/api/integrations/google/connect',trainer,'POST'); assert(start.status===200,'Trainer can start Google consent');
  const url=new URL(start.data.url); assert(url.origin==='https://accounts.google.com','Google authorization host');
  assert(url.searchParams.get('client_id')===process.env.GOOGLE_CALENDAR_CLIENT_ID,'Correct Dev client ID');
  assert(url.searchParams.get('redirect_uri')===`${origin}/api/integrations/google/callback`,'Exact registered callback');
  assert(url.searchParams.get('code_challenge_method')==='S256' && url.searchParams.get('access_type')==='offline','Offline PKCE authorization');
  assert(start.headers.toLowerCase().includes('httponly') && start.headers.toLowerCase().includes('secure') && start.headers.toLowerCase().includes('samesite=lax'),'Protected OAuth cookie');
  const state=url.searchParams.get('state'), cookie=`norsepaw_google_calendar_state=${state}`;
  const row=await db.appContent.findUniqueOrThrow({where:{key:`google-calendar-state:${trainerId}`}});
  assert(!row.value.includes(state) && JSON.parse(row.value).v===1,'Pending state encrypted at rest');
  const invalid=request(`/api/integrations/google/callback?state=invalid&code=invalid`,trainer,'GET',{cookie});
  assert(invalid.status===303 && invalid.headers.includes('result=failed'),'Invalid callback state denied');
  const cancel=request(`/api/integrations/google/callback?state=${state}&error=access_denied`,trainer,'GET',{cookie});
  assert(cancel.status===303 && cancel.headers.includes('result=cancelled'),'Google cancellation safely returns to connection page');
  assert(!await db.appContent.findUnique({where:{key:`google-calendar-state:${trainerId}`}}),'Cancelled state consumed');
  assert(!await db.appContent.findUnique({where:{key:`google-calendar:${trainerId}`}}),'No connection created without Google consent');
  assert(request('/api/integrations/google/check',trainer,'POST').status===400,'Calendar check requires a saved connection');
  assert(request('/api/integrations/google/disconnect',trainer,'POST').status===200,'Disconnect safely clears trainer connection');
  console.log('PASS: Dev configuration, trainer/customer authentication, origin protection, PKCE/offline/registered callback, HttpOnly state cookie, encrypted state, rejected callback, cancelled authorization and disconnect. No Google events or invitations created.');
})().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(async()=>{
  await db.appContent.deleteMany({where:{key:{in:[`google-calendar:${trainerId}`,`google-calendar-state:${trainerId}`]}}});
  await db.session.deleteMany({where:{id:{in:sessions}}});await db.user.deleteMany({where:{id:{in:users}}});await db.trainer.deleteMany({where:{id:trainerId}});await db.$disconnect();fs.rmSync(dir,{recursive:true,force:true});
});
