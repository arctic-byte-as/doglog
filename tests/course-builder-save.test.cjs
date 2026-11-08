const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript');
function builder() {
  const slots = []; let cursor = 0, refreshed = 0;
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; }, useEffect() {},
  };
  const code = ts.transpileModule(fs.readFileSync(require.resolve('../components/CourseBuilderClient.tsx'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {}, imports = {
    react, 'react/jsx-runtime': require('react/jsx-runtime'), 'next/link': { default: 'Link' },
    'next/navigation': { useRouter: () => ({ refresh: () => { refreshed++; } }) },
    '@/lib/use-training-library': { useTrainingLibrary: () => ({ libraryCategories: [], loading: false, error: '' }) },
    './CourseWeekLibraryPicker': { default: 'Picker' }, '@/lib/course-templates': { courseServiceTypes: [{ key: 'OPEN_TRAINING', title: 'Open Training' }] },
  };
  new Function('require', 'exports', code)(id => { if (id in imports) return imports[id]; throw Error(id); }, exports);
  function nodes(tree) { return Array.isArray(tree) ? tree.flatMap(nodes) : tree && typeof tree === 'object' ? [tree, ...nodes(tree.props?.children)] : []; }
  return { render() { cursor = 0; return nodes(exports.default({ initialTemplates: [], builtins: [], usedIds: [], initialUpdatedAt: null })); }, refreshCount: () => refreshed };
}
function start(app) {
  app.render().find(node => node.type === 'button' && node.props.children === '+ Build a course').props.onClick();
  let tree = app.render();
  tree.find(node => node.type === 'input' && node.props.placeholder === 'Open Training · Small group foundations').props.onChange({ target: { value: 'Saturday Open Training' } });
  tree = app.render(); tree.find(node => node.type === 'input' && node.props.placeholder === 'Settling around other dogs').props.onChange({ target: { value: 'Calm greetings' } });
  return app.render();
}
const submit = tree => tree.find(node => node.type === 'form').props.onSubmit({ preventDefault() {}, nativeEvent: { submitter: { getAttribute: () => 'save' } } });
const settled = () => new Promise(resolve => setImmediate(resolve));
test('saving closes the editor, shows the new available course and refreshes service navigation', async () => {
  const app = builder(), original = global.fetch; let calls = 0, payload;
  global.fetch = async (_, options) => { calls++; payload = JSON.parse(options.body); return { ok: true, json: async () => ({ templates: [payload.template], updatedAt: '2026-11-08T12:00:00Z' }) }; };
  try {
    const tree = start(app); assert.ok(tree.some(node => node.props?.className?.includes('sticky')));
    submit(tree); submit(tree); await settled();
    const saved = app.render(); assert.equal(calls, 1); assert.equal(app.refreshCount(), 1);
    assert.equal(saved.some(node => node.type === 'form'), false);
    assert.ok(saved.some(node => node.type === 'h3' && node.props.children === 'Saturday Open Training'));
    assert.ok(saved.some(node => node.props?.role === 'status' && node.props.children.includes('saved and available')));
    const link = saved.find(node => node.type === 'Link'); assert.ok(link.props.href.includes(payload.template.id)); assert.equal(link.props.prefetch, false);
  } finally { global.fetch = original; }
});
test('failed saves retain the course draft and show an error without publishing an available course', async () => {
  const app = builder(), original = global.fetch;
  global.fetch = async () => ({ ok: false, json: async () => ({ error: 'The course list changed. Reload before saving.' }) });
  try {
    submit(start(app)); await settled(); const tree = app.render();
    assert.ok(tree.some(node => node.type === 'form')); assert.ok(tree.some(node => node.props?.role === 'alert' && node.props.children.includes('Reload')));
    assert.equal(tree.some(node => node.type === 'Link'), false); assert.equal(app.refreshCount(), 0);
    assert.equal(tree.find(node => node.type === 'input' && node.props.placeholder === 'Open Training · Small group foundations').props.value, 'Saturday Open Training');
  } finally { global.fetch = original; }
});
