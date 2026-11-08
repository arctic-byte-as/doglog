const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const { coursePreviewDays, validCourseTimeRange, courseSessionOverlaps } = require('../lib/course-scheduling-preview.ts');

test('weekly course dates cross months, leap days and daylight-saving dates without shifting weekdays', () => {
  assert.deepEqual(coursePreviewDays('2026-12-25', 3), ['2026-12-25','2027-01-01','2027-01-08']);
  assert.deepEqual(coursePreviewDays('2028-02-22', 3), ['2028-02-22','2028-02-29','2028-03-07']);
  assert.deepEqual(coursePreviewDays('2026-10-18', 3), ['2026-10-18','2026-10-25','2026-11-01']);
  for (const args of [['2026-02-30',6],['bad',6],['2026-11-08',0],['2026-11-08',53],['2026-11-08',1.5]]) assert.equal(coursePreviewDays(...args), null);
});
test('course sessions require valid same-day start and end times', () => {
  assert.equal(validCourseTimeRange('18:00','19:00'), true);
  for (const times of [['19:00','18:00'],['18:00','18:00'],['24:00','25:00'],['9:00','10:00'],['18:99','19:00']]) assert.equal(validCourseTimeRange(...times), false);
});
test('overlapping sessions are flagged while adjacent sessions remain valid', () => {
  const session = { day: '2026-11-08', startTime: '18:00', endTime: '19:00' };
  assert.equal(courseSessionOverlaps(session, { ...session, startTime: '18:30', endTime: '19:30' }), true);
  assert.equal(courseSessionOverlaps(session, { ...session, startTime: '19:00', endTime: '20:00' }), false);
  assert.equal(courseSessionOverlaps(session, { ...session, day: '2026-11-09' }), false);
});
function calendar(props) {
  const source = fs.readFileSync(require.resolve('../components/TrainingDiaryCalendar.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require','exports',compiled)(require,exports);
  return renderToStaticMarkup(exports.default(props));
}
test('shared calendar distinguishes timed course sessions from exercise completion', () => {
  const html = calendar({ entries: [{ day:'2026-11-08', exerciseName:'Recall', minutes:3, repetitions:7, completed:true }], courseEvents:[{ id:'lesson', day:'2026-11-08', title:'Puppy Course · Week 1', startTime:'18:00', endTime:'19:00' }], day:'2026-11-08', onSelect:()=>{}, locale:'en' });
  assert.ok(html.includes('1 completed, 0 scheduled, 1 course sessions'));
  assert.ok(html.includes('18:00–19:00'));
  assert.ok(html.includes('Puppy Course · Week 1'));
  assert.ok(html.includes('Blue: course session'));
  assert.ok(html.includes('Recall'));
});
test('existing diary calendar still works without any course sessions', () => {
  const html = calendar({ entries:[], day:'2026-11-08', onSelect:()=>{}, locale:'en' });
  assert.ok(html.includes('Training calendar'));
  assert.equal(html.includes('Blue: course session'), false);
});
