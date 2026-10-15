const test = require('node:test');
const assert = require('node:assert/strict');
const { categories, normalizeTrainingLibrary, formatTrainingExercise, exerciseIsInPlan } = require('../lib/training-library.ts');

test('shared library accepts defaults, custom categories, and empty categories', () => {
  const library = [...categories, { title: 'Custom category', summary: 'Trainer content', exercises: [] }];
  assert.equal(normalizeTrainingLibrary(library).length, library.length);
});

test('malformed instructions and duplicate identities are rejected', () => {
  assert.equal(normalizeTrainingLibrary([{ ...categories[0], exercises: [{ ...categories[0].exercises[0], steps: 'invalid' }] }]), null);
  assert.equal(normalizeTrainingLibrary([categories[0], { ...categories[0], title: ' foundation skills ' }]), null);
  assert.equal(normalizeTrainingLibrary([{ ...categories[0], exercises: [categories[0].exercises[0], categories[0].exercises[0]] }]), null);
});

test('instruction formatting includes full exercise details and identifies saved plan entries', () => {
  const exercise = categories[0].exercises[0];
  const block = formatTrainingExercise(categories[0].title, exercise);
  assert.ok(block.includes('Goal: ' + exercise.goal));
  assert.ok(block.includes('1. ' + exercise.steps[0]));
  assert.ok(block.includes('Avoid: ' + exercise.avoid));
  assert.equal(exerciseIsInPlan('Personal trainer notes\n\n' + block, categories[0].title, exercise), true);
  assert.equal(exerciseIsInPlan(block, 'Another category', exercise), false);
});

test('valid translated instructions survive normalization; malformed translations do not', () => {
  const exercise = { ...categories[0].exercises[0], translations: { nb: { title: 'Test', steps: ['Steg'] } } };
  assert.deepEqual(normalizeTrainingLibrary([{ ...categories[0], exercises: [exercise] }])[0].exercises[0].translations, exercise.translations);
  assert.equal(normalizeTrainingLibrary([{ ...categories[0], exercises: [{ ...exercise, translations: { nb: { steps: 42 } } }] }])[0].exercises[0].translations, undefined);
});

test('browser import adds custom exercises without replacing shared instructions', () => {
  const { mergeTrainingLibraries } = require('../lib/training-library.ts');
  const shared = [{ ...categories[0], exercises: [{ ...categories[0].exercises[0], goal: 'Shared instructions' }] }];
  const browser = [{ ...categories[0], exercises: [categories[0].exercises[0], categories[0].exercises[1]] }];
  const merged = mergeTrainingLibraries(shared, browser);
  assert.equal(merged[0].exercises.length, 2);
  assert.equal(merged[0].exercises[0].goal, 'Shared instructions');
  assert.equal(shared[0].exercises.length, 1);
});
