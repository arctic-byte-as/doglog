const test = require('node:test');
const assert = require('node:assert/strict');
const { cropGeometry } = require('../lib/photo-crop.ts');

test('portrait and landscape crops begin centered and square', () => {
  assert.deepEqual(cropGeometry(2400, 1200), { x: 600, y: 0, side: 1200 });
  assert.deepEqual(cropGeometry(1200, 2400), { x: 0, y: 600, side: 1200 });
});

test('zoom and dragging keep the crop inside every edge of the original', () => {
  for (const [width, height] of [[2400, 1200], [1200, 2400], [1200, 1200]]) {
    for (const zoom of [1, 1.5, 3]) for (const x of [-2, -1, 0, 1, 2]) for (const y of [-2, -1, 0, 1, 2]) {
      const crop = cropGeometry(width, height, zoom, x, y);
      assert(crop.x >= 0 && crop.y >= 0);
      assert(crop.x + crop.side <= width && crop.y + crop.side <= height);
    }
  }
});

test('dragging right reveals the left edge; dragging left reveals the right edge', () => {
  assert.deepEqual(cropGeometry(2400, 1200, 1, 1), { x: 0, y: 0, side: 1200 });
  assert.deepEqual(cropGeometry(2400, 1200, 1, -1), { x: 1200, y: 0, side: 1200 });
});
