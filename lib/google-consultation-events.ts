import { GoogleCalendarError } from './google-calendar-config';
import { withGoogleCalendar } from './google-calendar-server';
import { safeMeetUrl, type ConsultationBooking } from './consultation-bookings';
type Event = { id?: string; status?: string; etag?: string; hangoutLink?: string; conferenceData?: { createRequest?: { status?: { statusCode?: string } }; entryPoints?: { entryPointType?: string; uri?: string }[] }; extendedProperties?: { private?: Record<string,string> } };
const root='https://www.googleapis.com/calendar/v3/calendars/primary/events';
const httpStatus=(error:unknown)=>{ const value=error as {response?:{status?:number};status?:number};return value?.response?.status || value?.status; };
export async function syncConsultationEvent(booking: ConsultationBooking) {
  return withGoogleCalendar(booking.trainerId, async (client, account) => {
    if (account.subject !== booking.googleSubject) throw new GoogleCalendarError('Reconnect the original Google account for this booking.',409);
    const eventUrl=`${root}/${booking.googleEventId}`;
    async function call(method:'GET'|'POST'|'PATCH'|'DELETE',url:string,data?:unknown,params?:Record<string,unknown>,etag?:string) {
      return (await client.request<Event>({method,url,data,params,timeout:15000,retry:false,headers:etag?{'If-Match':etag}:undefined})).data;
    }
    let event: Event | null = null;
    try { event=await call('GET',eventUrl); } catch(error) { if (![404,410].includes(httpStatus(error)||0)) throw new GoogleCalendarError('Google Calendar could not be reached. Reconnect if necessary, then retry.',502); }
    if (event && !(booking.operation==='cancel' && event.status==='cancelled') && (event.extendedProperties?.private?.norsepawBookingId!==booking.id || event.extendedProperties?.private?.norsepawTrainerId!==booking.trainerId)) throw new GoogleCalendarError('Google event ownership could not be verified. No changes were made.',409);
    try {
      if (booking.operation==='cancel') {
        if(event && event.status!=='cancelled') await call('DELETE',eventUrl,undefined,{sendUpdates:booking.invitationSent || booking.notifyOwner?'all':'none'},event.etag);
        return {meetUrl:null,meetState:'pending' as const,invitationSent:booking.invitationSent};
      }
      if (event?.status==='cancelled') throw new GoogleCalendarError('This event was cancelled in Google. Cancel this booking and create a new one.',409);
      const times=booking.changes || booking;
      const privateProperties={norsepawBookingId:booking.id,norsepawTrainerId:booking.trainerId,norsepawLastOperation:booking.operationId};
      const alreadyApplied=event?.extendedProperties?.private?.norsepawLastOperation===booking.operationId;
      const eventContent={summary:`NorsePaw consultation · ${booking.dogName}`,description:`Online consultation with NorsePaw.\nTopic: ${times.topic}`,start:{dateTime:times.startsAt,timeZone:'Europe/Oslo'},end:{dateTime:times.endsAt,timeZone:'Europe/Oslo'}};
      if (!event) {
        if(booking.operation!=='create') throw new GoogleCalendarError('This event is missing from Google Calendar. Cancel the booking and create a new one.',409);
        try { event=await call('POST',root,{id:booking.googleEventId,...eventContent,attendees:booking.notifyOwner?[{email:booking.attendeeEmail}]:[],guestsCanModify:false,guestsCanInviteOthers:false,guestsCanSeeOtherGuests:false,reminders:{useDefault:false},extendedProperties:{private:{...privateProperties}},conferenceData:{createRequest:{requestId:booking.id,conferenceSolutionKey:{type:'hangoutsMeet'}}}},{conferenceDataVersion:1,sendUpdates:booking.notifyOwner?'all':'none'}); }
        catch(error) { if(httpStatus(error)===409)event=await call('GET',eventUrl);else throw error; }
        if(event.extendedProperties?.private?.norsepawBookingId!==booking.id || event.extendedProperties?.private?.norsepawTrainerId!==booking.trainerId) throw new GoogleCalendarError('Google event ownership could not be verified.',409);
      } else if(booking.operation==='update' && !alreadyApplied) {
        event=await call('PATCH',eventUrl,{...eventContent,extendedProperties:{private:privateProperties}},{conferenceDataVersion:1,sendUpdates:booking.invitationSent?'all':'none'},event.etag);
      } else if(booking.operation==='invite' && !alreadyApplied) {
        event=await call('PATCH',eventUrl,{attendees:[{email:booking.inviteEmail || booking.attendeeEmail}],extendedProperties:{private:privateProperties}},{sendUpdates:'all',conferenceDataVersion:1},event.etag);
      } else if(booking.operation==='refresh' && !alreadyApplied && event.conferenceData?.createRequest?.status?.statusCode==='failure') {
        event=await call('PATCH',eventUrl,{extendedProperties:{private:privateProperties},conferenceData:{createRequest:{requestId:booking.operationId,conferenceSolutionKey:{type:'hangoutsMeet'}}}},{conferenceDataVersion:1,sendUpdates:booking.invitationSent?'all':'none'},event.etag);
      }
      const meetUrl=safeMeetUrl(event.hangoutLink) || safeMeetUrl(event.conferenceData?.entryPoints?.find(item=>item.entryPointType==='video')?.uri);
      return {meetUrl,meetState:meetUrl?'ready' as const:event.conferenceData?.createRequest?.status?.statusCode==='failure'?'failed' as const:'pending' as const,invitationSent:booking.invitationSent || booking.operation==='invite' || booking.operation==='create' && booking.notifyOwner};
    } catch(error) {
      if(error instanceof GoogleCalendarError)throw error;
      throw new GoogleCalendarError('Google could not confirm this change. Use Retry to recover the same booking; do not create a duplicate.',502);
    }
  });
}
