import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import prisma from './prisma';
import { GoogleCalendarError, googleCalendarReady } from './google-calendar-config';
import { withGoogleCalendar } from './google-calendar-server';
import { syncConsultationEvent } from './google-consultation-events';
import { bookingKey, bookingPrefix, bookingOverlap, parseBookingTimes, publicBooking, validBookingId, validInviteEmail, safeMeetUrl, type BookingOperation, type ConsultationBooking, type BookingTimes } from './consultation-bookings';
type DB = Pick<typeof prisma, 'appContent'>;
async function records(trainerId: string, db: DB = prisma): Promise<ConsultationBooking[]> {
  const rows=await db.appContent.findMany({where:{key:{startsWith:bookingPrefix(trainerId)}},orderBy:{updatedAt:'desc'}});
  return rows.map(row=>({...JSON.parse(row.value),updatedAt:row.updatedAt.toISOString()}));
}
function encoded(booking: ConsultationBooking) { const {updatedAt,...value}=booking;return JSON.stringify(value); }
async function locked<T>(trainerId:string, action:(tx:Prisma.TransactionClient)=>Promise<T>) {
  return prisma.$transaction(async tx=>{await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${trainerId}))`;return action(tx);});
}
function assertFree(booking: ConsultationBooking) { if(booking.lease && (booking.leaseUntil || 0)>Date.now())throw new GoogleCalendarError('This booking is being updated. Wait a moment and reload.',409); }
async function assertNoOverlap(trainerId:string,id:string,times:BookingTimes,db:DB) {
  const bookings=await records(trainerId,db);
  if(bookings.some(item=>item.id!==id && item.status!=='cancelled' && (bookingOverlap(times,item) || item.changes && bookingOverlap(times,item.changes))))throw new GoogleCalendarError('You already have a NorsePaw consultation at this time. Choose another time.',409);
}
export async function trainerConsultationBookings(trainerId:string) { return (await records(trainerId)).map(publicBooking).sort((a,b)=>a.startsAt.localeCompare(b.startsAt)); }
export async function customerConsultationBookings(customerId:string) {
  if(!googleCalendarReady())return [];
  const dogs=await prisma.dog.findMany({where:{customerId},select:{id:true}}), dogIds=new Set(dogs.map(dog=>dog.id));
  if(!dogIds.size)return [];
  const rows=await prisma.appContent.findMany({where:{key:{startsWith:'consultation-booking:'}}});
  return rows.map(row=>JSON.parse(row.value) as ConsultationBooking).filter(item=>item.customerId===customerId && dogIds.has(item.dogId) && item.status!=='pending').map(item=>({id:item.id,dogName:item.dogName,topic:item.topic,day:item.day,startTime:item.startTime,endTime:item.endTime,startsAt:item.startsAt,status:item.status,meetUrl:item.operation==='cancel'?null:safeMeetUrl(item.meetUrl),meetState:item.meetState,cancellationPending:item.operation==='cancel'})).sort((a,b)=>a.startsAt.localeCompare(b.startsAt));
}
async function finish(booking: ConsultationBooking) {
  try {
    const result=await syncConsultationEvent(booking);
    const next:ConsultationBooking={...booking,...result,...booking.changes,status:booking.operation==='cancel'?'cancelled':'confirmed',attendeeEmail:booking.inviteEmail || booking.attendeeEmail,operation:null,changes:undefined,inviteEmail:undefined,lease:undefined,leaseUntil:undefined,error:undefined};
    await locked(booking.trainerId,async tx=>{
      const key=bookingKey(booking.trainerId,booking.id), row=await tx.appContent.findUnique({where:{key}});
      if(!row || (JSON.parse(row.value) as ConsultationBooking).lease!==booking.lease)throw new GoogleCalendarError('This booking changed. Reload and use Retry if needed.',409);
      await tx.appContent.update({where:{key},data:{value:encoded(next)}});
      if(next.status==='confirmed' && await tx.customer.findUnique({where:{id:next.customerId},select:{id:true}}))await tx.customerServiceAccess.upsert({where:{customerId_serviceKey:{customerId:next.customerId,serviceKey:'CONSULTATIONS'}},create:{customerId:next.customerId,serviceKey:'CONSULTATIONS'},update:{}});
    });
    return (await trainerConsultationBookings(booking.trainerId)).find(item=>item.id===booking.id)!;
  } catch(error) {
    const safe=error instanceof GoogleCalendarError?error:new GoogleCalendarError('The booking could not be confirmed. Use Retry to recover the same appointment.',502);
    await locked(booking.trainerId,async tx=>{
      const key=bookingKey(booking.trainerId,booking.id),row=await tx.appContent.findUnique({where:{key}});
      if(row){const current=JSON.parse(row.value) as ConsultationBooking;if(current.lease===booking.lease)await tx.appContent.update({where:{key},data:{value:encoded({...current,lease:undefined,leaseUntil:undefined,error:safe.message})}});}
    }).catch(()=>{});
    throw safe;
  }
}
export async function createConsultationBooking(trainerId:string,body:unknown) {
  const input=body as Record<string,unknown>,times=parseBookingTimes(body);
  if(!input || !validBookingId(input.id) || typeof input.dogId!=='string' || !times || typeof input.sendInvitation!=='boolean')throw new GoogleCalendarError('Choose an owner and dog, a topic, and a future 15–240 minute appointment. Times use Europe/Oslo; avoid daylight-saving clock changes.');
  const id=input.id, dogId=input.dogId, notifyOwner=input.sendInvitation;
  const dog=await prisma.dog.findFirst({where:{id:dogId,trainerId,customerId:{not:null}},select:{id:true,name:true,customer:{select:{id:true,name:true,email:true}}}});
  if(!dog?.customer)throw new GoogleCalendarError('This dog is not assigned to you or has no linked owner account.',403);
  if(notifyOwner && input.recipientEmail!==dog.customer.email)throw new GoogleCalendarError('The owner email changed. Reload before sending an invitation.',409);
  if(notifyOwner && !validInviteEmail(dog.customer.email))throw new GoogleCalendarError('Use an owner account with a real email address before sending an invitation. You can create the Meet appointment without an invitation.');
  const account=await withGoogleCalendar(trainerId,async(_client,identity)=>identity);
  const booking=await locked(trainerId,async tx=>{
    const key=bookingKey(trainerId,id),row=await tx.appContent.findUnique({where:{key}});
    if(row){const old=JSON.parse(row.value) as ConsultationBooking;
      if(old.dogId!==dogId || old.startsAt!==times.startsAt || old.endsAt!==times.endsAt || old.topic!==times.topic || old.notifyOwner!==notifyOwner)throw new GoogleCalendarError('This booking ID is already in use. Retry the saved appointment or cancel it before creating another.',409);
      if(old.status==='confirmed' && !old.operation)return {...old,updatedAt:row.updatedAt.toISOString()};
      if(old.status==='cancelled' || old.operation!=='create')throw new GoogleCalendarError('Use the saved booking actions to manage this appointment.',409);
      assertFree(old);const next={...old,lease:randomUUID(),leaseUntil:Date.now()+120000,error:undefined};await tx.appContent.update({where:{key},data:{value:encoded(next)}});return next;
    }
    if((await records(trainerId,tx)).length>=200)throw new GoogleCalendarError('The Dev booking limit has been reached.');
    await assertNoOverlap(trainerId,id,times,tx);
    const next:ConsultationBooking={...times,id,trainerId,dogId:dog.id,dogName:dog.name,customerId:dog.customer!.id,ownerName:dog.customer!.name,attendeeEmail:dog.customer!.email,status:'pending',googleEventId:`np${id.replace(/-/g,'').toLowerCase()}`,googleSubject:account.subject,googleEmail:account.email,meetUrl:null,meetState:'pending',invitationSent:false,notifyOwner,operation:'create',operationId:randomUUID(),lease:randomUUID(),leaseUntil:Date.now()+120000};
    await tx.appContent.create({data:{key,value:encoded(next)}});return next;
  });
  return booking.operation?finish(booking):publicBooking(booking);
}
export async function changeConsultationBooking(trainerId:string,id:string,body:unknown) {
  const input=body as Record<string,unknown>;
  if(!validBookingId(id) || !input || typeof input.updatedAt!=='string' || !['update','cancel','invite','refresh','retry'].includes(String(input.action)))throw new GoogleCalendarError('Reload the appointment before changing it.');
  const booking=await locked(trainerId,async tx=>{
    const key=bookingKey(trainerId,id),row=await tx.appContent.findUnique({where:{key}});
    if(!row)throw new GoogleCalendarError('Appointment not found.',404);
    const current=JSON.parse(row.value) as ConsultationBooking;
    if(row.updatedAt.toISOString()!==input.updatedAt)throw new GoogleCalendarError('This appointment changed. Reload before editing.',409);
    assertFree(current);
    if(current.status==='cancelled')throw new GoogleCalendarError('This appointment has already been cancelled.',409);
    let operation:BookingOperation,changes=current.changes,inviteEmail=current.inviteEmail;
    if(input.action==='retry'){
      if(!current.operation)throw new GoogleCalendarError('This appointment has no change to retry.',409);
      operation=current.operation;
    }else if(input.action==='cancel'){operation='cancel';changes=undefined;inviteEmail=undefined;}
    else {
      if(current.operation)throw new GoogleCalendarError('Retry or cancel the pending change before making another.',409);
      operation=input.action as BookingOperation;
      if(operation==='update'){
        const times=parseBookingTimes(input);
        if(!times)throw new GoogleCalendarError('Choose a valid future 15–240 minute appointment in Europe/Oslo.');
        await assertNoOverlap(trainerId,id,times,tx);changes=times;
      }
      if(operation==='invite'){
        if(current.invitationSent)throw new GoogleCalendarError('An invitation was already sent. Rescheduling sends its update automatically.',409);
        const dog=await tx.dog.findFirst({where:{id:current.dogId,trainerId,customerId:current.customerId},select:{customer:{select:{email:true}}}});
        if(!dog?.customer || !validInviteEmail(dog.customer.email))throw new GoogleCalendarError('Update this owner account with your real test email before sending an invitation.');
        if(input.recipientEmail!==dog.customer.email)throw new GoogleCalendarError('The owner email changed. Reload before sending an invitation.',409);
        inviteEmail=dog.customer.email;
      }
    }
    const next={...current,operation,operationId:input.action==='retry'?current.operationId:randomUUID(),changes,inviteEmail,lease:randomUUID(),leaseUntil:Date.now()+120000,error:undefined};
    await tx.appContent.update({where:{key},data:{value:encoded(next)}});return next;
  });
  return finish(booking);
}
