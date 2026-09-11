import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateDeck, generateOperationCards } from '../../src/domain/card-generator.js';

function parseCardId(id) {
  const [operation, a, b] = id.split(':');
  return { operation, a: Number(a), b: Number(b) };
}

test('generates exactly one card per operation at the default 1-1 range, all in Box 1', () => {
  const deck = generateDeck();

  assert.equal(deck.length, 4);
  const ids = deck.map((card) => card.id).sort();
  assert.deepEqual(ids, [
    'addition:1:1',
    'division:1:1',
    'multiplication:1:1',
    'subtraction:1:1',
  ]);
  for (const card of deck) {
    assert.equal(card.box, 1);
  }
});

test('subtraction only generates cards where minuend >= subtrahend', () => {
  const cards = generateOperationCards('subtraction', { min: 1, max: 3 });

  assert.ok(cards.length > 0);
  for (const card of cards) {
    const { a, b } = parseCardId(card.id);
    assert.ok(a >= b, `expected ${card.id} to satisfy minuend >= subtrahend`);
  }
});

test('division only generates cards with an exact quotient', () => {
  const cards = generateOperationCards('division', { min: 1, max: 6 });

  assert.ok(cards.length > 0);
  for (const card of cards) {
    const { a, b } = parseCardId(card.id);
    assert.equal(a % b, 0, `expected ${card.id} to have an exact quotient`);
  }
});

test('a range with no valid pairs returns no cards, not an error', () => {
  const cards = generateOperationCards('addition', { min: 5, max: 3 });

  assert.deepEqual(cards, []);
});

test('addition generates every operand pair across a wider range', () => {
  const cards = generateOperationCards('addition', { min: 1, max: 3 });

  assert.equal(cards.length, 9);
  for (const card of cards) {
    const { a, b } = parseCardId(card.id);
    assert.ok(a >= 1 && a <= 3 && b >= 1 && b <= 3, `expected ${card.id} operands within range`);
  }
});

test('multiplication generates every operand pair across a wider range', () => {
  const cards = generateOperationCards('multiplication', { min: 1, max: 3 });

  assert.equal(cards.length, 9);
  for (const card of cards) {
    const { a, b } = parseCardId(card.id);
    assert.ok(a >= 1 && a <= 3 && b >= 1 && b <= 3, `expected ${card.id} operands within range`);
  }
});
