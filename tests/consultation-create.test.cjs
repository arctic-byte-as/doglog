const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function route(prisma) {
  const source = fs.readFileSync(require.resolve('../app/api/consultations/route.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((id) => {
    if (id === 'next/server') return require('next/server');
    if (id === '@/lib/prisma') return { default: prisma };
    if (id === '@/lib/auth') return { requireTrainer: async () => ({ trainer: { id: 'trainer-one' } }) };
    throw new Error(`Unexpected dependency ${id}`);
  }, exports);
  return exports.POST;
}
const request = body => new Request('https://example.test/api/consultations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('missing dog returns 400 without silently assigning an arbitrary dog', async () => {
  const post = route({});
  for (const dogId of [undefined, '', '   ', 42]) {
    const response = await post(request({ dogId }));
    assert.equal(response.status, 400);
  }
});

test('another trainer’s dog cannot receive a new consultation', async () => {
  const post = route({ dog: { findFirst: async query => {
    assert.deepEqual(query.where, { id: 'foreign-dog', trainerId: 'trainer-one' });
    return null;
  } } });
  assert.equal((await post(request({ dogId: 'foreign-dog' }))).status, 404);
});

test('valid selection saves against the authorised dog', async () => {
  const post = route({ dog: { findFirst: async query => {
    assert.deepEqual(query.where, { id: 'selected-dog', trainerId: 'trainer-one' });
    return { id: 'selected-dog' };
  } }, consultation: { create: async ({ data }) => {
    assert.deepEqual(data.dog, { connect: { id: 'selected-dog' } });
    assert.equal(data.outcome, 'Reward calm greetings');
    return { id: 'new-consultation' };
  } } });
  assert.equal((await post(request({ dogId: 'selected-dog', outcome: 'Reward calm greetings' }))).status, 201);
});
