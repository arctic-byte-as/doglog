const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
function route(options={}) {
  let completed=0,cleaned=0;
  class Response { constructor(body,init){this.body=body;this.status=init?.status;this.headers=new Headers();this.cookies={set(){}};} static redirect(url,status){const r=new Response(null,{status});r.url=url.toString();return r;} }
  const imports={ 'next/server':{NextResponse:Response}, '@/lib/auth':{getCurrentUser:async()=>options.signedOut?null:{modes:['ADMIN'],trainer:{id:'trainer-a'},user:{id:'user-a'}}}, '@/lib/prisma':{default:{appContent:{deleteMany:async()=>{cleaned++;}}}}, '@/lib/google-calendar-config':{googleCalendarCookie:'state-cookie',googleCalendarConfig:()=>({origin:'https://dev.example.test'})}, '@/lib/google-calendar-crypto':{googleCalendarStateKey:id=>`state:${id}`}, '@/lib/google-calendar-server':{consumeGoogleCalendarState:async()=>{if(options.invalid)throw Error('private-upstream-error');return{verifier:'private-verifier',receipt:'encrypted-receipt'};},completeGoogleCalendar:async()=>{completed++;}} };
  const code=ts.transpileModule(fs.readFileSync(require.resolve('../app/api/integrations/google/callback/route.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const exports={};new Function('require','exports',code)(id=>imports[id],exports);
  return{get:exports.GET,completed:()=>completed,cleaned:()=>cleaned};
}
const request=query=>({nextUrl:new URL(`https://dev.example.test/api/integrations/google/callback?${query}`),cookies:{get:()=>({value:'cookie'})}});
test('callback rejects invalid state without exchanging a code or leaking provider details',async()=>{
  const api=route({invalid:true}), response=await api.get(request('state=bad&code=private-code&next=https://evil.test'));
  assert.equal(api.completed(),0);assert.equal(response.status,303);assert.equal(response.url,'https://dev.example.test/services/consultations/google?result=failed');assert.equal(response.headers.get('Referrer-Policy'),'no-referrer');
});
test('Google cancellation and signed-out callbacks never create a connection',async()=>{
  const cancelled=route(), response=await cancelled.get(request('state=state&error=access_denied&error_description=private-detail'));
  assert.equal(cancelled.completed(),0);assert.equal(cancelled.cleaned(),1);assert.ok(response.url.endsWith('result=cancelled'));
  const signedOut=route({signedOut:true});assert.ok((await signedOut.get(request('code=private-code'))).url.endsWith('result=sign-in'));assert.equal(signedOut.completed(),0);
});
