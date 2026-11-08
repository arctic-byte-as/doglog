const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync(require.resolve('../lib/course-builder-weeks.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = {}; new Function('exports', code)(loaded); const { resizeCourseWeeks } = loaded;
test('generated weeks copy full library instructions independently and preserve existing edited weeks', () => {
  const weeks = [{ title: 'Introduction', focus: 'Attention', details: 'Reward check-ins', activities: ['Recall'], libraryExercises: [{ category: 'Foundations', exercise: { title: 'Name response', steps: ['Say name', 'Reward'] } }] }, { title: 'Week 2 custom', focus: 'Different focus', details: '', activities: [] }];
  const result = resizeCourseWeeks(weeks, 4);
  assert.deepEqual(result[1], weeks[1]); assert.equal(result[2].title, 'Week 3'); assert.equal(result[3].focus, 'Attention');
  result[2].activities.push('Mat work'); result[2].libraryExercises[0].exercise.steps[0] = 'Edited';
  assert.deepEqual(weeks[0].activities, ['Recall']); assert.equal(result[3].libraryExercises[0].exercise.steps[0], 'Say name'); assert.equal(weeks[0].libraryExercises[0].exercise.steps[0], 'Say name');
  for (const count of [0, 53, 1.5, NaN]) assert.equal(resizeCourseWeeks(weeks, count), null);
});
