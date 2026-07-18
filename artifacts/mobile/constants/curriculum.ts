import type { WordItem } from './words';

export const WORDS_PER_CHAPTER = 5;

export type LearningActivity = 'picture' | 'listen' | 'spell';

export type CategoryChapter = {
  number: number;
  entries: Array<{ word: WordItem; globalIndex: number }>;
  completedCount: number;
  complete: boolean;
  unlocked: boolean;
};

const ACTIVITY_SEQUENCE: readonly LearningActivity[] = ['picture', 'listen', 'spell'];

export function learningActivityForPosition(position: number): LearningActivity {
  return ACTIVITY_SEQUENCE[Math.max(0, position) % ACTIVITY_SEQUENCE.length];
}

export function chapterProgress(totalWords: number, completedWords: number) {
  const totalChapters = Math.max(1, Math.ceil(totalWords / WORDS_PER_CHAPTER));
  const safeCompleted = Math.max(0, Math.min(completedWords, totalWords));
  const currentChapter = Math.min(
    totalChapters,
    Math.floor(safeCompleted / WORDS_PER_CHAPTER) + 1,
  );

  return { currentChapter, totalChapters };
}

export function buildCategoryChapters(
  allWords: readonly WordItem[],
  completedLevels: readonly number[],
  category: WordItem['category'],
): CategoryChapter[] {
  const entries = allWords
    .map((word, globalIndex) => ({ word, globalIndex }))
    .filter(({ word }) => word.category === category);

  const chapters: CategoryChapter[] = [];
  for (let start = 0; start < entries.length; start += WORDS_PER_CHAPTER) {
    const chapterEntries = entries.slice(start, start + WORDS_PER_CHAPTER);
    const completedCount = chapterEntries.filter(({ globalIndex }) =>
      completedLevels.includes(globalIndex),
    ).length;
    const previous = chapters[chapters.length - 1];
    chapters.push({
      number: chapters.length + 1,
      entries: chapterEntries,
      completedCount,
      complete: completedCount === chapterEntries.length,
      unlocked: !previous || previous.complete,
    });
  }
  return chapters;
}

/** Creates four stable same-category choices and rotates the answer position. */
export function buildPictureChoices(
  allWords: readonly WordItem[],
  target: WordItem,
  count = 4,
): WordItem[] {
  const categoryWords = allWords.filter((word) => word.category === target.category);
  const targetIndex = Math.max(0, categoryWords.findIndex((word) => word.id === target.id));
  const distractors = categoryWords.filter((word) => word.id !== target.id);
  const selected = [target];

  for (let offset = 0; selected.length < count && offset < distractors.length; offset++) {
    selected.push(distractors[(targetIndex + offset) % distractors.length]);
  }

  const answerPosition = targetIndex % selected.length;
  const answer = selected.shift();
  if (answer) selected.splice(answerPosition, 0, answer);
  return selected;
}
