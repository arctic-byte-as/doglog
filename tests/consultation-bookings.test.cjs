const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),crypto=require('node:crypto');
function load(file,imports={}){const code=ts.transpileModule(fs.readFileSync(require.resolve(file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const exports={};new Function('require','exports',code)(id=>id in imports?imports[id]:require(id),exports);return exports;}
const pure=load('../lib/consultation-bookings.ts'),config=load('../lib/google-calendar-config.ts');
const times=()=>({day:'2030-11-11',startTime:'18:00',endTime:'19:00',topic:'Calm greetings'});
const booking=()=>({...pure.parseBookingTimes(times()),id:crypto.randomUUID(),trainerId:'trainer-a',customerId:'owner-a',dogId:'dog-a',dogName:'Luna',ownerName:'Owner',attendeeEmail:'owner@example.org',googleSubject:'google-a',googleEmail:'trainer@example.org',googleEventId:'np12345',status:'pending',meetUrl:null,meetState:'pending',invitationSent:false,notifyOwner:false,operation:'create',operationId:crypto.randomUUID()});
test('Oslo booking times respect summer/winter offsets and reject ambiguous, missing and invalid wall-clock times',()=>{
  assert.equal(pure.osloInstant('2030-01-10','18:00'),'2030-01-10T17:00:00.000Z');assert.equal(pure.osloInstant('2030-07-10','18:00'),'2030-07-10T16:00:00.000Z');
  assert.equal(pure.osloInstant('2027-03-28','02:30'),null);assert.equal(pure.osloInstant('2027-10-31','02:30'),null);assert.equal(pure.osloInstant('2030-02-30','18:00'),null);
  for(const patch of [{endTime:'18:00'},{endTime:'18:05'},{endTime:'23:30'},{topic:''},{day:'2000-01-01'}])assert.equal(pure.parseBookingTimes({...times(),...patch}),null);
});
test('only real invitation addresses and safe Google Meet URLs are accepted',()=>{
  assert.equal(pure.validInviteEmail('customer@example.test'),false);assert.equal(pure.validInviteEmail('owner@example.org'),true);
  for(const url of ['javascript:alert(1)','https://meet.google.com.evil.test/abc-defg-hij','https://meet.google.com/abc-defg-hij?token=x'])assert.equal(pure.safeMeetUrl(url),null);
  assert.equal(pure.safeMeetUrl('https://meet.google.com/abc-defg-hij'),'https://meet.google.com/abc-defg-hij');
  const b=booking();b.lease='private-lease';const visible=pure.publicBooking(b);assert.equal('lease' in visible,false);assert.equal('googleSubject' in visible,false);
});
function adapter(event=null,options={}){
  const calls=[];let current=event;
  const client={request:async request=>{calls.push(request);if(request.method==='GET'){if(!current)throw{response:{status:404}};return{data:current};}if(request.method==='DELETE'){current=null;return{data:{}};}current={...current,...request.data,hangoutLink:'https://meet.google.com/abc-defg-hij'};return{data:current};}};
  const module=load('../lib/google-consultation-events.ts',{'./google-calendar-config':config,'./consultation-bookings':pure,'./google-calendar-server':{withGoogleCalendar:async(_,fn)=>fn(client,{subject:options.subject||'google-a',email:'trainer@example.org'})}});
  return{sync:module.syncConsultationEvent,calls,get:()=>current};
}
test('creating Meet without invitations sends no attendees and reuses the same Google event on retry',async()=>{
  const b=booking(),api=adapter();const first=await api.sync(b);assert.equal(first.meetState,'ready');const created=api.calls.find(item=>item.method==='POST');assert.equal(created.data.id,b.googleEventId);assert.deepEqual(created.data.attendees,[]);assert.equal(created.params.sendUpdates,'none');assert.equal(created.params.conferenceDataVersion,1);assert.equal(created.data.conferenceData.createRequest.requestId,b.id);
  await api.sync(b);assert.equal(api.calls.filter(item=>item.method==='POST').length,1);
});
test('invitations require their explicit operation and retries do not send them twice',async()=>{
  const b=booking(),api=adapter();await api.sync(b);const invite={...b,operation:'invite',operationId:crypto.randomUUID(),inviteEmail:'test-owner@example.org'};
  await api.sync(invite);await api.sync(invite);const patches=api.calls.filter(item=>item.method==='PATCH');assert.equal(patches.length,1);assert.equal(patches[0].params.sendUpdates,'all');assert.deepEqual(patches[0].data.attendees,[{email:'test-owner@example.org'}]);
});
test('rescheduling preserves the Meet link and cancellation is idempotent',async()=>{
  const b=booking(),api=adapter();await api.sync(b);const changes=pure.parseBookingTimes({...times(),startTime:'19:00',endTime:'20:00'});
  const result=await api.sync({...b,operation:'update',operationId:crypto.randomUUID(),changes,invitationSent:true});assert.equal(result.meetUrl,'https://meet.google.com/abc-defg-hij');const patch=api.calls.find(item=>item.method==='PATCH');assert.equal(patch.data.conferenceData,undefined);assert.equal(patch.params.sendUpdates,'all');
  await api.sync({...b,operation:'cancel',invitationSent:true});await api.sync({...b,operation:'cancel',invitationSent:true});assert.equal(api.calls.filter(item=>item.method==='DELETE').length,1);
});
test('Google account and event ownership are verified before mutations',async()=>{
  const b=booking(),foreign=adapter({extendedProperties:{private:{norsepawBookingId:'foreign',norsepawTrainerId:'trainer-b'}}});await assert.rejects(()=>foreign.sync(b),e=>e.status===409);assert.equal(foreign.calls.length,1);
  const different=adapter(null,{subject:'google-b'});await assert.rejects(()=>different.sync(b),e=>e.status===409);assert.equal(different.calls.length,0);
});
function storage(){
  const rows=new Map();let clock=0,syncCalls=0,fail=false;const db={appContent:{
    findUnique:async({where})=>rows.get(where.key)||null,
    findMany:async({where})=>[...rows.values()].filter(row=>row.key.startsWith(where.key.startsWith)),
    create:async({data})=>{rows.set(data.key,{...data,updatedAt:new Date(Date.UTC(2030,0,1,0,0,clock++))});},
    update:async({where,data})=>{const row={key:where.key,...data,updatedAt:new Date(Date.UTC(2030,0,1,0,0,clock++))};rows.set(where.key,row);return row;},
  },dog:{findFirst:async({where})=>where.id==='dog-a'&&where.trainerId==='trainer-a'?{id:'dog-a',name:'Luna',customer:{id:'owner-a',name:'Owner',email:'owner@example.org'}}:null,findMany:async({where})=>where.customerId==='owner-a'?[{id:'dog-a'}]:[]},customer:{findUnique:async()=>({id:'owner-a'})},customerServiceAccess:{upsert:async()=>{}},$queryRaw:async()=>[{one:1}]};db.$transaction=async fn=>fn(db);
  const server=load('../lib/consultation-bookings-server.ts',{'./prisma':{default:db},'./google-calendar-config':{...config,googleCalendarReady:()=>true},'./google-calendar-server':{withGoogleCalendar:async(_,fn)=>fn({}, {subject:'google-a',email:'trainer@example.org'})},'./google-consultation-events':{syncConsultationEvent:async()=>{syncCalls++;if(fail)throw new config.GoogleCalendarError('Temporary Google failure',502);return{meetUrl:'https://meet.google.com/abc-defg-hij',meetState:'ready',invitationSent:false};}},'./consultation-bookings':pure});
  return{server,rows,fail:value=>{fail=value;},calls:()=>syncCalls};
}
test('saved bookings survive reload, reject foreign dogs and stale edits, and protect owner visibility',async()=>{
  const {server,calls}=storage(),body={...times(),id:crypto.randomUUID(),dogId:'dog-a',sendInvitation:false};await assert.rejects(()=>server.createConsultationBooking('trainer-b',body),e=>e.status===403);
  const created=await server.createConsultationBooking('trainer-a',body);assert.equal(created.status,'confirmed');assert.equal((await server.trainerConsultationBookings('trainer-a')).length,1);assert.equal((await server.customerConsultationBookings('owner-a')).length,1);assert.equal((await server.customerConsultationBookings('owner-b')).length,0);
  await server.createConsultationBooking('trainer-a',body);assert.equal(calls(),1);
  await assert.rejects(()=>server.changeConsultationBooking('trainer-a',body.id,{action:'cancel',updatedAt:'stale'}),e=>e.status===409);
  await assert.rejects(()=>server.changeConsultationBooking('trainer-b',body.id,{action:'cancel',updatedAt:created.updatedAt}),e=>e.status===404);
});
test('overlapping slots are rejected and failed Google writes remain retryable as the same booking',async()=>{
  const fixture=storage(),body={...times(),id:crypto.randomUUID(),dogId:'dog-a',sendInvitation:false};fixture.fail(true);await assert.rejects(()=>fixture.server.createConsultationBooking('trainer-a',body),e=>e.status===502);
  const pending=(await fixture.server.trainerConsultationBookings('trainer-a'))[0];assert.equal(pending.operation,'create');assert.ok(pending.error);assert.equal((await fixture.server.customerConsultationBookings('owner-a')).length,0);
  await assert.rejects(()=>fixture.server.createConsultationBooking('trainer-a',{...body,id:crypto.randomUUID()}),e=>e.status===409);
  fixture.fail(false);const recovered=await fixture.server.changeConsultationBooking('trainer-a',body.id,{action:'retry',updatedAt:pending.updatedAt});assert.equal(recovered.id,body.id);assert.equal(recovered.status,'confirmed');
});
