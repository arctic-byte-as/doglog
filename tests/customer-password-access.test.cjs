const test = require('node:test');
const assert = require('node:assert/strict');
const { canResetCustomerPassword } = require('../lib/customer-password-access.ts');

test('only ordinary customer logins can be managed', () => {
  assert.equal(canResetCustomerPassword('owner@example.test', 'CUSTOMER', false, ''), true);
  for (const role of ['ADMIN', 'TRAINER', 'unknown']) assert.equal(canResetCustomerPassword('owner@example.test', role, false, ''), false);
});

test('a customer role does not override trainer or configured administrator access', () => {
  assert.equal(canResetCustomerPassword('owner@example.test', 'CUSTOMER', true, ''), false);
  assert.equal(canResetCustomerPassword('Owner@Example.Test', 'CUSTOMER', false, ' other@example.test, owner@example.test '), false);
});
