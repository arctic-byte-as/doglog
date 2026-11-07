const test = require('node:test');
const assert = require('node:assert/strict');
const { findDiaryExercise } = require('../lib/diary-exercise.ts');
const { categories } = require('../lib/training-library.ts');
test('scheduled exercise resolves to the exact bank instructions', () => {
  const match = findDiaryExercise(categories, { exerciseName: ' name response ', category: 'Foundation Skills' });
  assert.equal(match.exercise.title, 'Name Response');
  assert.ok(match.exercise.steps.length);
});
test('Norwegian titles resolve and duplicate/custom names never open unrelated instructions', () => {
  const example = { ...categories[0].exercises[0], translations: { nb: { title: 'Norsk øvelse' } } };
  const library = [{ ...categories[0], exercises: [example] }, { ...categories[0], title: 'Other', exercises: [example] }];
  assert.equal(findDiaryExercise(library, { exerciseName: 'Norsk øvelse', category: 'Other' }).category.title, 'Other');
  assert.equal(findDiaryExercise(library, { exerciseName: example.title, category: null }), null);
  assert.equal(findDiaryExercise(categories, { exerciseName: 'Custom exercise', category: null }), null);
  assert.equal(findDiaryExercise(categories, { exerciseName: 'Name Response', category: 'Wrong category' }), null);
});
