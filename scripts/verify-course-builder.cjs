const { PrismaClient } = require('@prisma/client');
const crypto = require('node:crypto'), fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { spawnSync } = require('node:child_process');
require('@next/env').loadEnvConfig(process.cwd());
const deployment = process.argv[2];
if (!process.env.DATABASE_URL?.includes('gksrxfnghehimzuiqyfs') || !deployment?.startsWith('https://doglog-development-')) throw Error('This check is restricted to the isolated development project.');
const db = new PrismaClient(), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doglog-course-release-')), tag = crypto.randomUUID();
const ids = { trainer: crypto.randomUUID(), owner: crypto.randomUUID(), run: crypto.randomUUID(), template: `custom-${crypto.randomUUID()}`, copy: `custom-${crypto.randomUUID()}`, dogs: Array.from({ length: 4 }, () => crypto.randomUUID()) };
const createdUsers = [], sessionIds = [];
function assert(value, label) { if (!value) throw Error(label); }
async function session(userId) { const token = crypto.randomBytes(32).toString('base64url'); const s = await db.session.create({ data: { userId, sessionToken: crypto.createHash('sha256').update(token).digest('base64url'), expires: new Date(Date.now() + 600000) } }); sessionIds.push(s.id); return token; }
let callNumber = 0;
function request(route, token, method = 'GET', body) {
  const output = path.join(dir, `${++callNumber}.response`), args = ['curl', route, '--deployment', deployment, '--', '--silent', '--show-error', '--output', output, '--write-out', '%{http_code}', '--header', `Cookie: doglog_session=${token}`, '--request', method];
  if (body) { const file = path.join(dir, `${callNumber}.json`); fs.writeFileSync(file, JSON.stringify(body)); args.push('--header', 'Content-Type: application/json', '--data-binary', `@${file}`); }
  const result = spawnSync('vercel', args, { encoding: 'utf8', timeout: 45000 });
  assert(result.status === 0, `Request failed: ${method} ${route}`);
  const status = Number(result.stdout.trim().slice(-3)), text = fs.readFileSync(output, 'utf8'); let data; try { data = JSON.parse(text); } catch {}
  return { status, text, data };
}
(async () => {
  const trainerEmail = `builder-trainer-${tag}@example.test`, ownerEmail = `builder-owner-${tag}@example.test`;
  await db.trainer.create({ data: { id: ids.trainer, name: 'Builder integration check', email: trainerEmail } });
  await db.customer.create({ data: { id: ids.owner, name: 'Builder owner check', email: ownerEmail } });
  for (const [email, role] of [[trainerEmail, 'TRAINER'], [ownerEmail, 'CUSTOMER']]) {
    const user = await db.user.create({ data: { email, role, name: 'Builder integration check' } }); createdUsers.push(user.id);
  }
  for (const id of ids.dogs) await db.dog.create({ data: { id, name: `Builder dog ${id.slice(0, 4)}`, owner: 'Builder owner check', age: '', breed: '', status: 'Test', trainerId: ids.trainer, customerId: ids.owner } });
  const trainerToken = await session(createdUsers[0]), ownerToken = await session(createdUsers[1]);
  const template = { id: ids.template, title: `Open Training ${tag}`, summary: 'Four weeks, three dogs', serviceKey: 'OPEN_TRAINING', capacity: 3, durationMinutes: 90, weeks: Array.from({ length: 4 }, (_, i) => ({ title: `Week ${i + 1}`, focus: 'Calm around dogs', details: `Builder instructions ${tag} week ${i + 1}`, activities: ['Mat work', 'Reward attention'] })) };
  assert(request('/api/course-templates', ownerToken, 'PUT', { template, updatedAt: null }).status === 307, 'Owner cannot build trainer courses');
  const saved = request('/api/course-templates', trainerToken, 'PUT', { template, updatedAt: null }); assert(saved.status === 200, `Template save failed: ${saved.status}`);
  assert(saved.data.templates.some(item => item.id === ids.template), 'Template persisted');
  assert(request('/course-builder', trainerToken).text.includes(template.title), 'Builder reload displays saved course');
  const page = request(`/services/courses?courseId=${ids.template}&service=OPEN_TRAINING`, trainerToken);
  assert(page.status === 200 && page.text.includes(template.title) && page.text.includes('19:30'), 'Services receives template and default duration');
  const body = { id: ids.run, courseId: ids.template, name: `Builder group ${tag}`, location: 'Test field', cadenceWeeks: 1, dogIds: ids.dogs, sessions: template.weeks.map((_, weekIndex) => ({ id: crypto.randomUUID(), weekIndex, day: `2026-11-${String(9 + weekIndex * 7).padStart(2, '0')}`, startTime: '18:00', endTime: '19:30' })) };
  assert(request('/api/course-runs', trainerToken, 'POST', body).status === 400, 'Fourth dog rejected by server capacity');
  body.dogIds = ids.dogs.slice(0, 3);
  const created = request('/api/course-runs', trainerToken, 'POST', body); assert(created.status === 201, `Custom course scheduling failed: ${created.status}`);
  assert(await db.customerServiceAccess.findUnique({ where: { customerId_serviceKey: { customerId: ids.owner, serviceKey: 'OPEN_TRAINING' } } }), 'Selected service granted');
  assert(request('/customer/diary', ownerToken).text.includes(body.name), 'Custom course on shared calendar');
  const customerService = request('/customer/services/open-training', ownerToken);
  assert(customerService.status === 200 && customerService.text.includes(template.weeks[0].details), 'Owner sees correct custom course instructions in selected service');
  assert(request('/api/course-templates', trainerToken, 'PUT', { template: { ...template, title: 'Changed' }, updatedAt: saved.data.updatedAt }).status === 409, 'Used template edit prevented');
  assert(request('/api/course-templates', trainerToken, 'PUT', { template: { ...template, id: ids.copy }, updatedAt: saved.data.updatedAt }).status === 200, 'New version can be saved');
  assert(request('/api/course-templates', trainerToken, 'PUT', { template: { ...template, id: ids.copy }, updatedAt: saved.data.updatedAt }).status === 409, 'Stale library update prevented');
  assert(request('/api/course-runs', trainerToken).data.runs.some(run => run.id === ids.run && run.sessions.length === 4), 'Group persists across reload');
  console.log('PASS: course builder save/reload, service allocation, 90-minute default, three-dog capacity, four scheduled weeks, service grant, customer calendar/content, definition protection, new versions and stale-edit protection.');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  await db.courseRun.deleteMany({ where: { trainerId: ids.trainer } });
  await db.appContent.deleteMany({ where: { key: `course-templates:${ids.trainer}` } });
  await db.dog.deleteMany({ where: { id: { in: ids.dogs } } });
  await db.session.deleteMany({ where: { id: { in: sessionIds } } });
  await db.user.deleteMany({ where: { id: { in: createdUsers } } });
  await db.customer.deleteMany({ where: { id: ids.owner } });
  await db.trainer.deleteMany({ where: { id: ids.trainer } });
  await db.$disconnect(); fs.rmSync(dir, { recursive: true, force: true });
});
