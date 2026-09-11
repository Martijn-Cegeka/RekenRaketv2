// Sole owner of runtime app state (AD-1). Only module that calls domain/ and db.js.
import { initDB, getAllCards } from './db.js';
import { BOX_COUNT } from './domain/leitner.js';
import { getDueCards, batchIntoRuns } from './domain/session.js';

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
  let state = { boxCounts: new Array(BOX_COUNT).fill(0), totalCards: 0, session: null };
  const listeners = new Set();

  function notify() {
    for (const listener of listeners) {
      listener(state);
    }
  }

  async function init() {
    db = await initDB();
    const cards = await getAllCards(db);
    state = { ...computeState(cards), session: null };
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

  async function startSession() {
    const cards = await getAllCards(db);
    const runs = batchIntoRuns(getDueCards(cards));
    state = { ...state, session: { runs, currentRunIndex: 0, isComplete: false } };
    notify();
    return state;
  }

  function completeCurrentRun() {
    const { session } = state;
    if (!session) {
      return state;
    }
    const nextIndex = Math.min(session.currentRunIndex + 1, session.runs.length);
    state = {
      ...state,
      session: {
        ...session,
        currentRunIndex: nextIndex,
        isComplete: nextIndex >= session.runs.length,
      },
    };
    notify();
    return state;
  }

  return { init, getState, subscribe, startSession, completeCurrentRun };
}
