const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const category = require('../lib/training-library.ts').categories[0];
const selected = [{ category: category.title, exercise: category.exercises[0] }];
function load(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(require.resolve(file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {}; new Function('require', 'exports', code)(id => id in imports ? imports[id] : require(id), exports); return exports.default;
}
test('customer course instructions contain the shared library guidance and Norwegian translation', () => {
  const component = load('../components/CourseLibraryExercises.tsx');
  const html = renderToStaticMarkup(component({ exercises: selected }));
  for (const text of [category.title, selected[0].exercise.title, selected[0].exercise.steps[0], selected[0].exercise.progress, selected[0].exercise.avoid]) assert.ok(html.includes(text));
  const nb = renderToStaticMarkup(component({ exercises: [{ ...selected[0], exercise: { ...selected[0].exercise, translations: { nb: { title: 'Norsk øvelse', steps: ['Norsk instruksjon'] } } } }], locale: 'nb' }));
  assert.ok(nb.includes('Norsk øvelse')); assert.ok(nb.includes('Norsk instruksjon'));
});
test('week picker adds an independent library copy, prevents duplicates, and removes without changing the bank', () => {
  const component = load('../components/CourseWeekLibraryPicker.tsx', { react: { useState: initial => [initial, () => {}] }, './CourseLibraryExercises': { default: 'Instructions' } });
  function nodes(tree) { return Array.isArray(tree) ? tree.flatMap(nodes) : tree && typeof tree === 'object' ? [tree, ...nodes(tree.props?.children)] : []; }
  let changed; const props = { categories: [category], selected: [], loading: false, error: '', onChange: value => { changed = value; } };
  let tree = nodes(component(props)); tree.find(node => node.type === 'button' && node.props.children === 'Add exercise').props.onClick();
  assert.deepEqual(changed, selected); assert.notEqual(changed[0].exercise, category.exercises[0]);
  tree = nodes(component({ ...props, selected: changed })); assert.equal(tree.find(node => node.type === 'button' && node.props.children === 'Added to this week').props.disabled, true);
  tree.find(node => node.type === 'button' && Array.isArray(node.props.children) && node.props.children[0] === 'Remove ').props.onClick(); assert.deepEqual(changed, []); assert.equal(category.exercises[0].title, selected[0].exercise.title);
});
