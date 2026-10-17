const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
function load(name, imports = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(require.resolve(`../lib/${name}.ts`), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(source, { exports, URL, require: (id) => imports[id] });
  return exports;
}
const youtube = load('youtube');
const { parseRecommendedVideos } = load('recommended-videos', { './youtube': youtube });
const video = { id: 'one', subject: ' Recall ', title: ' Come back ', youtubeUrl: 'https://youtu.be/VuyjjkSPRfU', notes: ' Start indoors. ' };
test('normalizes a video without losing the subject or coaching note', () => {
  const [saved] = parseRecommendedVideos([video]);
  assert.equal(saved.youtubeUrl, 'https://www.youtube.com/watch?v=VuyjjkSPRfU');
  assert.equal(saved.subject, 'Recall');
  assert.equal(saved.notes, 'Start indoors.');
  assert.equal(parseRecommendedVideos([]).length, 0);
});
test('rejects malformed collections, duplicate ids and unsafe or invalid URLs', () => {
  for (const value of [null, {}, [null], [video, video], Array(31).fill(video), [{ ...video, subject: '' }], [{ ...video, title: 'a'.repeat(161) }], [{ ...video, youtubeUrl: 'https://youtube.com.evil.test/watch?v=VuyjjkSPRfU' }], [{ ...video, youtubeUrl: 'javascript:alert(1)' }], [{ ...video, youtubeUrl: 'https://www.youtube.com/playlist?list=anything' }]]) assert.equal(parseRecommendedVideos(value), null);
});
test('accepts watch, short and embed URLs only with a valid video id', () => {
  for (const url of ['https://www.youtube.com/watch?v=VuyjjkSPRfU', 'https://youtube.com/shorts/VuyjjkSPRfU', 'https://music.youtube.com/watch?v=VuyjjkSPRfU', 'www.youtu.be/VuyjjkSPRfU', 'https://www.youtube.com/watch/?v=VuyjjkSPRfU', 'https://www.youtube-nocookie.com/embed/VuyjjkSPRfU']) assert.equal(youtube.youtubeId(url), 'VuyjjkSPRfU');
  assert.equal(youtube.youtubeId('https://youtu.be/not-valid'), null);
});

const { withDefaultVideoLinks } = load('skills-library-defaults');
test('restores missing Play links in old saved content without replacing custom links or lessons', () => {
  const source = [{ title: 'Play', summary: 'Custom summary', subcategories: [
    { title: 'Toy engagement', youtubeUrl: '', notes: 'Keep this text' },
    { title: 'Tug with rules', youtubeUrl: 'https://youtu.be/VuyjjkSPRfU' },
    { title: 'Custom lesson', youtubeUrl: '' },
  ] }];
  const result = withDefaultVideoLinks(source);
  assert.equal(result[0].subcategories[0].youtubeUrl, 'https://www.youtube.com/watch?v=UyVkZrlcVSA');
  assert.equal(result[0].subcategories[0].notes, 'Keep this text');
  assert.equal(result[0].subcategories[1].youtubeUrl, 'https://youtu.be/VuyjjkSPRfU');
  assert.equal(result[0].subcategories[2].youtubeUrl, '');
  assert.equal(source[0].subcategories[0].youtubeUrl, '');
  const blankTug = withDefaultVideoLinks([{ title: 'Play', subcategories: [{ title: 'Tug with rules', youtubeUrl: '' }] }]);
  assert.equal(blankTug[0].subcategories[0].youtubeUrl, 'https://www.youtube.com/watch?v=Cv4seQbdVfY');
});
