const test = require('node:test');
const assert = require('node:assert/strict');
const { parseTrainingEntry } = require('../lib/training-diary.ts');
const entry = { dogId: 'dog-1', day: '2026-11-07', exerciseName: ' Recall ', minutes: 5, result: '', completed: false };

test('scheduled and completed exercises can be saved without review notes', () => {
  assert.equal(parseTrainingEntry(entry).exerciseName, 'Recall');
  assert.equal(parseTrainingEntry({ ...entry, completed: true }).completed, true);
  assert.equal(parseTrainingEntry({ ...entry, completed: true, result: ' Returned on cue ' }).result, 'Returned on cue');
});
test('invalid calendar dates, durations, and malformed fields are rejected', () => {
  for (const patch of [{ day: '2026-02-30' }, { day: 'bad' }, { minutes: 0 }, { minutes: 1441 }, { minutes: 1.5 }, { minutes: '5' }, { exerciseName: ' ' }, { completed: 'true' }, { result: 'x'.repeat(5001) }, { category: {} }, { dogId: '' }]) {
    assert.equal(parseTrainingEntry({ ...entry, ...patch }), null, JSON.stringify(patch));
  }
  assert.equal(parseTrainingEntry(null), null);
});

test('repetitions accept positive whole numbers only', () => {
  assert.equal(parseTrainingEntry({ ...entry, repetitions: 7 }).repetitions, 7);
  assert.equal(parseTrainingEntry(entry).repetitions, null);
  for (const repetitions of [0, -1, 1.5, '7', 10001]) assert.equal(parseTrainingEntry({ ...entry, repetitions }), null);
});

test('daily schedules include the start date and cross month and year boundaries', () => {
  const { trainingScheduleDays } = require('../lib/training-diary.ts');
  assert.deepEqual(trainingScheduleDays('2026-12-29', 7), ['2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03', '2027-01-04']);
  assert.deepEqual(trainingScheduleDays('2028-02-28', 3), ['2028-02-28', '2028-02-29', '2028-03-01']);
  for (const count of [0, 91, 1.5, '7']) assert.equal(trainingScheduleDays('2026-11-07', count), null);
  assert.equal(trainingScheduleDays('2026-02-30', 7), null);
});
