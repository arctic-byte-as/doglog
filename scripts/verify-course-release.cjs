const { PrismaClient } = require('@prisma/client');
const crypto = require('node:crypto'), fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { spawnSync } = require('node:child_process');
require('@next/env').loadEnvConfig(process.cwd());
const deployment = process.argv[2];
if (!process.env.DATABASE_URL?.includes('gksrxfnghehimzuiqyfs') || !deployment?.startsWith('https://doglog-development-')) throw Error('This check is restricted to the isolated development project.');
const db = new PrismaClient(), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doglog-course-release-')), tag = crypto.randomUUID();
const ids = { run: crypto.randomUUID(), owner: crypto.randomUUID(), otherOwner: crypto.randomUUID(), otherTrainer: crypto.randomUUID(), dog: crypto.randomUUID(), otherDog: crypto.randomUUID() };
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
  const trainer = await db.trainer.findUniqueOrThrow({ where: { email: 'admin@example.test' } });
  const admin = await db.user.findUniqueOrThrow({ where: { email: trainer.email } });
  const email = `course-${tag}@example.test`, otherEmail = `other-course-${tag}@example.test`, trainerEmail = `trainer-course-${tag}@example.test`;
  await db.trainer.create({ data: { id: ids.otherTrainer, name: 'Release check trainer', email: trainerEmail } });
  for (const [id, name, address] of [[ids.owner, 'Release check owner', email], [ids.otherOwner, 'Other release check owner', otherEmail]]) await db.customer.create({ data: { id, name, email: address } });
  for (const [address, role] of [[email, 'CUSTOMER'], [otherEmail, 'CUSTOMER'], [trainerEmail, 'TRAINER']]) { const user = await db.user.create({ data: { email: address, role, name: 'Course release check' } }); createdUsers.push(user.id); }
  await db.dog.create({ data: { id: ids.dog, name: 'Course check dog', owner: 'Release check owner', age: '', breed: '', status: 'Test', trainerId: trainer.id, customerId: ids.owner } });
  await db.dog.create({ data: { id: ids.otherDog, name: 'Other check dog', owner: 'Other owner', age: '', breed: '', status: 'Test', trainerId: ids.otherTrainer, customerId: ids.otherOwner } });
  const adminToken = await session(admin.id), ownerToken = await session(createdUsers[0]), otherOwnerToken = await session(createdUsers[1]), trainerToken = await session(createdUsers[2]);
  let body = { id: ids.run, courseId: 'puppy', name: `Release-course-${tag}`, location: 'Test field', cadenceWeeks: 2, dogIds: [ids.dog], sessions: [0, 2].map((weekIndex, i) => ({ id: crypto.randomUUID(), weekIndex, day: i ? '2026-11-23' : '2026-11-09', startTime: '18:00', endTime: '19:00' })) };
  assert(request('/api/course-runs', ownerToken, 'POST', body).status === 307, 'Owner must not create course groups');
  assert(request('/api/course-runs', trainerToken, 'POST', body).status === 403, 'Foreign trainer must not enrol another trainer dog');
  const created = request('/api/course-runs', adminToken, 'POST', body); assert(created.status === 201, `Create failed: ${created.status}`); body = created.data.run;
  assert(body.sessions.length === 2 && body.updatedAt, 'Created group has sessions and version');
  assert(request('/api/course-runs', adminToken).data.runs.some(run => run.id === ids.run), 'Saved group survives reload');
  assert(!request('/api/course-runs', trainerToken).data.runs.some(run => run.id === ids.run), 'Foreign trainer list isolation');
  assert(request(`/api/course-runs/${ids.run}`, trainerToken, 'DELETE').status === 404, 'Foreign delete denied');
  const edit = request(`/api/course-runs/${ids.run}`, adminToken, 'PUT', { ...body, location: 'Updated field' }); assert(edit.status === 200, `Edit failed: ${edit.status}`);
  assert(request(`/api/course-runs/${ids.run}`, adminToken, 'PUT', body).status === 409, 'Stale edit denied'); body = edit.data.run;
  assert(request('/customer/diary', ownerToken).text.includes(body.name), 'Enrolled owner calendar shows group');
  assert(!request('/customer/diary', otherOwnerToken).text.includes(body.name), 'Other owner calendar hides group');
  const unenrol = request(`/api/course-runs/${ids.run}`, adminToken, 'PUT', { ...body, dogIds: [] }); assert(unenrol.status === 200, 'Unenrol saved');
  assert(!request('/customer/diary', ownerToken).text.includes(body.name), 'Unenrolled owner loses calendar session');
  assert(request(`/api/course-runs/${ids.run}`, adminToken, 'DELETE').status === 200, 'Delete succeeds');
  console.log('PASS: durable create/reload/edit/delete, stale-edit protection, trainer isolation, owner enrolment calendar visibility and unenrolment.');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  await db.courseRun.deleteMany({ where: { id: ids.run } });
  await db.dog.deleteMany({ where: { id: { in: [ids.dog, ids.otherDog] } } });
  await db.session.deleteMany({ where: { id: { in: sessionIds } } });
  await db.user.deleteMany({ where: { id: { in: createdUsers } } });
  await db.customer.deleteMany({ where: { id: { in: [ids.owner, ids.otherOwner] } } });
  await db.trainer.deleteMany({ where: { id: ids.otherTrainer } });
  await db.$disconnect(); fs.rmSync(dir, { recursive: true, force: true });
});
