const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file, prisma, denied = false) {
  const compiled = ts.transpileModule(fs.readFileSync(require.resolve(file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((id) => {
    if (id === 'next/server') return require('next/server');
    if (id === '@/lib/prisma') return { default: prisma };
    if (id === '@/lib/training-diary') return require('../lib/training-diary.ts');
    if (id === '@/lib/auth') return { requireTrainer: async () => { if (denied) throw new Error('trainer access required'); return { trainer: { id: 'trainer-one' } }; } };
    throw new Error(id);
  }, exports);
  return exports;
}
const collection = '../app/api/trainer/diary/route.ts';
const individual = '../app/api/trainer/diary/[id]/route.ts';
const body = { dogId: 'dog-one', day: '2026-11-07', exerciseName: 'Recall', minutes: 3, repetitions: 7, result: '', completed: false };
const request = (value = body) => new Request('https://example.test', { method: 'POST', body: JSON.stringify(value) });
const context = { params: Promise.resolve({ id: 'entry-one' }) };

test('trainer diary denies callers before touching data', async () => {
  const post = load(collection, {}, true).POST;
  await assert.rejects(() => post(request()), /trainer access required/);
  const route = load(individual, {}, true);
  await assert.rejects(() => route.PUT(request(), context), /trainer access required/);
  await assert.rejects(() => route.DELETE(request(), context), /trainer access required/);
});
test('trainer cannot create or move training onto a foreign or unlinked dog', async () => {
  const prisma = { dog: { findFirst: async ({ where }) => { assert.deepEqual(where, { id: 'dog-one', trainerId: 'trainer-one', customerId: { not: null } }); return null; } } };
  assert.equal((await load(collection, prisma).POST(request())).status, 404);
  assert.equal((await load(individual, prisma).PUT(request(), context)).status, 404);
});
test('trainer schedules daily entries against the assigned dog', async () => {
  const writes = [];
  const prisma = { dog: { findFirst: async () => ({ id: 'dog-one' }) }, trainingEntry: { create: async ({ data }) => { writes.push(data); return data; } }, $transaction: async (operations) => Promise.all(operations) };
  const result = await load(collection, prisma).POST(request({ ...body, repeatDays: 7 }));
  assert.equal(result.status, 201);
  assert.equal((await result.json()).count, 7);
  assert.deepEqual(writes.map(e => e.day), ['2026-11-07','2026-11-08','2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-13']);
});
test('update and delete retain trainer ownership filters and return 404 for foreign entries', async () => {
  const prisma = { dog: { findFirst: async () => ({ id: 'dog-one' }) }, trainingEntry: {
    updateMany: async ({ where }) => { assert.deepEqual(where, { id: 'entry-one', dogId: 'dog-one', dog: { trainerId: 'trainer-one' } }); return { count: 0 }; },
    deleteMany: async ({ where }) => { assert.deepEqual(where, { id: 'entry-one', dog: { trainerId: 'trainer-one', customerId: { not: null } } }); return { count: 0 }; },
  } };
  const route = load(individual, prisma);
  assert.equal((await route.PUT(request(), context)).status, 404);
  assert.equal((await route.DELETE(request(), context)).status, 404);
});
