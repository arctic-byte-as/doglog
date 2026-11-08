const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
const { randomUUID } = require('node:crypto');
function load(file, imports = {}) {
  const source = ts.transpileModule(fs.readFileSync(require.resolve(file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {}; new Function('require', 'exports', source)(id => { if (id in imports) return imports[id]; throw Error(id); }, exports); return exports;
}
const validation = load('../lib/course-templates.ts', { './training-library': require('../lib/training-library.ts') });
const template = () => ({ id: `custom-${randomUUID()}`, title: 'Small group', summary: 'Four weeks together', serviceKey: 'OPEN_TRAINING', capacity: 3, durationMinutes: 90, weeks: [{ title: 'Week 1', focus: 'Settling', details: 'Reward calm behaviour.', activities: ['Mat work'] }] });
test('course builder validates service, capacity, duration and bounded content', () => {
  const value = template(); assert.deepEqual(validation.parseCourseTemplate(value), value);
  for (const patch of [{ id: 'custom-------------------------------------' }, { serviceKey: 'ADMIN' }, { capacity: 0 }, { capacity: 3.5 }, { durationMinutes: 481 }, { weeks: [] }, { weeks: [{ ...value.weeks[0], focus: '' }] }]) assert.equal(validation.parseCourseTemplate({ ...value, ...patch }), null);
  assert.equal(validation.parseCourseTemplate({ ...value, capacity: null }).capacity, null);
});
function route(tx, current = { templates: [], updatedAt: null }) {
  return load('../app/api/course-templates/route.ts', {
    'next/server': { NextResponse: { json: (data, options) => ({ data, status: options?.status || 200 }) } },
    '@/lib/auth': { requireTrainer: async () => ({ trainer: { id: 'trainer-one' } }) },
    '@/lib/prisma': { default: { $transaction: async fn => fn(tx) } },
    '@/lib/course-template-server': { templateKey: id => `course-templates:${id}`, getCustomCourseTemplates: async () => current },
    '@/lib/course-templates': validation,
  });
}
const request = data => new Request('http://localhost/api/course-templates', { method: 'PUT', body: JSON.stringify(data) });
test('course builder scopes saves to the signed-in trainer and stores only validated fields', async () => {
  const value = template(); let saved;
  const api = route({ appContent: { findUnique: async ({ where }) => { assert.equal(where.key, 'course-templates:trainer-one'); return null; }, create: async ({ data }) => { saved = data; } }, courseRun: { count: async ({ where }) => { assert.equal(where.trainerId, 'trainer-one'); return 0; } } });
  assert.equal((await api.PUT(request({ template: { ...value, trainerId: 'foreign' }, updatedAt: null }))).status, 200);
  assert.deepEqual(JSON.parse(saved.value), [value]);
});
test('scheduled courses and stale library edits cannot overwrite saved definitions', async () => {
  const value = template(), updatedAt = new Date('2026-11-08T10:00:00Z'); let writes = 0;
  const tx = { appContent: { findUnique: async () => ({ value: JSON.stringify([value]), updatedAt }), updateMany: async () => { writes++; return { count: 1 }; } }, courseRun: { count: async () => 1 } };
  const api = route(tx);
  assert.equal((await api.PUT(request({ template: value, updatedAt: updatedAt.toISOString() }))).status, 409);
  assert.equal((await api.PUT(request({ template: value, updatedAt: null }))).status, 409);
  assert.equal((await api.PUT(request(null))).status, 400); assert.equal(writes, 0);
});

test('library exercises retain exact names, categories, instructions and translations through a saved course', () => {
  const category = require('../lib/training-library.ts').categories[0];
  const linked = { category: category.title, exercise: { ...category.exercises[0], translations: { nb: { title: 'Testøvelse', steps: ['Belønn hunden.'] } } } };
  const value = template(); value.weeks[0].libraryExercises = [linked];
  const parsed = validation.parseCourseTemplate(JSON.parse(JSON.stringify(value)));
  assert.deepEqual(parsed.weeks[0].libraryExercises, [linked]);
  assert.equal(validation.parseCourseTemplate({ ...value, weeks: [{ ...value.weeks[0], libraryExercises: [linked, linked] }] }), null);
  for (const libraryExercises of [[{ ...linked, exercise: { title: 'Missing instructions' } }], Array(21).fill(linked), [{ ...linked, category: '' }]]) assert.equal(validation.parseCourseTemplate({ ...value, weeks: [{ ...value.weeks[0], libraryExercises }] }), null);
  assert.equal(validation.parseCourseTemplate(template()).weeks[0].libraryExercises, undefined);
});
