import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createStore } from '../../src/store.js';
import { BOX_COUNT } from '../../src/domain/leitner.js';
import { initDB, putCards } from '../../src/db.js';

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

test('startSession snapshots the deck into a single run for a fresh (4-card) install', async () => {
  globalThis.indexedDB = new IDBFactory();

  const store = createStore();
  await store.init();
  const state = await store.startSession();

  assert.equal(state.session.runs.length, 1);
  assert.equal(state.session.runs[0].length, 4);
  assert.equal(state.session.currentRunIndex, 0);
  assert.equal(state.session.isComplete, false);
});

test('completeCurrentRun advances currentRunIndex and sets isComplete when runs are exhausted', async () => {
  globalThis.indexedDB = new IDBFactory();

  const store = createStore();
  await store.init();
  await store.startSession();

  const state = store.completeCurrentRun();

  assert.equal(state.session.currentRunIndex, 1);
  assert.equal(state.session.isComplete, true);
});

test('completeCurrentRun does not advance currentRunIndex past runs.length', async () => {
  globalThis.indexedDB = new IDBFactory();

  const store = createStore();
  await store.init();
  await store.startSession();

  store.completeCurrentRun();
  const state = store.completeCurrentRun();

  assert.equal(state.session.currentRunIndex, 1);
  assert.equal(state.session.isComplete, true);
});

test('notifies subscribers when a session starts and when a run completes', async () => {
  globalThis.indexedDB = new IDBFactory();

  const store = createStore();
  await store.init();

  const seen = [];
  store.subscribe((state) => seen.push(state));

  await store.startSession();
  store.completeCurrentRun();

  assert.equal(seen.length, 2);
  assert.ok(seen[0].session);
  assert.equal(seen[1].session.isComplete, true);
});

test('startSession batches more than 20 due cards into multiple runs', async () => {
  globalThis.indexedDB = new IDBFactory();

  const seedDb = await initDB();
  const extraCards = Array.from({ length: 17 }, (_, i) => ({
    id: `addition:${i + 2}:${i + 2}`,
    box: 1,
  }));
  await putCards(seedDb, extraCards);

  const store = createStore();
  await store.init();
  const state = await store.startSession();

  assert.equal(state.session.runs.length, 2);
  assert.equal(state.session.runs[0].length, 20);
  assert.equal(state.session.runs[1].length, 1);
});

test('session snapshot is unaffected by cards added after startSession (mid-session deck change)', async () => {
  globalThis.indexedDB = new IDBFactory();

  const store = createStore();
  await store.init();
  await store.startSession();

  const db = await initDB();
  await putCards(db, [{ id: 'addition:2:2', box: 1 }]);

  assert.equal(store.getState().session.runs[0].length, 4);
});

test('completeCurrentRun clamps currentRunIndex at runs.length after the last of several runs completes', async () => {
  globalThis.indexedDB = new IDBFactory();

  const seedDb = await initDB();
  const extraCards = Array.from({ length: 17 }, (_, i) => ({
    id: `addition:${i + 2}:${i + 2}`,
    box: 1,
  }));
  await putCards(seedDb, extraCards);

  const store = createStore();
  await store.init();
  await store.startSession();

  store.completeCurrentRun();
  const state = store.completeCurrentRun();

  assert.equal(state.session.runs.length, 2);
  assert.equal(state.session.currentRunIndex, 2);
  assert.equal(state.session.isComplete, true);
});
