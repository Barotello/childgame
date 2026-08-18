import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildPictureChoices,
  buildCategoryChapters,
  chapterProgress,
  learningActivityForPosition,
} from './curriculum';
import type { WordItem } from './words';

const animalWords = ['cat', 'dog', 'bird', 'fish', 'bear'].map((id) => ({
  id,
  category: 'animals',
  spellings: { tr: id, en: id, fr: id, es: id, it: id, de: id },
})) as WordItem[];

test('learning activities repeat in a child-friendly sequence', () => {
  assert.equal(learningActivityForPosition(0), 'picture');
  assert.equal(learningActivityForPosition(1), 'listen');
  assert.equal(learningActivityForPosition(2), 'picture');
  assert.equal(learningActivityForPosition(3), 'listen');
});

test('chapter progress groups vocabulary into sets of five', () => {
  assert.deepEqual(chapterProgress(12, 0), { currentChapter: 1, totalChapters: 3 });
  assert.deepEqual(chapterProgress(12, 5), { currentChapter: 2, totalChapters: 3 });
  assert.deepEqual(chapterProgress(12, 12), { currentChapter: 3, totalChapters: 3 });
});

test('picture choices contain one answer and three stable distractors', () => {
  const choices = buildPictureChoices(animalWords, animalWords[1]);
  assert.equal(choices.length, 4);
  assert.equal(choices.filter((word) => word.id === 'dog').length, 1);
  assert.equal(new Set(choices.map((word) => word.id)).size, 4);
  assert.deepEqual(buildPictureChoices(animalWords, animalWords[1]), choices);
});

test('chapters unlock only after every word in the previous chapter is complete', () => {
  const extraWords = [...animalWords, ...animalWords.slice(0, 2).map((word, index) => ({
    ...word,
    id: `extra-${index}`,
  }))];
  const locked = buildCategoryChapters(extraWords, [0, 1, 2, 3], 'animals');
  assert.equal(locked.length, 2);
  assert.equal(locked[0].unlocked, true);
  assert.equal(locked[1].unlocked, false);

  const unlocked = buildCategoryChapters(extraWords, [0, 1, 2, 3, 4], 'animals');
  assert.equal(unlocked[0].complete, true);
  assert.equal(unlocked[1].unlocked, true);
});
