const test = require('node:test');
const assert = require('node:assert/strict');
const { canDownloadConsultation } = require('../lib/consultation-pdf-access.ts');

const dog = { trainerId: 'trainer-one', customerId: 'customer-one' };

test('trainer downloads require ADMIN mode and assignment to that trainer', () => {
  assert.equal(canDownloadConsultation({ modes: ['ADMIN'], trainer: { id: 'trainer-one' } }, dog), true);
  assert.equal(canDownloadConsultation({ modes: ['ADMIN'], trainer: { id: 'trainer-two' } }, dog), false);
  assert.equal(canDownloadConsultation({ modes: ['ADMIN'] }, dog), false);
  for (const modes of [[], ['CUSTOMER'], ['TRAINER'], ['admin']]) {
    assert.equal(canDownloadConsultation({ modes, trainer: { id: 'trainer-one' } }, dog), false);
  }
});

test('customer downloads require CUSTOMER mode and ownership of that dog', () => {
  assert.equal(canDownloadConsultation({ modes: ['CUSTOMER'], customer: { id: 'customer-one' } }, dog), true);
  assert.equal(canDownloadConsultation({ modes: ['CUSTOMER'], customer: { id: 'customer-two' } }, dog), false);
  assert.equal(canDownloadConsultation({ modes: ['CUSTOMER'] }, dog), false);
  assert.equal(canDownloadConsultation({ modes: ['ADMIN'], customer: { id: 'customer-one' } }, dog), false);
});

test('dual-mode users may qualify through either identity but never a foreign assignment', () => {
  const user = { modes: ['ADMIN', 'CUSTOMER'], trainer: { id: 'trainer-one' }, customer: { id: 'customer-one' } };
  assert.equal(canDownloadConsultation(user, { trainerId: 'trainer-one', customerId: 'someone-else' }), true);
  assert.equal(canDownloadConsultation(user, { trainerId: 'someone-else', customerId: 'customer-one' }), true);
  assert.equal(canDownloadConsultation(user, { trainerId: 'someone-else', customerId: 'another-person' }), false);
  assert.equal(canDownloadConsultation({ ...user, modes: ['CUSTOMER'] }, { trainerId: 'trainer-one', customerId: 'another-person' }), false);
  assert.equal(canDownloadConsultation({ ...user, modes: ['ADMIN'] }, { trainerId: 'someone-else', customerId: 'customer-one' }), false);
});

test('missing, null or blank IDs cannot accidentally match', () => {
  for (const id of [undefined, null, '', '   ']) {
    assert.equal(canDownloadConsultation({ modes: ['ADMIN'], trainer: { id } }, { trainerId: id }), false);
    assert.equal(canDownloadConsultation({ modes: ['CUSTOMER'], customer: { id } }, { trainerId: 'trainer-one', customerId: id }), false);
  }
  assert.equal(canDownloadConsultation({ modes: ['ADMIN', 'CUSTOMER'], trainer: null, customer: null }, dog), false);
  assert.equal(canDownloadConsultation({ modes: ['CUSTOMER'], customer: { id: 'customer-one' } }, { trainerId: 'trainer-one' }), false);
});

test('missing callers, dogs or modes fail closed', () => {
  for (const user of [null, undefined, {}, { modes: null }, { modes: 'ADMIN', trainer: { id: 'trainer-one' } }]) {
    assert.equal(canDownloadConsultation(user, dog), false);
  }
  for (const missingDog of [null, undefined, {}]) {
    assert.equal(canDownloadConsultation({ modes: ['ADMIN', 'CUSTOMER'], trainer: { id: 'trainer-one' }, customer: { id: 'customer-one' } }, missingDog), false);
  }
});
