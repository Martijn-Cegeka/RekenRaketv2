import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { initDB, getAllCards } from '../../src/db.js';

test('seeds the default deck on a fresh database', async () => {
  globalThis.indexedDB = new IDBFactory();

  const db = await initDB();
  const cards = await getAllCards(db);

  assert.equal(cards.length, 4);
  assert.ok(cards.every((card) => card.box === 1));
});

test('does not reseed or duplicate cards on a subsequent open', async () => {
  globalThis.indexedDB = new IDBFactory();

  const db1 = await initDB();
  const before = await getAllCards(db1);
  db1.close();

  const db2 = await initDB();
  const after = await getAllCards(db2);

  assert.equal(after.length, before.length);
  assert.deepEqual(
    after.map((card) => card.id).sort(),
    before.map((card) => card.id).sort(),
  );
});
