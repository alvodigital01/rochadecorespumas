import test from 'node:test';
import assert from 'node:assert/strict';

import { getMagneticOffset, getRippleGeometry } from '../js/button-effects.js';

const rect = { left: 10, top: 20, width: 200, height: 50 };

test('getMagneticOffset returns no displacement at the center', () => {
  assert.deepEqual(getMagneticOffset(110, 45, rect), {
    x: 0,
    y: 0,
    glowX: 50,
    glowY: 50,
  });
});

test('getMagneticOffset clamps the pointer to the button bounds', () => {
  assert.deepEqual(getMagneticOffset(-500, 900, rect), {
    x: -5,
    y: 3.5,
    glowX: 0,
    glowY: 100,
  });
});

test('getRippleGeometry centers keyboard-triggered ripples', () => {
  const geometry = getRippleGeometry(Number.NaN, Number.NaN, rect);

  assert.equal(geometry.x, 100);
  assert.equal(geometry.y, 25);
  assert.equal(geometry.diameter, Math.hypot(100, 25) * 2);
});

test('getRippleGeometry grows a pointer ripple to the farthest corner', () => {
  const geometry = getRippleGeometry(10, 20, rect);

  assert.equal(geometry.x, 0);
  assert.equal(geometry.y, 0);
  assert.equal(geometry.diameter, Math.hypot(200, 50) * 2);
});
