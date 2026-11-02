const test = require('node:test');
const assert = require('node:assert/strict');
const { activationOptions, formatActivationOption } = require('../lib/activation-options.ts');
const { behaviourChallenges, behaviourGuides, behaviourGuideSources, appendPlanText } = require('../lib/behaviour-challenges.ts');
const { splitTrainingPlan } = require('../lib/training-plan-blocks.ts');

test('adding activities and guides preserves existing notes and creates separate blocks', () => {
  const original = 'Existing notes\nKeep this wording---including inline punctuation.';
  const activity = formatActivationOption(activationOptions.find((item) => item.label === 'Sniff walk'));
  const guide = behaviourGuides[behaviourChallenges[5]];
  const saved = appendPlanText(appendPlanText(original, activity), guide);
  assert.deepEqual(splitTrainingPlan(saved), [original, activity, guide]);
  assert.deepEqual(splitTrainingPlan(saved.replace(/\n/g, '\r\n')), [original.replace(/\n/g, '\r\n'), activity.replace(/\n/g, '\r\n'), guide.replace(/\n/g, '\r\n')]);
  assert.deepEqual(splitTrainingPlan('\n---\n\n---\n'), []);
});

test('all ten challenges have a complete starting guide and source links', () => {
  assert.equal(behaviourChallenges.length, 10);
  for (const challenge of behaviourChallenges) {
    const guide = behaviourGuides[challenge];
    for (const heading of ['Starting plan:', 'How to start', 'Steps', 'Session length', 'How often', 'How long it takes', 'Expected outcome']) assert.ok(guide.includes(heading), `${challenge}: ${heading}`);
    assert.ok(behaviourGuideSources[challenge].length);
    assert.ok(behaviourGuideSources[challenge].every((source) => source.url.startsWith('https://')));
  }
});

test('every activation activity includes practical steps and timing in the saved plan', () => {
  assert.equal(activationOptions.length, 13);
  for (const activity of activationOptions) {
    const text = formatActivationOption(activity);
    assert.ok(text.startsWith(`Activity: ${activity.label}\n`));
    assert.ok(activity.steps.length >= 3);
    for (const step of activity.steps) assert.ok(text.includes(step));
    assert.ok(text.includes(activity.timing));
    assert.ok(text.includes(activity.outcome));
  }
});

