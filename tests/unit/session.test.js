import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUN_SIZE, getDueCards, batchIntoRuns } from '../../src/domain/session.js';

test('getDueCards returns a shallow-copied snapshot, not the original array', () => {
  const cards = [{ id: 'a' }, { id: 'b' }];
  const due = getDueCards(cards);

  assert.deepEqual(due, cards);
  assert.notEqual(due, cards);
});

test('RUN_SIZE is 20', () => {
  assert.equal(RUN_SIZE, 20);
});

test('fresh install (4 cards): batches into a single run of 4', () => {
  const cards = Array.from({ length: 4 }, (_, i) => ({ id: `c${i}` }));
  const runs = batchIntoRuns(getDueCards(cards));

  assert.equal(runs.length, 1);
  assert.equal(runs[0].length, 4);
});

test('exactly 20 due cards: batches into a single run of 20', () => {
  const cards = Array.from({ length: 20 }, (_, i) => ({ id: `c${i}` }));
  const runs = batchIntoRuns(getDueCards(cards));

  assert.equal(runs.length, 1);
  assert.equal(runs[0].length, 20);
});

test('21 due cards: batches into two runs of [20, 1], preserving order', () => {
  const cards = Array.from({ length: 21 }, (_, i) => ({ id: `c${i}` }));
  const runs = batchIntoRuns(getDueCards(cards));

  assert.equal(runs.length, 2);
  assert.equal(runs[0].length, 20);
  assert.equal(runs[1].length, 1);
  assert.deepEqual(runs[0].map((c) => c.id), cards.slice(0, 20).map((c) => c.id));
  assert.deepEqual(runs[1].map((c) => c.id), [cards[20].id]);
});
