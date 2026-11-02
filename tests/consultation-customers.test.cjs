const test = require('node:test');
const assert = require('node:assert/strict');
const { consultationCustomerKey, consultationCustomerOptions } = require('../lib/consultation-customers.ts');
const dog = (id, customerId, name = 'Alex') => ({ id, name: `Dog ${id}`, breed: 'Mixed breed', owner: name, customerId, customer: customerId ? { name, email: `${customerId}@example.test` } : null });

test('customer selection groups one account’s dogs, keeping different accounts with matching names separate', () => {
  const dogs = [dog('a', 'one'), dog('b', 'one'), dog('c', 'two')];
  const options = consultationCustomerOptions(dogs);
  assert.equal(options.length, 2);
  assert.equal(consultationCustomerKey(dogs[0]), consultationCustomerKey(dogs[1]));
  assert.notEqual(consultationCustomerKey(dogs[0]), consultationCustomerKey(dogs[2]));
  assert.ok(options.some(option => option.label.includes('one@example.test')));
  assert.deepEqual(dogs.filter(d => consultationCustomerKey(d) === options.find(o => o.label.includes('one@example.test')).key).map(d => d.id), ['a', 'b']);
});

test('unlinked owners with the same name are not mistaken for a connected customer', () => {
  const dogs = [dog('a', null), dog('b', null), dog('c', 'one')];
  const options = consultationCustomerOptions(dogs);
  assert.equal(options.length, 3);
  assert.notEqual(consultationCustomerKey(dogs[0]), consultationCustomerKey(dogs[1]));
  assert.ok(options.filter(o => o.key.startsWith('dog:')).every(o => o.label.includes('owner account not connected')));
  assert.deepEqual(consultationCustomerOptions([]), []);
});
