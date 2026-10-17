import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parseRecommendedVideos, recommendedVideosKey } from '@/lib/recommended-videos';
import { getRecommendedVideos } from '@/lib/recommended-videos-server';

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  if (!user.modes.includes('ADMIN') || !user.trainer) return NextResponse.json({ error: 'Trainer access is required.' }, { status: 403 });
  const { id } = await props.params;
  const customer = await prisma.customer.findFirst({ where: { id, dogs: { some: { trainerId: user.trainer.id } } }, select: { id: true } });
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  return NextResponse.json({ videos: await getRecommendedVideos(customer.id) });
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  if (!user.modes.includes('ADMIN') || !user.trainer) return NextResponse.json({ error: 'Trainer access is required.' }, { status: 403 });
  const { id } = await props.params;
  const customer = await prisma.customer.findFirst({ where: { id, dogs: { some: { trainerId: user.trainer.id } } }, select: { id: true } });
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  const body = await request.json().catch(() => null);
  const videos = parseRecommendedVideos(body?.videos);
  if (!videos) return NextResponse.json({ error: 'Use valid YouTube videos with subjects and titles (maximum 30).' }, { status: 400 });
  await prisma.$transaction(async (tx) => {
    await tx.appContent.upsert({ where: { key: recommendedVideosKey(customer.id) }, create: { key: recommendedVideosKey(customer.id), value: JSON.stringify(videos) }, update: { value: JSON.stringify(videos) } });
    await tx.customerServiceAccess.upsert({ where: { customerId_serviceKey: { customerId: customer.id, serviceKey: 'RECOMMENDED_VIDEOS' } }, create: { customerId: customer.id, serviceKey: 'RECOMMENDED_VIDEOS' }, update: {} });
  });
  return NextResponse.json({ videos, ok: true });
}
