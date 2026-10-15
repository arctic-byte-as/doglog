import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { categories, normalizeTrainingLibrary } from '@/lib/training-library';

export async function GET() {
  if (!(await getCurrentUser())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const stored = await prisma.appContent.findUnique({ where: { key: 'training-library' } });
  if (!stored) return NextResponse.json({ categories, stored: false });
  try {
    const library = normalizeTrainingLibrary(JSON.parse(stored.value));
    if (!library) throw new Error('Invalid stored training library');
    return NextResponse.json({ categories: library, stored: true });
  } catch {
    return NextResponse.json({ error: 'The saved training library could not be read.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!user.modes.includes('ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const text = await request.text();
  if (text.length > 1_000_000) return NextResponse.json({ error: 'Training library is too large.' }, { status: 413 });
  let body;
  try { body = JSON.parse(text); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const library = normalizeTrainingLibrary(body?.categories);
  if (!library) return NextResponse.json({ error: 'Check category and exercise names and details. Names must be unique within their category.' }, { status: 400 });
  await prisma.appContent.upsert({ where: { key: 'training-library' }, create: { key: 'training-library', value: JSON.stringify(library) }, update: { value: JSON.stringify(library) } });
  return NextResponse.json({ categories: library });
}
