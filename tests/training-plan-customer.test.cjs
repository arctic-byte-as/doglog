const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(prisma) {
  const source = fs.readFileSync(require.resolve('../app/services/tailored-training-plan/page.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((id) => {
    if (id === 'next/link') return { default: 'Link' };
    if (id === 'react/jsx-runtime') return require(id);
    if (id === '@/lib/prisma') return { default: prisma };
    if (id === '@/lib/auth') return { requireTrainer: async () => ({ trainer: { id: 'trainer-one' } }) };
    if (id.startsWith('@/components/')) { const name = id.split('/').at(-1); return { default: name, [name]: name }; }
    throw Error(id);
  }, exports);
  return exports.default;
}
function elements(tree) {
  if (Array.isArray(tree)) return tree.flatMap(elements);
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...elements(tree.props?.children)];
}
const customers = [{ id: 'customer-a', name: 'First owner', serviceAccess: [], dogs: [] }, { id: 'customer-b', name: 'Second owner', serviceAccess: [], dogs: [] }];
function fixture(owners = customers, entries = []) {
  const reads = [];
  const prisma = { customer: { findMany: async ({ where, include }) => { assert.deepEqual(where, { dogs: { some: { trainerId: 'trainer-one' } } }); assert.deepEqual(include.dogs.where, { trainerId: 'trainer-one', trainingEntries: { some: {} } }); return owners; } }, dog: { findMany: async ({ where }) => { reads.push(['dogs', where]); return [{ id: 'dog-b', name: 'Dog B' }]; } }, trainingEntry: { findMany: async ({ where }) => { reads.push(['entries', where]); return entries; } } };
  return { page: load(prisma), reads };
}
test('opening service without a customer does not silently load the first owner', async () => {
  const { page, reads } = fixture();
  const tree = await page({ searchParams: Promise.resolve({}) });
  assert.deepEqual(reads, []);
  const selector = elements(tree).find(e => e.type === 'TrainingPlanCustomerSelect');
  assert.equal(selector.props.selectedCustomerId, '');
  assert.equal(elements(tree).some(e => e.type === 'TrainingDiaryClient'), false);
});
test('selecting the second owner loads only their assigned dogs and diary, not the first owner', async () => {
  const { page, reads } = fixture();
  const tree = await page({ searchParams: Promise.resolve({ customerId: 'customer-b' }) });
  assert.deepEqual(reads, [['dogs', { customerId: 'customer-b', trainerId: 'trainer-one' }], ['entries', { dog: { customerId: 'customer-b', trainerId: 'trainer-one' } }]]);
  const nodes = elements(tree);
  assert.equal(nodes.find(e => e.type === 'TrainingPlanCustomerSelect').props.selectedCustomerId, 'customer-b');
  assert.equal(nodes.find(e => e.type === 'TrainingDiaryClient').key, 'customer-b');
  assert.equal(nodes.find(e => e.type === 'CustomerServiceAccessForm').props.customerId, 'customer-b');
});
test('unknown customer IDs never fall back to another customer’s plan', async () => {
  const { page, reads } = fixture();
  const tree = await page({ searchParams: Promise.resolve({ customerId: 'foreign-customer' }) });
  assert.deepEqual(reads, []);
  assert.equal(elements(tree).some(e => e.type === 'TrainingDiaryClient'), false);
});

test('saved plans list links identify both owner and dog, including disabled service access', async () => {
  const owners = [{ ...customers[1], dogs: [{ id: 'dog-b', name: 'Dog B', trainingEntries: [{ day: '2026-01-01', completed: true }, { day: '2026-01-02', completed: false }] }] }];
  const { page } = fixture(owners);
  const tree = await page({ searchParams: Promise.resolve({}) });
  const links = elements(tree).filter(e => e.type === 'Link');
  assert.equal(links.length, 1);
  const url = new URL(links[0].props.href, 'https://example.test');
  assert.equal(url.searchParams.get('customerId'), 'customer-b');
  assert.equal(url.searchParams.get('dogId'), 'dog-b');
  assert.equal(url.searchParams.get('day'), '2026-01-02');
  assert.equal(url.hash, '#plan-editor');
});
test('opening an existing plan selects its dog and saved date; foreign dog/date inputs are ignored', async () => {
  const { page } = fixture(customers, [{ id: 'entry', dogId: 'dog-b', day: '2026-01-02' }]);
  const tree = await page({ searchParams: Promise.resolve({ customerId: 'customer-b', dogId: 'dog-b', day: '2026-01-02' }) });
  const diary = elements(tree).find(e => e.type === 'TrainingDiaryClient');
  assert.equal(diary.props.initialDogId, 'dog-b');
  assert.equal(diary.props.initialDay, '2026-01-02');
  const foreign = await page({ searchParams: Promise.resolve({ customerId: 'customer-b', dogId: 'foreign-dog', day: '2026-01-02' }) });
  const other = elements(foreign).find(e => e.type === 'TrainingDiaryClient');
  assert.equal(other.props.initialDogId, undefined);
  assert.equal(other.props.initialDay, undefined);
});
