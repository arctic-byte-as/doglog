import { parseRecommendedVideos } from '@/lib/recommended-videos';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parseCustomerServices, updateCustomerServices } from '@/lib/customer-services';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  if (!user.modes.includes('ADMIN') || !user.trainer) return NextResponse.json({ error: 'Trainer access is required.' }, { status: 403 });
  const customer = await prisma.customer.findFirst({ where: { id: params.id, dogs: { some: { trainerId: user.trainer.id } } }, select: { id: true } });
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  const body = await request.json().catch(() => null);
  const services = parseCustomerServices(body?.services);
  if (!services) return NextResponse.json({ error: 'Select valid services and courses.' }, { status: 400 });
  const videos = body?.recommendedVideos === undefined ? undefined : parseRecommendedVideos(body.recommendedVideos);
  if (videos === null) return NextResponse.json({ error: 'Add a subject, title and valid YouTube link for each video (maximum 30).' }, { status: 400 });
  await updateCustomerServices(customer.id, services, videos);
  return NextResponse.json({ services });
}
