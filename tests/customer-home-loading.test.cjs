const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function loadPage(prisma, videos, publications) {
  const compiled = ts.transpileModule(fs.readFileSync(require.resolve('../app/customer/page.tsx'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((id) => {
    if (id === 'react/jsx-runtime') return require(id);
    if (id === 'next/link') return { default: 'Link' };
    if (id === '@/lib/prisma') return { default: prisma };
    if (id === '@/lib/auth') return { requireCustomer: async () => ({ customer: { id: 'owner-one' } }) };
    if (id === '@/lib/i18n/customer') return { getCustomerLocale: async () => 'en', getCustomerDictionary: () => ({ dashboard: {}, services: new Proxy({}, { get: () => ({ title: 'Service', description: '' }) }) }) };
    if (id === '@/lib/courses') return { getCourses: () => [] };
    if (id === '@/lib/service-options') return require('../lib/service-options.ts');
    if (id === '@/lib/recommended-videos-server') return { getRecommendedVideos: videos };
    if (id === '@/lib/consultation-versions') return { getCustomerPublishedConsultations: publications };
    if (id.startsWith('@/components/')) { const name = id.split('/').at(-1); return { default: name, [name]: name }; }
    throw Error(id);
  }, exports);
  return exports.default;
}
test('Home starts independent service loads together and fetches only its seven-day training window', async () => {
  const started = [], releases = [];
  const deferred = (name) => { started.push(name); return new Promise(resolve => releases.push(() => resolve([]))); };
  const prisma = { customer: { findUniqueOrThrow: async ({ where }) => { assert.equal(where.id, 'owner-one'); return { name: 'Owner', dogs: [], serviceAccess: ['TAILORED_TRAINING_PLAN','RECOMMENDED_VIDEOS','CONSULTATIONS'].map(serviceKey => ({ serviceKey })) }; } }, trainingEntry: { findMany: (query) => {
    assert.equal(query.where.dog.customerId, 'owner-one');
    const start = new Date(`${query.where.day.gte}T12:00:00Z`), end = new Date(`${query.where.day.lte}T12:00:00Z`);
    assert.equal((end - start) / 86400000, 6);
    return deferred('training');
  } } };
  const page = loadPage(prisma, () => deferred('videos'), () => deferred('publications'));
  const pending = page();
  // Allow the auth, locale and owner reads to resolve, without resolving service data.
  for (let i = 0; i < 8; i++) await Promise.resolve();
  assert.deepEqual(started, ['videos','training','publications']);
  releases.forEach(release => release());
  await pending;
});
