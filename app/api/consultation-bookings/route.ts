import { NextResponse } from 'next/server';
import { googleCalendarTrainer, googleCalendarApiError } from '@/lib/google-calendar-api';
import { GoogleCalendarError } from '@/lib/google-calendar-config';
import { createConsultationBooking } from '@/lib/consultation-bookings-server';
export async function POST(request:Request){
  try{const {trainerId}=await googleCalendarTrainer(request);const text=await request.text();if(text.length>5000)throw new GoogleCalendarError('The booking is too large.',413);let body;try{body=JSON.parse(text);}catch{throw new GoogleCalendarError('Invalid appointment.');}return NextResponse.json({booking:await createConsultationBooking(trainerId,body)},{headers:{'Cache-Control':'no-store'}});}
  catch(error){return googleCalendarApiError(error);}
}