const fs = require('node:fs');
const ts = require('typescript');
const agreementModule = { exports: {} };
const agreementSource = fs.readFileSync(require.resolve('../lib/training-agreement.ts'), 'utf8').replace("'./training-plan-blocks'", "'../lib/training-plan-blocks.ts'");
new Function('require', 'exports', ts.transpileModule(agreementSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText)(require, agreementModule.exports);
const { updateAgreement, agreementValue, seedAgreement, groupTrainingPlan } = agreementModule.exports;

test('personalised agreements preserve plans and separate supporting activities', () => {
  const original = appendPlanText('Existing plan text', 'Activity: Sniff walk\n\nKeep this activity.');
  let plan = seedAgreement(original, 'Luna jumps at the door.', 'Four paws on the floor.');
  plan = updateAgreement(plan, 'Agreed problem', 'Luna jumps when visitors enter.');
  assert.equal(agreementValue(plan, 'Our goal'), 'Four paws on the floor.');
  assert.equal(agreementValue(plan, 'Agreed problem'), 'Luna jumps when visitors enter.');
  assert.equal(seedAgreement(plan, 'Other problem', 'Other goal'), plan);
  const groups = groupTrainingPlan(plan);
  assert.deepEqual(groups.training, ['Existing plan text']);
  assert.deepEqual(groups.activities, ['Activity: Sniff walk\n\nKeep this activity.']);
  const cleared = updateAgreement(plan, 'Our goal', '');
  assert.equal(agreementValue(cleared, 'Our goal'), '');
  assert.deepEqual(groupTrainingPlan(cleared).activities, groups.activities);
});

const developmentModule = { exports: {} };
const developmentSource = fs.readFileSync(require.resolve('../lib/dog-development.ts'), 'utf8').replace("'./training-plan-blocks'", "'../lib/training-plan-blocks.ts'");
new Function('require', 'exports', ts.transpileModule(developmentSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText)(require, developmentModule.exports);
const { developmentNote, readDevelopment, writeDevelopment } = developmentModule.exports;
test('development snapshot preserves age, individual notes and existing training', () => {
  const base = 'Starting plan: Recall\n\nExisting steps';
  const note = developmentNote('15', 'Male', 'Intact');
  assert.ok(note.includes('adolescence'));
  assert.ok(note.includes('does not establish the cause'));
  assert.equal(developmentNote('', 'Male', 'Intact'), '');
  assert.ok(developmentNote('0', '', '').includes('puppy'));
  assert.ok(developmentNote('24', '', '').includes('Age alone'));
  assert.ok(developmentNote('360', '', '').includes('later-life'));
  const data = { months: '15', sex: 'Male', status: 'Intact', note: 'Trainer personalised note.' };
  const plan = writeDevelopment(base, data);
  assert.deepEqual(readDevelopment(plan), data);
  assert.deepEqual(groupTrainingPlan(plan).training, [base]);
  assert.deepEqual(groupTrainingPlan(plan).activities, []);
});

function loadGuidanceModule(file) {
  const path = require('node:path');
  const moduleResult = { exports: {} };
  const source = fs.readFileSync(file, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'exports', output)((name) => name.startsWith('.') ? loadGuidanceModule(path.resolve(path.dirname(file), name + '.ts')) : require(name), moduleResult.exports);
  return moduleResult.exports;
}
const { defaultBreedGuidance, readBreedGuidance, writeBreedGuidance, ensureBreedGuidance } = loadGuidanceModule(require.resolve('../lib/breed-guidance.ts'));
const { defaultDogBreeds } = require('../lib/dog-breeds.ts');
test('every bundled breed has sourced guidance and unknown names have an honest editable fallback', () => {
  for (const breed of defaultDogBreeds) {
    const profile = defaultBreedGuidance(breed);
    assert.ok(profile.sources.length, breed);
    for (const field of ['purpose', 'traits', 'activation', 'temperament']) assert.ok(profile[field].trim(), `${breed}: ${field}`);
  }
  assert.equal(defaultBreedGuidance('constructor').sources.length, 0);
  assert.equal(defaultBreedGuidance('Unknown mix').sources.length, 0);
});
test('manual breed guidance survives saving and changing breeds without replacing training', () => {
  const base = 'Starting plan: Recall\n\nKeep these instructions.';
  const profile = { ...defaultBreedGuidance('Labrador Retriever'), traits: 'This dog prefers quiet searches.', temperament: '' };
  const plan = writeBreedGuidance(base, profile);
  assert.deepEqual(readBreedGuidance(plan), profile);
  assert.equal(ensureBreedGuidance(plan, 'Border Collie'), plan);
  assert.deepEqual(groupTrainingPlan(plan).training, [base]);
  assert.deepEqual(groupTrainingPlan(plan).activities, []);
});

test('switching dogs replaces breed guidance while preserving the rest of the plan and per-dog custom notes', () => {
  const base = 'Starting plan: Recall\n\nKeep instructions.';
  const first = { ...defaultBreedGuidance('Labrador Retriever'), traits: 'Personalised for the first dog.' };
  const original = writeBreedGuidance(base, first);
  const switched = writeBreedGuidance(original, defaultBreedGuidance('Border Collie'));
  assert.equal(readBreedGuidance(switched).breed, 'Border Collie');
  assert.notEqual(readBreedGuidance(switched).traits, first.traits);
  assert.deepEqual(groupTrainingPlan(switched).training, [base]);
  const restored = writeBreedGuidance(switched, first);
  assert.equal(readBreedGuidance(restored).traits, first.traits);
  assert.equal(readBreedGuidance(restored).breed, 'Labrador Retriever');
});

test('changing the breed refreshes guidance and restores personalised notes when switching back', () => {
  const { changeGuidanceBreed } = loadGuidanceModule(require.resolve('../lib/breed-guidance.ts'));
  const cache = {};
  const first = { ...defaultBreedGuidance('Labrador Retriever'), traits: 'Personalised Labrador note.' };
  const start = writeBreedGuidance('Keep these exercises.', first);
  const changed = changeGuidanceBreed(start, 'Border Collie', cache);
  assert.equal(readBreedGuidance(changed).breed, 'Border Collie');
  assert.equal(readBreedGuidance(changeGuidanceBreed(changed, 'Labrador Retriever', cache)).traits, first.traits);
  assert.deepEqual(groupTrainingPlan(changed).training, ['Keep these exercises.']);
});

test('mixed breed guidance combines selected parents with editable final wording', () => {
  const mix = defaultBreedGuidance('Mixed breed: Labrador Retriever + Border Collie + labrador retriever');
  assert.ok(mix.purpose.includes('Labrador Retriever:'));
  assert.ok(mix.purpose.includes('Border Collie:'));
  assert.equal(mix.sources.length, 2);
  const final = { ...mix, traits: 'This dog prefers quiet searches.', temperament: '' };
  const saved = writeBreedGuidance('Keep these exercises.', final);
  assert.deepEqual(readBreedGuidance(saved), final);
  assert.equal(ensureBreedGuidance(saved, mix.breed), saved);
  assert.deepEqual(groupTrainingPlan(saved).training, ['Keep these exercises.']);
});

test('old generic mixed profiles refresh automatically without replacing personal fields', () => {
  const fallback = defaultBreedGuidance('');
  const stale = { ...fallback, breed: 'Mixed breed: Labrador Retriever + Border Collie', traits: 'Personal note about this dog.' };
  const saved = writeBreedGuidance('Existing plan.', stale);
  assert.equal(readBreedGuidance(saved).purpose, fallback.purpose);
  const refreshed = readBreedGuidance(ensureBreedGuidance(saved, stale.breed));
  assert.ok(refreshed.purpose.includes('Labrador Retriever:'));
  assert.ok(refreshed.purpose.includes('Border Collie:'));
  assert.equal(refreshed.traits, stale.traits);
  assert.equal(refreshed.sources.length, 2);
});
