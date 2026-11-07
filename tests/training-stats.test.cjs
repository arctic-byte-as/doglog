const test = require('node:test');
const assert = require('node:assert/strict');
const { summarizeTraining } = require('../lib/training-stats.ts');
test('stats distinguish pending and future exercises and count training days once', () => {
  const base = { dogId: 'dog', exerciseName: 'Recall', minutes: 5 };
  const stats = summarizeTraining([
    { ...base, day: '2026-11-06', completed: true },
    { ...base, day: '2026-11-06', completed: true },
    { ...base, day: '2026-11-07', completed: false },
    { ...base, day: '2026-11-08', completed: false },
  ], '2026-11-07');
  assert.deepEqual(stats, { total: 4, completed: 2, upcoming: 1, pending: 1, percent: 50, minutes: 10, activeDays: 1 });
});
test('empty stats have a zero completion percentage', () => {
  assert.equal(summarizeTraining([], '2026-11-07').percent, 0);
});

test('encouragement uses past scheduled days only and switches at the intended boundaries', () => {
  const { trainingEncouragement } = require('../lib/training-stats.ts');
  const make = (done) => Array.from({ length: 10 }, (_, i) => ({ dogId: 'dog', day: '2026-11-06', exerciseName: 'Recall', minutes: 5, completed: i < done }));
  assert.equal(trainingEncouragement(make(8), '2026-11-07').status, 'on-track');
  assert.equal(trainingEncouragement(make(7), '2026-11-07').status, 'gentle-nudge');
  assert.equal(trainingEncouragement(make(5), '2026-11-07').status, 'gentle-nudge');
  assert.equal(trainingEncouragement(make(4), '2026-11-07').status, 'restart');
  const later = make(0).map((entry, i) => ({ ...entry, day: i ? '2026-11-08' : '2026-11-07' }));
  assert.equal(trainingEncouragement(later, '2026-11-07').status, 'starting');
  assert.equal(trainingEncouragement([...make(8), ...later], '2026-11-07').status, 'on-track');
  assert.equal(trainingEncouragement([], '2026-11-07').status, 'empty');
  assert.match(trainingEncouragement(make(8), '2026-11-07', 'nb').title, /fantastisk/);
});
