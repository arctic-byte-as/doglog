const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { consultationDraftData } = require('../lib/consultation-draft.ts');

function versionHelpers(prisma = {}) {
  const source = fs.readFileSync(require.resolve('../lib/consultation-versions.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((name) => {
    assert.equal(name, './prisma', 'Snapshot helpers must not load real database or authentication modules in these tests.');
    return { default: prisma };
  }, exports);
  return exports;
}

function consultation() {
  return {
    id: 'consultation-one', date: new Date('2026-11-01T12:30:00.000Z'),
    focus: 'Greeting visitors', outcome: 'Reward four paws on the floor.',
    generalDescription: 'Jumps when the door opens.', dogBreed: 'Labrador Retriever',
    learningHistory: null, situation: null, nutrition: null, health: null,
    hormoneAnalysis: null, activation: 'Training:\n5 minutes', stimulusAnalysis: null,
    prescribedPlan: 'Starting plan: Calm greetings\n\nPractise quietly.', dogId: 'dog-one',
    dog: {
      id: 'dog-one', name: 'Luna', age: '15 months', breed: 'Labrador Retriever',
      status: 'Active', owner: 'Example customer', trainerId: 'trainer-one',
      customerId: 'customer-one', lastIncident: null, profileImageUrl: null,
    },
  };
}

const { snapshotConsultation, hydrateConsultationSnapshot } = versionHelpers();

test('snapshot allowlist excludes auth secrets, unrelated data and nested publication records', () => {
  const draft = consultation();
  draft.user = { passwordHash: 'private' };
  draft.sessionToken = 'private';
  draft.versions = [{ snapshot: 'private', pdfEn: 'private' }];
  draft.dog.customer = { email: 'private@example.test', phone: 'private' };
  draft.dog.passwordHash = 'private';
  const snapshot = snapshotConsultation(draft);
  assert.equal(snapshot.user, undefined);
  assert.equal(snapshot.sessionToken, undefined);
  assert.equal(snapshot.versions, undefined);
  assert.equal(snapshot.dog.customer, undefined);
  assert.equal(snapshot.dog.passwordHash, undefined);
  assert.equal(snapshot.dog.owner, draft.dog.owner);
  assert.equal(snapshot.dog.customerId, 'customer-one');
  assert.equal(JSON.stringify(snapshot).includes('private'), false);
});

test('saved snapshot JSON round-trips dates, null values and all consultation content', () => {
  const draft = consultation();
  const snapshot = JSON.parse(JSON.stringify(snapshotConsultation(draft)));
  assert.equal(snapshot.date, '2026-11-01T12:30:00.000Z');
  const hydrated = hydrateConsultationSnapshot(snapshot);
  assert.ok(hydrated.date instanceof Date);
  assert.deepEqual(hydrated, draft);
  assert.equal(hydrated.learningHistory, null);
});

test('subsequent draft and hydrated-report edits cannot mutate the saved snapshot', () => {
  const draft = consultation();
  const snapshot = snapshotConsultation(draft);
  const saved = JSON.stringify(snapshot);
  draft.date.setFullYear(2030);
  draft.outcome = 'A different action';
  draft.dog.name = 'Changed dog name';
  draft.dog.customerId = 'other-customer';
  assert.equal(JSON.stringify(snapshot), saved);
  const report = hydrateConsultationSnapshot(snapshot);
  report.date.setFullYear(2031);
  report.dog.name = 'Another change';
  report.prescribedPlan = 'Changed report';
  assert.equal(JSON.stringify(snapshot), saved);
});

test('malformed snapshots, invalid dates and mismatched dog identity fail closed', () => {
  const valid = snapshotConsultation(consultation());
  for (const invalid of [null, undefined, [], {}, { ...valid, schemaVersion: 2 }, { ...valid, dog: null }, { ...valid, date: 'not-a-date' }, { ...valid, date: null }, { ...valid, dogId: 'different-dog' }, { ...valid, focus: null }, { ...valid, dog: { ...valid.dog, trainerId: null } }]) {
    assert.throws(() => hydrateConsultationSnapshot(invalid));
  }
});

test('draft allowlist permits authored text and deliberate clearing only', () => {
  const input = { focus: 'Recall', prescribedPlan: '', health: 'No concerns recorded.' };
  assert.deepEqual(consultationDraftData(input), input);
  assert.deepEqual(consultationDraftData({}), {});
  assert.notEqual(consultationDraftData(input), input);
});

