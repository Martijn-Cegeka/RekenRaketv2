import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOX_COUNT, RETRY_CAP } from '../../src/domain/leitner.js';

test('BOX_COUNT is 5', () => {
  assert.equal(BOX_COUNT, 5);
});

test('RETRY_CAP is 3', () => {
  assert.equal(RETRY_CAP, 3);
});
