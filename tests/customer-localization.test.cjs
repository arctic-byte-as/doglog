const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const result = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'exports', output)((name) => name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : require(name), result.exports);
  return result.exports;
}
const { localizeBreedGuidance } = load(require.resolve('../lib/localize-breed-guidance.ts'));
const { defaultBreedGuidance } = load(require.resolve('../lib/breed-guidance.ts'));
const { defaultDogBreeds } = require('../lib/dog-breeds.ts');
const { translateTrainingText } = load(require.resolve('../lib/training-text-nb.ts'));
const { behaviourGuides } = require('../lib/behaviour-challenges.ts');
const { activationOptions, formatActivationOption } = require('../lib/activation-options.ts');
const { categories, formatTrainingExercise } = require('../lib/training-library.ts');

test('all built-in breed fields have Bokmål versions and manual fields remain unchanged', () => {
  for (const breed of defaultDogBreeds) {
    const profile = defaultBreedGuidance(breed);
    const nb = localizeBreedGuidance(profile, 'nb');
    for (const key of ['purpose', 'traits', 'activation', 'temperament']) assert.notEqual(nb[key], profile[key], `${breed}: ${key}`);
    assert.deepEqual(localizeBreedGuidance(profile, 'en'), profile);
    assert.equal(nb.breed, profile.breed);
    assert.deepEqual(nb.sources, profile.sources);
  }
  const custom = { ...defaultBreedGuidance('Labrador Retriever'), traits: 'Personal note: Luna prefers quiet rooms.', temperament: '' };
  assert.equal(localizeBreedGuidance(custom, 'nb').traits, custom.traits);
  assert.equal(localizeBreedGuidance(custom, 'nb').temperament, '');
});
test('all built-in behaviour and activation instructions translate without rewriting custom prose', () => {
  for (const guide of Object.values(behaviourGuides)) {
    const nb = translateTrainingText(guide);
    assert.notEqual(nb, guide);
    assert.ok(!nb.includes('How to start'));
    assert.ok(!nb.includes('Expected outcome'));
  }
  for (const activity of activationOptions) {
    assert.notEqual(translateTrainingText(formatActivationOption(activity)), formatActivationOption(activity));
    for (const line of activity.steps) assert.notEqual(translateTrainingText(line), line);
  }
  const manual = 'Luna is worried by the blue delivery van. Use the side entrance.';
  assert.equal(translateTrainingText(manual), manual);
});
test('every default library exercise has translated instructions', () => {
  for (const category of categories) for (const exercise of category.exercises) {
    const translated = translateTrainingText(formatTrainingExercise(category.title, exercise));
    assert.notEqual(translated, formatTrainingExercise(category.title, exercise));
    for (const text of [exercise.goal, ...exercise.setup, ...exercise.steps, exercise.progress, exercise.avoid]) {
      assert.notEqual(translateTrainingText(text), text, `${exercise.title}: ${text}`);
    }
  }
});

test('mixed breed generated fields translate while personalised fields stay unchanged', () => {
  const mix = defaultBreedGuidance('Mixed breed: Labrador Retriever + Border Collie');
  const translated = localizeBreedGuidance(mix, 'nb');
  assert.notEqual(translated.purpose, mix.purpose);
  assert.ok(translated.purpose.includes('Labrador Retriever:'));
  const edited = { ...mix, traits: 'Individual notes.', temperament: '' };
  assert.equal(localizeBreedGuidance(edited, 'nb').traits, edited.traits);
  assert.equal(localizeBreedGuidance(edited, 'nb').temperament, '');
});
