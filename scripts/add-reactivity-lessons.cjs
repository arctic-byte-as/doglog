const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');
const defaultSubject = require('../data/reactivity-training.json');

function mergeLessons(skills, requireExisting = true, subject = defaultSubject) {
  const next = structuredClone(skills);
  const matches = next.filter((skill) => skill.title.trim().toLowerCase() === subject.title.toLowerCase());
  if (matches.length > 1) throw new Error('Multiple matching subjects found; no changes made.');
  let target = matches[0];
  if (!target) {
    if (requireExisting) throw new Error('Existing subject not found; no changes made.');
    target = { title: subject.title, summary: subject.summary, subcategories: [] };
    next.push(target);
  }
  let added = 0;
  for (const lesson of subject.subcategories) {
    const url = new URL(lesson.youtubeUrl);
    if (url.hostname !== 'www.youtube.com' || !/^[\w-]{11}$/.test(url.searchParams.get('v'))) throw new Error('Invalid lesson video link.');
    const existing = target.subcategories.find((item) => item.title.toLowerCase() === lesson.title.toLowerCase() || item.youtubeUrl === lesson.youtubeUrl);
    if (existing) {
      if (existing.youtubeUrl !== lesson.youtubeUrl) throw new Error('Conflicting lesson found; no changes made.');
      continue;
    }
    target.subcategories.push(lesson);
    added++;
  }
  return { skills: next, added, subjectTitle: target.title, lessonCount: target.subcategories.length };
}

async function run() {
  const contentIndex = process.argv.indexOf('--content');
  const subject = contentIndex === -1 ? defaultSubject : JSON.parse(fs.readFileSync(path.resolve(process.argv[contentIndex + 1]), 'utf8'));
  const prisma = new PrismaClient();
  try {
    const row = await prisma.appContent.findUniqueOrThrow({ where: { key: 'skills-library' } });
    const result = mergeLessons(JSON.parse(row.value), !process.argv.includes('--allow-new-subject'), subject);
    if (process.argv.includes('--apply') && result.added) {
      const backup = path.join(process.cwd(), '.vercel', `skills-library-before-content-${Date.now()}.json`);
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.writeFileSync(backup, row.value, { mode: 0o600 });
      const saved = await prisma.appContent.updateMany({ where: { key: row.key, value: row.value }, data: { value: JSON.stringify(result.skills) } });
      if (saved.count !== 1) throw new Error('Library changed during the update; no changes applied. Retry after review.');
      const after = await prisma.appContent.findUniqueOrThrow({ where: { key: row.key } });
      const checked = mergeLessons(JSON.parse(after.value), true, subject);
      if (checked.added !== 0) throw new Error('Read-back verification failed.');
      console.log(JSON.stringify({ status: 'saved', subject: result.subjectTitle, added: result.added, lessonCount: result.lessonCount, otherSubjectsPreserved: true, backup }));
    } else {
      console.log(JSON.stringify({ status: result.added ? 'dry-run' : 'already-present', subject: result.subjectTitle, added: result.added, lessonCount: result.lessonCount }));
    }
  } finally { await prisma.$disconnect(); }
}
module.exports = { mergeLessons };
if (require.main === module) run().catch(() => { console.error('Could not safely update the skills library. No credentials are logged.'); process.exitCode = 1; });
