import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await requireCustomer();
  const { id } = await props.params;
  const dog = await prisma.dog.findFirst({ where: { id, customerId: user.customer.id }, select: { id: true } });
  if (!dog) return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  const body = await request.json().catch(() => null);
  const value = body?.url;
  if (typeof value !== 'string' || value.length > 2048) return NextResponse.json({ error: 'Invalid photo.' }, { status: 400 });
  let allowed = value === '' || /^\/dog-avatars\/avatar-0[1-6]\.svg$/.test(value);
  if (!allowed) {
    try {
      const url = new URL(value);
      const origin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').origin;
      const bucket = process.env.SUPABASE_STORAGE_DOG_IMAGES_BUCKET || 'dog-profile-images';
      allowed = url.origin === origin && url.pathname.startsWith(`/storage/v1/object/public/${bucket}/${user.customer.id}/`) && !url.username && !url.password && !url.search && !url.hash;
    } catch { allowed = false; }
  }
  if (!allowed) return NextResponse.json({ error: 'Choose an uploaded photo or avatar.' }, { status: 400 });
  await prisma.dog.update({ where: { id: dog.id }, data: { profileImageUrl: value || null } });
  return NextResponse.json({ ok: true });
}
