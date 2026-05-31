import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getStoredSkillsLibrary, normalizeSkillsLibrary, saveStoredSkillsLibrary } from '@/lib/skills-library';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const skills = await getStoredSkillsLibrary();
  return NextResponse.json({ skills });
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.modes.includes('ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const skills = normalizeSkillsLibrary(body?.skills);
  if (!skills) {
    return NextResponse.json({ error: 'Invalid skills library content' }, { status: 400 });
  }

  await saveStoredSkillsLibrary(skills);
  return NextResponse.json({ ok: true, skills });
}