test('draft allowlist rejects identity changes, publication changes and nested writes', () => {
  for (const input of [null, [], 'plan', 5, { id: 'other' }, { dogId: 'other' }, { versions: { create: { snapshot: {} } } }, { dog: { update: { customerId: 'other' } } }, { snapshot: {} }, { publishedAt: '2030-01-01' }, { publishedById: 'other' }, { requestId: 'other' }, { pdfEn: 'bytes' }, { focus: null }, { prescribedPlan: { set: 'nested' } }, { outcome: ['nested'] }, JSON.parse('{"__proto__":{"polluted":true}}')]) {
    assert.throws(() => consultationDraftData(input));
  }
});

test('customer version readers use both current ownership and publication ownership', async () => {
  const snapshot = snapshotConsultation(consultation());
  const metadata = { id: 'version-one', consultationId: 'consultation-one', version: 1, publishedAt: new Date('2026-11-01T13:00:00Z'), publishedById: 'trainer-user', snapshot };
  let query;
  const helpers = versionHelpers({ consultationVersion: { findFirst: async (args) => { query = args; return metadata; } } });
  const result = await helpers.getCustomerPublishedConsultation('consultation-one', 'customer-one', 'version-one');
  assert.equal(result.version.id, 'version-one');
  assert.deepEqual(query.where.consultation, { dog: { customerId: 'customer-one' } });
  assert.deepEqual(query.where.snapshot, { path: ['dog', 'customerId'], equals: 'customer-one' });
  assert.equal(query.where.id, 'version-one');
  assert.equal(await helpers.getCustomerPublishedConsultation('consultation-one', 'another-customer', 'version-one'), null);
});

test('consultation dates are manually editable but publication timestamps remain protected', () => {
  assert.equal(consultationDraftData({ date: '2026-11-01' }).date.toISOString(), '2026-11-01T00:00:00.000Z');
  assert.equal(consultationDraftData({ date: '2028-02-29' }).date.toISOString(), '2028-02-29T00:00:00.000Z');
  for (const date of ['', '0000-01-01', '2027-02-29', '2026-02-30', '01/11/2026', '2026-11-01T12:00:00Z']) assert.throws(() => consultationDraftData({ date }));
  assert.throws(() => consultationDraftData({ publishedAt: '2026-11-01' }));
});

test('customer report listing returns one latest publication per consultation', async () => {
  const snapshot = snapshotConsultation(consultation());
  const rows = [
    { id: 'v3', consultationId: 'consultation-one', version: 3, publishedAt: new Date('2026-11-03'), publishedById: null, snapshot },
    { id: 'v2', consultationId: 'consultation-one', version: 2, publishedAt: new Date('2026-11-02'), publishedById: null, snapshot },
    { id: 'other-v1', consultationId: 'consultation-two', version: 1, publishedAt: new Date('2026-11-01'), publishedById: null, snapshot: { ...snapshot, id: 'consultation-two' } },
    { id: 'v1', consultationId: 'consultation-one', version: 1, publishedAt: new Date('2026-10-31'), publishedById: null, snapshot },
  ];
  const helpers = versionHelpers({ consultationVersion: { findMany: async () => rows } });
  const result = await helpers.getCustomerPublishedConsultations('customer-one');
  assert.deepEqual(result.map((item) => item.version.id), ['v3', 'other-v1']);
});

test('previous-version downloads exclude latest and drafts and enforce consultation/customer scope', async () => {
  const snapshot = snapshotConsultation(consultation());
  const row = { id: 'old-v1', consultationId: 'consultation-one', version: 1, publishedAt: new Date('2026-11-01'), publishedById: null, snapshot };
  let query;
  const helpers = versionHelpers({ consultationVersion: { findMany: async (args) => { query = args; return [row]; } } });
  const result = await helpers.getCustomerPreviousConsultationVersions('consultation-one', 'customer-one', 3);
  assert.equal(result.length, 1);
  assert.equal(query.where.consultationId, 'consultation-one');
  assert.deepEqual(query.where.version, { lt: 3 });
  assert.deepEqual(query.where.consultation, { dog: { customerId: 'customer-one' } });
  assert.deepEqual(query.where.snapshot, { path: ['dog', 'customerId'], equals: 'customer-one' });
  assert.deepEqual(await helpers.getCustomerPreviousConsultationVersions('consultation-one', 'other-customer', 3), []);
  assert.deepEqual(await helpers.getCustomerPreviousConsultationVersions('consultation-one', 'customer-one', 1), []);
});
