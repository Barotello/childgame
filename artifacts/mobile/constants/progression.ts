import type { WordItem } from './words';

/**
 * A category is intentionally its own learning path: children can try the
 * first word in any category, then unlock the next word by completing it.
 */
export function isWordUnlocked(
  words: readonly WordItem[],
  completedLevels: readonly number[],
  level: number,
): boolean {
  const word = words[level];
  if (!word) return false;

  // Unlocked for development
  return true;
}

export function firstAvailableLevel(
  words: readonly WordItem[],
  completedLevels: readonly number[],
  category: WordItem['category'],
): number | undefined {
  const nextLevel = words.findIndex(
    (word, index) =>
      word.category === category &&
      isWordUnlocked(words, completedLevels, index) &&
      !completedLevels.includes(index),
  );
  if (nextLevel >= 0) return nextLevel;

  // A completed category remains replayable from its first word.
  const firstLevel = words.findIndex((word) => word.category === category);
  return firstLevel >= 0 ? firstLevel : undefined;
}
