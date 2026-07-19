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
    animals: 11,
    fruits: 13,
    numbers: 0,
    flags: 0,
  });
  assert.equal(new Set(expandedWords.map((word) => word.id)).size, expandedWords.length);
});

test('the shipped starter expansion stays suitable for early readers', () => {
  for (const word of expandedWords) {
    for (const locale of ['tr', 'en'] as const) {
      const spelling = word.spellings[locale];
      assert.ok(
        Array.from(spelling).length <= 9,
        `${word.id}/${locale} is too long for the starter path: ${spelling}`,
      );
      assert.equal(spelling.includes(' '), false, `${word.id}/${locale} must be one word`);
    }
  }
});

test('fruit expansion avoids ambiguous picture-choice rounds', () => {
  const fruits = expandedWords.filter((word) => word.category === 'fruits');
  assert.ok(fruits.length > 0);
  assert.ok(fruits.every((word) => word.pictureReady === false));
});
