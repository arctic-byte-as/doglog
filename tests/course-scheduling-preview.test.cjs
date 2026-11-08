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

test('individually chosen course weeks and dates are valid without requiring weekly sequence', () => {
  const { validCoursePreviewSession } = require('../lib/course-scheduling-preview.ts');
  const weekThree = { id:'chosen-session', weekIndex:2, day:'2026-11-12', startTime:'17:30', endTime:'18:30' };
  assert.equal(validCoursePreviewSession(weekThree,6),true);
  assert.equal(validCoursePreviewSession({...weekThree, weekIndex:0, day:'2026-11-24'},6),true);
  for (const patch of [{weekIndex:-1},{weekIndex:6},{weekIndex:1.5},{day:''},{day:'2026-02-30'},{endTime:'17:00'}]) assert.equal(validCoursePreviewSession({...weekThree,...patch},6),false);
});

test('course cadence uses the chosen first date and preserves week content and times', () => {
  const { applyCourseCadence } = require('../lib/course-scheduling-preview.ts');
  const sessions = [0,1,2].map(index => ({ id:`week-${index}`, weekIndex:index+2, day:index ? '2026-11-10' : '2026-11-09', startTime:'18:00', endTime:'19:00' }));
  const weekly = applyCourseCadence(sessions,1);
  assert.deepEqual(weekly.map(item=>item.day), ['2026-11-09','2026-11-16','2026-11-23']);
  assert.deepEqual(weekly.map(item=>item.weekIndex), [2,3,4]);
  assert.ok(weekly.every(item=>item.startTime==='18:00' && item.endTime==='19:00'));
  assert.deepEqual(applyCourseCadence(sessions,2).map(item=>item.day), ['2026-11-09','2026-11-23','2026-12-07']);
  assert.deepEqual(applyCourseCadence(sessions,0), sessions);
  assert.equal(applyCourseCadence(sessions,3), null);
  assert.equal(applyCourseCadence([],1), null);
  assert.equal(applyCourseCadence([{...sessions[0],day:''}],1), null);
});

function schedulingForm() {
  const state = []; let cursor = 0;
  const react = { useState(initial) { const i = cursor++; if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial; return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }]; }, useRef: () => ({ current:null }), useEffect: () => {} };
  const compiled = ts.transpileModule(fs.readFileSync(require.resolve('../components/CourseSchedulingPreview.tsx'),'utf8'), { compilerOptions:{ module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require','exports',compiled)(id => {
    if(id==='react') return react;
    if(id==='react/jsx-runtime') return require(id);
    if(id==='@/lib/courses') return require('../lib/courses.ts');
    if(id==='@/lib/course-scheduling-preview') return require('../lib/course-scheduling-preview.ts');
    if(id.startsWith('@/components/')) return { default:id.split('/').at(-1) };
    throw Error(id);
  },exports);
  function nodes(tree) { return Array.isArray(tree) ? tree.flatMap(nodes) : tree && typeof tree==='object' ? [tree,...nodes(tree.props?.children)] : []; }
  return () => { cursor=0; return nodes(exports.default({dogs:[],trainingEntries:[],today:'2026-11-08'})); };
}
test('choosing the first date automatically fills remaining weeks without pressing Generate', () => {
  const render=schedulingForm();
  let nodes=render();
  nodes.find(node=>node.type==='input' && node.props.type==='date').props.onChange({target:{value:'2026-11-09'}});
  nodes=render();
  assert.deepEqual(nodes.filter(node=>node.type==='input' && node.props.type==='date').map(node=>node.props.value),['2026-11-09','2026-11-16','2026-11-23','2026-11-30','2026-12-07','2026-12-14']);
  const cadence=nodes.find(node=>node.type==='select' && node.props.value===1);
  cadence.props.onChange({target:{value:'2'}});
  nodes=render();
  assert.deepEqual(nodes.filter(node=>node.type==='input' && node.props.type==='date').map(node=>node.props.value),['2026-11-09','2026-11-23','2026-12-07','2026-12-21','2027-01-04','2027-01-18']);
});
test('individual-date mode does not generate unwanted course sessions', () => {
  const render=schedulingForm();let nodes=render();
  nodes.find(node=>node.type==='select' && node.props.value===1).props.onChange({target:{value:'0'}});
  nodes=render();nodes.find(node=>node.type==='input' && node.props.type==='date').props.onChange({target:{value:'2026-11-09'}});
  nodes=render();assert.equal(nodes.filter(node=>node.type==='input' && node.props.type==='date').length,1);
});

test('All courses combines both course groups and calendars and opens the right group editor', () => {
  const render=schedulingForm();
  function createGroup(courseId,name,date) {
    let nodes=render();
    nodes.find(node=>node.type==='select' && ['puppy','skills','all'].includes(node.props.value)).props.onChange({target:{value:courseId}});
    nodes=render();nodes.find(node=>node.type==='input' && node.props.maxLength===150).props.onChange({target:{value:name}});
    nodes.find(node=>node.type==='input' && node.props.type==='date').props.onChange({target:{value:date}});
    nodes=render();nodes.find(node=>node.type==='form').props.onSubmit({preventDefault(){}});
  }
  createGroup('puppy','Puppy group','2026-11-09');
  createGroup('skills','Skills group','2026-11-10');
  let nodes=render();
  const selector=nodes.find(node=>node.type==='select' && node.props.value==='skills');
  selector.props.onChange({target:{value:'all'}});
  nodes=render();
  assert.equal(nodes.find(node=>node.type==='TrainingDiaryCalendar').props.courseEvents.length,12);
  assert.ok(nodes.some(node=>node.type==='h3' && node.props.children==='Puppy group'));
  assert.ok(nodes.some(node=>node.type==='h3' && node.props.children==='Skills group'));
  assert.equal(nodes.some(node=>node.type==='form'),false);
  const edit=nodes.find(node=>node.type==='button' && node.props.children==='Edit group / participants');
  edit.props.onClick();nodes=render();
  assert.equal(nodes.find(node=>node.type==='select' && node.props.value==='puppy').props.value,'puppy');
  assert.equal(nodes.find(node=>node.type==='input' && node.props.maxLength===150).props.value,'Puppy group');
});
test('All courses content view exposes both curricula without choosing one silently', () => {
  const render=schedulingForm();let nodes=render();
  nodes.find(node=>node.type==='select' && node.props.value==='puppy').props.onChange({target:{value:'all'}});
  nodes=render();nodes.find(node=>node.type==='button' && node.props.children==='Course content').props.onClick();
  nodes=render();
  assert.ok(nodes.some(node=>node.type==='h2' && node.props.children==='Puppy Course'));
  assert.ok(nodes.some(node=>node.type==='h2' && node.props.children==='Skills Course'));
  assert.equal(nodes.some(node=>node.type==='CoursesClient'),false);
});
