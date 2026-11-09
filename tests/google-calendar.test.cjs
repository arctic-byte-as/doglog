const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript'), crypto = require('node:crypto');
function load(file, imports = {}) { const code = ts.transpileModule(fs.readFileSync(require.resolve(file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText; const exports = {}; new Function('require','exports',code)(id => id in imports ? imports[id] : require(id), exports); return exports; }
const config = load('../lib/google-calendar-config.ts'), encryption = load('../lib/google-calendar-crypto.ts');
process.env.GOOGLE_CALENDAR_ENABLED = 'true'; process.env.GOOGLE_CALENDAR_CLIENT_ID = 'test.apps.googleusercontent.com'; process.env.GOOGLE_CALENDAR_CLIENT_SECRET = 'test-secret'; process.env.GOOGLE_CALENDAR_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64'); process.env.GOOGLE_CALENDAR_REDIRECT_URI = 'https://dev.example.test/api/integrations/google/callback';
function fixture(options = {}) {
  const rows = new Map(); let tokenCalls = 0;
  const store = {
    async findUnique({where}) { return rows.get(where.key) || null; },
    async upsert({where,create,update}) { rows.set(where.key, { key: where.key, value: rows.has(where.key) ? update.value : create.value }); },
    async updateMany({where,data}) { const row = rows.get(where.key); if (!row || where.value && row.value !== where.value) return {count:0}; rows.set(where.key,{...row,...data}); return {count:1}; },
    async deleteMany({where}) { let count=0; for(const [key,row] of rows) if((typeof where.key==='string' ? key===where.key : where.key.in.includes(key)) && (!where.value || row.value===where.value)) {rows.delete(key);count++;} return {count}; },
  };
  class Client extends require('google-auth-library').OAuth2Client {
    async getToken() { tokenCalls++; return { tokens: { access_token:'private-access',refresh_token:'private-refresh',id_token:'verified-token',scope:config.googleCalendarScope,expiry_date:Date.now()+3600000, ...options.tokens } }; }
    async verifyIdToken() { return { getPayload: () => ({sub:'google-owner',email:'rob@example.test',email_verified:true,...options.identity}) }; }
    async request(request) { assert.equal(request.url, 'https://www.googleapis.com/calendar/v3/calendars/primary/events'); assert.deepEqual(request.params, { maxResults: 1, fields: 'accessRole' }); return { data:{ accessRole:options.role || 'owner' } }; }
  }
  const db = { appContent:store, $transaction: async fn=>fn({appContent:store}) };
  const server = load('../lib/google-calendar-server.ts', { 'google-auth-library': {...require('google-auth-library'),OAuth2Client:Client}, './prisma':{default:db}, './google-calendar-config':config, './google-calendar-crypto':encryption });
  return { server,rows,tokenCalls:()=>tokenCalls };
}
test('encrypted Google tokens are bound to the trainer and fail on tampering', () => {
  const key = crypto.randomBytes(32), value = encryption.sealGoogleValue({refreshToken:'secret-value'},key,'trainer-a');
  assert.equal(value.includes('secret-value'),false); assert.deepEqual(encryption.openGoogleValue(value,key,'trainer-a'),{refreshToken:'secret-value'});
  assert.throws(()=>encryption.openGoogleValue(value,key,'trainer-b')); assert.throws(()=>encryption.openGoogleValue(value,crypto.randomBytes(32),'trainer-a'));
  const parsed=JSON.parse(value); parsed.data=Buffer.from('tampered').toString('base64'); assert.throws(()=>encryption.openGoogleValue(JSON.stringify(parsed),key,'trainer-a'));
});
test('OAuth configuration fails closed and disallows external or missing request origins', () => {
  assert.equal(config.googleCalendarReady(),true);
  assert.throws(()=>config.requireGoogleCalendarOrigin(new Request('https://dev.example.test/api/test',{method:'POST',headers:{origin:'https://evil.test'}})),e=>e.status===403);
  assert.throws(()=>config.requireGoogleCalendarOrigin(new Request('https://dev.example.test/api/test',{method:'POST'})),e=>e.status===403);
  const enabled=process.env.GOOGLE_CALENDAR_ENABLED;process.env.GOOGLE_CALENDAR_ENABLED='false';assert.equal(config.googleCalendarReady(),false);process.env.GOOGLE_CALENDAR_ENABLED=enabled;
});
test('Google authorization uses offline access, least Calendar scope, PKCE and a trainer-bound state', async () => {
  const {server,rows}=fixture(), start=await server.beginGoogleCalendar('trainer-a','user-a'), url=new URL(start.url);
  assert.equal(url.origin,'https://accounts.google.com');assert.equal(url.searchParams.get('access_type'),'offline');assert.equal(url.searchParams.get('code_challenge_method'),'S256');assert.ok(url.searchParams.get('scope').includes(config.googleCalendarScope));
  assert.equal(rows.get(encryption.googleCalendarStateKey('trainer-a')).value.includes(start.state),false);
  await assert.rejects(()=>server.consumeGoogleCalendarState('trainer-b','user-a',start.state,start.state));
  await assert.rejects(()=>server.consumeGoogleCalendarState('trainer-a','user-b',start.state,start.state));
  await assert.rejects(()=>server.consumeGoogleCalendarState('trainer-a','user-a',start.state,'wrong-cookie'));
  const pending=await server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state);assert.ok(pending.verifier);
  await assert.rejects(()=>server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state));
});
test('expired state cannot authorize or overwrite a Google connection',async()=>{
  const {server,rows}=fixture(), start=await server.beginGoogleCalendar('trainer-a','user-a'), key=encryption.googleCalendarStateKey('trainer-a'), cfg=config.googleCalendarConfig();
  const pending=encryption.openGoogleValue(rows.get(key).value,cfg.encryptionKey,key);pending.expiresAt=Date.now()-1;rows.get(key).value=encryption.sealGoogleValue(pending,cfg.encryptionKey,key);
  await assert.rejects(()=>server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state));
});
test('saved connection exposes only safe status and checking never returns Google tokens',async()=>{
  const {server,rows}=fixture(), start=await server.beginGoogleCalendar('trainer-a','user-a'), pending=await server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state);
  await server.completeGoogleCalendar('trainer-a','code',pending.verifier,pending.receipt);
  assert.equal(rows.get(encryption.googleCalendarKey('trainer-a')).value.includes('private-refresh'),false);
  const status=await server.googleCalendarStatus('trainer-a');assert.equal(status.email,'rob@example.test');assert.equal(JSON.stringify(status).includes('private-'),false);
  assert.deepEqual(await server.googleCalendarStatus('trainer-b'),{connected:false});
  assert.ok((await server.checkGoogleCalendar('trainer-a')).checkedAt);
  await server.disconnectGoogleCalendar('trainer-b');assert.equal((await server.googleCalendarStatus('trainer-a')).connected,true);
  await server.disconnectGoogleCalendar('trainer-a');assert.deepEqual(await server.googleCalendarStatus('trainer-a'),{connected:false});
});
test('disconnect during OAuth exchange prevents a late callback from recreating access',async()=>{
  const {server}=fixture(), start=await server.beginGoogleCalendar('trainer-a','user-a'), pending=await server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state);
  await server.disconnectGoogleCalendar('trainer-a');await assert.rejects(()=>server.completeGoogleCalendar('trainer-a','code',pending.verifier,pending.receipt),e=>e.status===409);assert.deepEqual(await server.googleCalendarStatus('trainer-a'),{connected:false});
});
test('Google API actions deny signed-out and customer callers before consulting configuration',async()=>{
  let user=null;
  const api=load('../lib/google-calendar-api.ts',{'./auth':{getCurrentUser:async()=>user},'./google-calendar-config':config,'next/server':require('next/server')});
  const req=new Request('https://dev.example.test/api/test',{method:'POST',headers:{origin:'https://dev.example.test'}});
  await assert.rejects(()=>api.googleCalendarTrainer(req),e=>e.status===401);user={modes:['CUSTOMER']};await assert.rejects(()=>api.googleCalendarTrainer(req),e=>e.status===403);
  user={modes:['ADMIN'],trainer:{id:'trainer-a'},user:{id:'user-a'}};assert.deepEqual(await api.googleCalendarTrainer(req),{trainerId:'trainer-a',userId:'user-a'});
});

test('Google must grant offline Calendar access and a verified identity before saving',async()=>{
  for (const options of [{tokens:{refresh_token:undefined}},{tokens:{scope:'openid email'}},{identity:{email_verified:false}}]) {
    const {server,rows}=fixture(options), start=await server.beginGoogleCalendar('trainer-a','user-a'), pending=await server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state);
    await assert.rejects(()=>server.completeGoogleCalendar('trainer-a','code',pending.verifier,pending.receipt));assert.equal(rows.has(encryption.googleCalendarKey('trainer-a')),false);
  }
});
test('Calendar checks reject insufficient primary-calendar access',async()=>{
  const {server}=fixture({role:'reader'}), start=await server.beginGoogleCalendar('trainer-a','user-a'), pending=await server.consumeGoogleCalendarState('trainer-a','user-a',start.state,start.state);
  await server.completeGoogleCalendar('trainer-a','code',pending.verifier,pending.receipt);await assert.rejects(()=>server.checkGoogleCalendar('trainer-a'),e=>e.message.includes('own'));
});
