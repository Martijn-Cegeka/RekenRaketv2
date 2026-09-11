// Pure due-card + run-batching logic: no DOM, no I/O, no async. FR-3, FR-4 groundwork.
const RUN_SIZE = 20;

/** Snapshots the full deck as the day's Due-card set (every card is due per FR-3). */
function getDueCards(allCards) {
  return [...allCards];
}

/** Splits due cards into consecutive chunks of at most `runSize`, preserving order. */
function batchIntoRuns(dueCards, runSize = RUN_SIZE) {
  const runs = [];
  for (let i = 0; i < dueCards.length; i += runSize) {
    runs.push(dueCards.slice(i, i + runSize));
  }
  return runs;
}

export { RUN_SIZE, getDueCards, batchIntoRuns };
