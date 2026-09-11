import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createStore } from '../../src/store.js';
import { BOX_COUNT } from '../../src/domain/leitner.js';

test('derives box counts and total from a freshly seeded deck (Box 1 100%, others 0%)', async () => {
  globalThis.indexedDB = new IDBFactory();

  const store = createStore();
  const state = await store.init();

  assert.equal(state.totalCards, 4);
  assert.equal(state.boxCounts.length, BOX_COUNT);
  assert.equal(state.boxCounts[0], 4);
  for (let i = 1; i < BOX_COUNT; i += 1) {
    assert.equal(state.boxCounts[i], 0);
  }

  const fillPercents = state.boxCounts.map((count) =>
    state.totalCards > 0 ? (count / state.totalCards) * 100 : 0,
  );
  assert.deepEqual(fillPercents, [100, 0, 0, 0, 0]);
});
