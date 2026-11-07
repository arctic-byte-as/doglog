const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function renderMenu() {
  const events = [], effects = [];
  const dialog = { open: false, showModal() { this.open = true; events.push('show'); }, close() { this.open = false; events.push('close'); } };
  const trigger = { focus() { events.push('focus'); } };
  let ref = 0;
  const hooks = { useState: () => [true, (value) => events.push(`state:${value}`)], useId: () => 'test-menu', useRef: () => ({ current: ref++ === 0 ? dialog : trigger }), useEffect: (effect) => effects.push(effect) };
  const compiled = ts.transpileModule(fs.readFileSync(require.resolve('../components/MobileNavigation.tsx'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((id) => {
    if (id === 'react') return hooks;
    if (id === 'react/jsx-runtime') return require(id);
    if (id === 'next/navigation') return { usePathname: () => '/customer/diary' };
    if (id === 'next/link') return { default: 'Link' };
    if (id === './SignOutMenuButton') return { default: 'SignOut' };
    throw Error(id);
  }, exports);
  const tree = exports.default({ items: [{ href: '/customer', label: 'Home' }, { href: '/customer/diary', label: 'Diary' }] });
  function nodes(value) { return Array.isArray(value) ? value.flatMap(nodes) : value && typeof value === 'object' ? [value, ...nodes(value.props?.children)] : []; }
  return { events, effects, dialog, nodes: nodes(tree) };
}
test('Home click closes the native modal before starting route navigation', () => {
  const menu = renderMenu();
  const home = menu.nodes.find(node => node.type === 'Link' && node.props.href === '/customer');
  menu.dialog.open = true;
  home.props.onClick();
  assert.deepEqual(menu.events, ['close', 'state:false']);
  assert.equal(menu.dialog.open, false);
});
test('opening the phone menu does not automatically prefetch every route', () => {
  const menu = renderMenu();
  const links = menu.nodes.filter(node => node.type === 'Link');
  assert.equal(links.length, 2);
  assert.ok(links.every(link => link.props.prefetch === false));
});
test('menu cleanup releases scrolling and restores focus', (t) => {
  const previousDocument = global.document, previousWindow = global.window;
  global.document = { body: { style: { overflow: 'auto' } } };
  global.window = { addEventListener() {}, removeEventListener() {} };
  t.after(() => { global.document = previousDocument; global.window = previousWindow; });
  const menu = renderMenu();
  const cleanup = menu.effects[1]();
  assert.equal(menu.dialog.open, true);
  assert.equal(global.document.body.style.overflow, 'hidden');
  cleanup();
  assert.equal(menu.dialog.open, false);
  assert.equal(global.document.body.style.overflow, 'auto');
  assert.ok(menu.events.includes('focus'));
});
