// Pure card generation: no DOM, no I/O, no async. FR-12 groundwork.
const OPERATIONS = ['addition', 'subtraction', 'multiplication', 'division'];

const DEFAULT_RANGE = { min: 1, max: 1 };

const DEFAULT_RANGES = {
  addition: DEFAULT_RANGE,
  subtraction: DEFAULT_RANGE,
  multiplication: DEFAULT_RANGE,
  division: DEFAULT_RANGE,
};

function cardId(operation, operandA, operandB) {
  return `${operation}:${operandA}:${operandB}`;
}

/**
 * Generates all valid cards for one operation across a { min, max } range
 * applied to both operands. Subtraction requires minuend >= subtrahend;
 * division requires an exact (zero-remainder) quotient. A range with no
 * valid pairs simply yields an empty array — not an error.
 */
export function generateOperationCards(operation, range) {
  const { min, max } = range;
  const cards = [];

  for (let a = min; a <= max; a += 1) {
    for (let b = min; b <= max; b += 1) {
      if (operation === 'subtraction' && a < b) {
        continue;
      }
      if (operation === 'division' && (b === 0 || a % b !== 0)) {
        continue;
      }
      cards.push({ id: cardId(operation, a, b), box: 1 });
    }
  }

  return cards;
}

/**
 * Generates the full deck across all four operations. Defaults to the
 * 1-1 range per operation, producing exactly one card per operation.
 */
export function generateDeck(rangesByOperation = DEFAULT_RANGES) {
  const cards = [];

  for (const operation of OPERATIONS) {
    const range = rangesByOperation[operation] ?? DEFAULT_RANGE;
    cards.push(...generateOperationCards(operation, range));
  }

  return cards;
}

export { OPERATIONS, DEFAULT_RANGE, DEFAULT_RANGES };
