import { NextResponse } from 'next/server';
import { requireTrainer } from '@/lib/auth';
import { getTrainerCourseRuns } from '@/lib/course-runs-server';
import { CourseWriteError, writeCourseRun } from '@/lib/course-run-write';
export async function GET() { const user = await requireTrainer(); return NextResponse.json({ runs: await getTrainerCourseRuns(user.trainer.id) }); }
export async function POST(request: Request) {
  const user = await requireTrainer();
  const text = await request.text();
  if (text.length > 100000) return NextResponse.json({ error: 'Course group is too large.' }, { status: 413 });
  let body; try { body = JSON.parse(text); } catch { return NextResponse.json({ error: 'Invalid course data.' }, { status: 400 }); }
  try { return NextResponse.json({ run: await writeCourseRun(user.trainer.id, body) }, { status: 201 }); }
  catch (error) { if (error instanceof CourseWriteError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
}
