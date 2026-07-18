import assert from 'node:assert/strict';
import test from 'node:test';
import { expandedWords } from './expandedWords';

test('content expansion reaches the requested scalable category totals', () => {
  const counts = Object.fromEntries(
    ['animals', 'fruits', 'numbers', 'flags'].map((category) => [
      category,
      expandedWords.filter((word) => word.category === category).length,
    ]),
  );

  assert.deepEqual(counts, {
    animals: 71,
    fruits: 93,
    numbers: 90,
    flags: 88,
  });
  assert.equal(new Set(expandedWords.map((word) => word.id)).size, expandedWords.length);
});

test('fruit expansion avoids ambiguous picture-choice rounds', () => {
  const fruits = expandedWords.filter((word) => word.category === 'fruits');
  assert.ok(fruits.length > 0);
  assert.ok(fruits.every((word) => word.pictureReady === false));
});
