import { randomUUID } from 'crypto';
import { uploadDogPhoto } from '@/lib/dog-photo-upload';
import { NextResponse } from 'next/server';
import { ensureDogBreed } from '@/lib/dog-breeds-server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { createAppSession } from '@/lib/session';

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  let photo: File | null = null;
  try {
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await request.formData();
      body = JSON.parse(String(form.get('details') || '{}'));
      const file = form.get('file');
      if (file !== null && !(file instanceof File)) return NextResponse.json({ error: 'Invalid photo.' }, { status: 400 });
      photo = file as File | null;
    } else {
      body = await request.json();
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid details');
  } catch {
    return NextResponse.json({ error: 'Invalid registration details.' }, { status: 400 });
  }
  const ownerName = clean(body.ownerName);
  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const dogName = clean(body.dogName);
  const behaviourConcern = clean(body.behaviourConcern);

  if (!ownerName) return NextResponse.json({ error: 'Owner name is required.' }, { status: 400 });
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  if (password.length < 10) return NextResponse.json({ error: 'Password must be at least 10 characters.' }, { status: 400 });
  if (!dogName) return NextResponse.json({ error: 'Dog name is required.' }, { status: 400 });
  if (!behaviourConcern) return NextResponse.json({ error: 'Main behaviour concern is required.' }, { status: 400 });

  const existingCustomer = await prisma.customer.findUnique({ where: { email } });
  if (existingCustomer) {
    return NextResponse.json({ error: 'An owner profile already exists for this email. Please sign in instead.' }, { status: 409 });
  }

  const trainer = await prisma.trainer.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!trainer) {
    return NextResponse.json({ error: 'No trainer is available yet. Please create a trainer account first.' }, { status: 400 });
  }

  const dogBreed = await ensureDogBreed(body.dogBreed);

  const customerId = randomUUID();
  let dogPhotoUrl = clean(body.dogPhotoUrl);
  if (photo) {
    const form = new FormData();
    form.append('file', photo);
    const uploaded = await uploadDogPhoto(new Request(request.url, { method: 'POST', body: form }), customerId);
    if (!uploaded.ok) return uploaded;
    dogPhotoUrl = (await uploaded.json()).url;
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      select: { id: true },
      update: {
        name: ownerName,
        passwordHash: hashPassword(password),
        role: 'CUSTOMER',
      },
      create: {
        email,
        name: ownerName,
        passwordHash: hashPassword(password),
        role: 'CUSTOMER',
      },
    });

    const customer = await tx.customer.create({
      data: {
        id: customerId,
        email,
        name: ownerName,
        phone: clean(body.phone) || null,
        notes: clean(body.ownerNotes) || null,
      },
    });

    const dog = await tx.dog.create({
      data: {
        name: dogName,
        age: clean(body.dogAge),
        breed: dogBreed,
        status: 'New owner registration',
        owner: ownerName,
        lastIncident: behaviourConcern,
        profileImageUrl: dogPhotoUrl || null,
        trainerId: trainer.id,
        customerId: customer.id,
      },
    });

    return { userId: user.id, customer, dog };
  });

  await createAppSession(result.userId);

  return NextResponse.json({ customer: result.customer, dog: result.dog }, { status: 201 });
}
