import { NextResponse } from 'next/server';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CourseWriteError, writeCourseRun } from '@/lib/course-run-write';
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  const user = await requireTrainer(); const { id } = await context.params;
  const text = await request.text(); if (text.length > 100000) return NextResponse.json({ error: 'Course group is too large.' }, { status: 413 });
  let body; try { body = JSON.parse(text); } catch { return NextResponse.json({ error: 'Invalid course data.' }, { status: 400 }); }
  try { return NextResponse.json({ run: await writeCourseRun(user.trainer.id, body, id) }); }
  catch (error) { if (error instanceof CourseWriteError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
}
export async function DELETE(_request: Request, context: Context) {
  const user = await requireTrainer(); const { id } = await context.params;
  const result = await prisma.courseRun.deleteMany({ where: { id, trainerId: user.trainer.id } });
  return result.count ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'Course group not found.' }, { status: 404 });
}
