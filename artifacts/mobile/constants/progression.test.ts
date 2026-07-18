import assert from 'node:assert/strict';
import test from 'node:test';
import { firstAvailableLevel, isWordUnlocked } from './progression';
import type { WordItem } from './words';

const words = [
  { id: 'cat', category: 'animals' },
  { id: 'dog', category: 'animals' },
  { id: 'apple', category: 'fruits' },
  { id: 'pear', category: 'fruits' },
] as WordItem[];

test('the first word in every category is available', () => {
  assert.equal(isWordUnlocked(words, [], 0), true);
  assert.equal(isWordUnlocked(words, [], 2), true);
});

test('words unlock in order within their own category', () => {
  assert.equal(isWordUnlocked(words, [], 1), false);
  assert.equal(isWordUnlocked(words, [0], 1), true);
  assert.equal(isWordUnlocked(words, [0], 3), false);
  assert.equal(isWordUnlocked(words, [0, 2], 3), true);
});

test('category selection chooses the next unfinished word or restarts a completed category', () => {
  assert.equal(firstAvailableLevel(words, [0], 'animals'), 1);
  assert.equal(firstAvailableLevel(words, [0, 1], 'animals'), 0);
  assert.equal(firstAvailableLevel(words, [], 'fruits'), 2);
});
