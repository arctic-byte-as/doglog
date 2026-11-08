import { NextResponse } from 'next/server';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getCustomCourseTemplates, templateKey } from '@/lib/course-template-server';
import { parseCourseTemplate } from '@/lib/course-templates';
class TemplateError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function GET() { const user = await requireTrainer(); return NextResponse.json(await getCustomCourseTemplates(user.trainer.id)); }
export async function PUT(request: Request) {
  const user = await requireTrainer();
  const text = await request.text(); if (text.length > 200000) return NextResponse.json({ error: 'Course content is too large.' }, { status: 413 });
  let body; try { body = JSON.parse(text); } catch { return NextResponse.json({ error: 'Invalid course content.' }, { status: 400 }); }
  const template = parseCourseTemplate(body?.template);
  if (!template) return NextResponse.json({ error: 'Check the course name, service, duration, capacity and each session’s content.' }, { status: 400 });
  try {
    await prisma.$transaction(async tx => {
      const key = templateKey(user.trainer.id), stored = await tx.appContent.findUnique({ where: { key } });
      if ((stored?.updatedAt.toISOString() || null) !== (body.updatedAt || null)) throw new TemplateError('The course list changed. Reload before saving.', 409);
      const templates = stored ? JSON.parse(stored.value) : [];
      if (!Array.isArray(templates) || templates.some(item => !parseCourseTemplate(item))) throw new TemplateError('Saved courses could not be read.', 500);
      if (await tx.courseRun.count({ where: { trainerId: user.trainer.id, courseId: template.id } })) throw new TemplateError('This course is already scheduled. Save a copy to change its content without affecting existing groups.', 409);
      if (!templates.some(item => item.id === template.id) && templates.length >= 100) throw new TemplateError('The course library has reached its limit.', 400);
      const next = templates.some(item => item.id === template.id) ? templates.map(item => item.id === template.id ? template : item) : [...templates, template];
      if (stored) { const updated = await tx.appContent.updateMany({ where: { key, updatedAt: stored.updatedAt }, data: { value: JSON.stringify(next) } }); if (!updated.count) throw new TemplateError('The course list changed. Reload before saving.', 409); }
      else await tx.appContent.create({ data: { key, value: JSON.stringify(next) } });
    }, { isolationLevel: 'Serializable' });
    return NextResponse.json(await getCustomCourseTemplates(user.trainer.id));
  } catch (error) { if (error instanceof TemplateError) return NextResponse.json({ error: error.message }, { status: error.status }); if (error && typeof error === 'object' && 'code' in error && (error.code === 'P2034' || error.code === 'P2002')) return NextResponse.json({ error: 'The course list changed. Reload before saving.' }, { status: 409 }); throw error; }
}

export async function DELETE(request: Request) {
  const user = await requireTrainer();
  const text = await request.text();
  if (text.length > 2000) return NextResponse.json({ error: 'Invalid deletion request.' }, { status: 413 });
  let body;
  try { body = JSON.parse(text); } catch { return NextResponse.json({ error: 'Invalid deletion request.' }, { status: 400 }); }
  if (!body || typeof body.id !== 'string' || body.id.length > 100 || typeof body.updatedAt !== 'string') return NextResponse.json({ error: 'Choose a saved course to delete.' }, { status: 400 });
  try {
    await prisma.$transaction(async tx => {
      const key = templateKey(user.trainer.id);
      const stored = await tx.appContent.findUnique({ where: { key } });
      if (!stored) throw new TemplateError('Course not found.', 404);
      if (stored.updatedAt.toISOString() !== body.updatedAt) throw new TemplateError('The course list changed. Reload before deleting.', 409);
      const templates = JSON.parse(stored.value);
      if (!Array.isArray(templates) || templates.some(item => !parseCourseTemplate(item))) throw new TemplateError('Saved courses could not be read.', 500);
      if (!templates.some(item => item.id === body.id)) throw new TemplateError('Course not found.', 404);
      if (await tx.courseRun.count({ where: { trainerId: user.trainer.id, courseId: body.id } })) throw new TemplateError('This course has scheduled groups. Remove those groups in Services before deleting the course.', 409);
      const result = await tx.appContent.updateMany({ where: { key, updatedAt: stored.updatedAt }, data: { value: JSON.stringify(templates.filter(item => item.id !== body.id)) } });
      if (!result.count) throw new TemplateError('The course list changed. Reload before deleting.', 409);
    }, { isolationLevel: 'Serializable' });
    return NextResponse.json(await getCustomCourseTemplates(user.trainer.id));
  } catch (error) {
    if (error instanceof TemplateError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2034') return NextResponse.json({ error: 'The course changed while deleting. Reload and try again.' }, { status: 409 });
    throw error;
  }
}
