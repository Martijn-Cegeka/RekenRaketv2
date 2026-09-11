// Sole owner of runtime app state (AD-1). Only module that calls domain/ and db.js.
import { initDB, getAllCards } from './db.js';
import { BOX_COUNT } from './domain/leitner.js';

function computeState(cards) {
  const boxCounts = new Array(BOX_COUNT).fill(0);
  for (const card of cards) {
    if (card.box >= 1 && card.box <= BOX_COUNT) {
      boxCounts[card.box - 1] += 1;
    }
  }
  return { boxCounts, totalCards: cards.length };
}

export function createStore() {
  let db = null;
  let state = { boxCounts: new Array(BOX_COUNT).fill(0), totalCards: 0 };
  const listeners = new Set();

  function notify() {
    for (const listener of listeners) {
      listener(state);
    }
  }

  async function init() {
    db = await initDB();
    const cards = await getAllCards(db);
    state = computeState(cards);
    notify();
    return state;
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { init, getState, subscribe };
}
