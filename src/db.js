// Sole owner of the IndexedDB schema/migrations (AD-5). Consumed only by store.js.
import { generateDeck } from './domain/card-generator.js';

const DB_NAME = 'rekenraket';
const DB_VERSION = 1;
const STORE_CARDS = 'cards';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_CARDS)) {
        const store = db.createObjectStore(STORE_CARDS, { keyPath: 'id' });
        store.createIndex('box', 'box', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('IndexedDB open blocked by another connection'));
  });
}

export function getAllCards(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CARDS, 'readonly');
    const store = tx.objectStore(STORE_CARDS);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function putCards(db, cards) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CARDS, 'readwrite');
    const store = tx.objectStore(STORE_CARDS);
    for (const card of cards) {
      store.put(card);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function seedIfEmpty(db) {
  const existing = await getAllCards(db);
  if (existing.length > 0) {
    return existing;
  }
  const deck = generateDeck();
  await putCards(db, deck);
  return deck;
}

/** Opens the database, seeding the default deck only if it's empty. */
export async function initDB() {
  const db = await openDatabase();
  await seedIfEmpty(db);
  return db;
}
