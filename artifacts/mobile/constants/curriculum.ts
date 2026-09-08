import type { WordItem } from './words';
import type { TranslationKey } from './translations';

export const WORDS_PER_CHAPTER = 5;

export type LearningActivity = 'picture' | 'listen' | 'spell';

export type ChapterTheme = {
  id: string;
  emoji: string;
  badge: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  colors: { main: string; pale: string; border: string };
};

export const ANIMAL_CHAPTER_THEMES: readonly ChapterTheme[] = [
  {
    id: 'farm_pets',
    emoji: '🐶',
    badge: '🐶 🐮',
    titleKey: 'chapterAnimalsFarmTitle',
    descKey: 'chapterAnimalsFarmDesc',
    colors: { main: '#48BB78', pale: '#F0FFF4', border: '#2F855A' },
  },
  {
    id: 'wild_safari',
    emoji: '🦁',
    badge: '🦁 🐘',
    titleKey: 'chapterAnimalsSafariTitle',
    descKey: 'chapterAnimalsSafariDesc',
    colors: { main: '#ED8936', pale: '#FFFAF0', border: '#DD6B20' },
  },
  {
    id: 'birds',
    emoji: '🦜',
    badge: '🦜 🦆',
    titleKey: 'chapterAnimalsBirdsTitle',
    descKey: 'chapterAnimalsBirdsDesc',
    colors: { main: '#4299E1', pale: '#EBF8FF', border: '#3182CE' },
  },
  {
    id: 'sea_life',
    emoji: '🐬',
    badge: '🐬 🐙',
    titleKey: 'chapterAnimalsSeaTitle',
    descKey: 'chapterAnimalsSeaDesc',
    colors: { main: '#00B4D8', pale: '#E3F8FC', border: '#0077B6' },
  },
  {
    id: 'reptiles',
    emoji: '🐢',
    badge: '🐢 🐸',
    titleKey: 'chapterAnimalsReptilesTitle',
    descKey: 'chapterAnimalsReptilesDesc',
    colors: { main: '#38B000', pale: '#EFFBE7', border: '#206B00' },
  },
  {
    id: 'bugs',
    emoji: '🐝',
    badge: '🐝 🦋',
    titleKey: 'chapterAnimalsBugsTitle',
    descKey: 'chapterAnimalsBugsDesc',
    colors: { main: '#9D4EDD', pale: '#F6ECFC', border: '#7209B7' },
  },
];

export const FLAG_CHAPTER_THEMES: readonly ChapterTheme[] = [
  {
    id: 'flags_europe',
    emoji: '🇪🇺',
    badge: '🇹🇷 🇩🇪',
    titleKey: 'chapterFlagsEuropeTitle',
    descKey: 'chapterFlagsEuropeDesc',
    colors: { main: '#3A86FF', pale: '#EEF5FF', border: '#1A67DD' },
  },
  {
    id: 'flags_asia',
    emoji: '🌏',
    badge: '🇯🇵 🇨🇳',
    titleKey: 'chapterFlagsAsiaTitle',
    descKey: 'chapterFlagsAsiaDesc',
    colors: { main: '#E63946', pale: '#FFF0F2', border: '#C0202D' },
  },
  {
    id: 'flags_americas',
    emoji: '🌎',
    badge: '🇺🇸 🇧🇷',
    titleKey: 'chapterFlagsAmericasTitle',
    descKey: 'chapterFlagsAmericasDesc',
    colors: { main: '#06D6A0', pale: '#EDFAF5', border: '#039E75' },
  },
  {
    id: 'flags_africa_oceania',
    emoji: '🌍',
    badge: '🇪🇬 🇦🇺',
    titleKey: 'chapterFlagsAfricaOceaniaTitle',
    descKey: 'chapterFlagsAfricaOceaniaDesc',
    colors: { main: '#FF9F1C', pale: '#FFF7ED', border: '#D97706' },
  },
];

export const FRUIT_CHAPTER_THEMES: readonly ChapterTheme[] = [
  {
    id: 'fruits_level_1',
    emoji: '🍎',
    badge: '🍎 🍌',
    titleKey: 'chapterFruitsOrchardTitle',
    descKey: 'chapterFruitsOrchardDesc',
    colors: { main: '#E63946', pale: '#FFF2F4', border: '#C0202D' },
  },
  {
    id: 'fruits_level_2',
    emoji: '🍋',
    badge: '🍋 🍇',
    titleKey: 'chapterFruitsTropicalTitle',
    descKey: 'chapterFruitsTropicalDesc',
    colors: { main: '#FFB703', pale: '#FFFBEB', border: '#D97706' },
  },
  {
    id: 'fruits_level_3',
    emoji: '🍍',
    badge: '🍍 🥝',
    titleKey: 'chapterFruitsCitrusTitle',
    descKey: 'chapterFruitsCitrusDesc',
    colors: { main: '#FB8500', pale: '#FFF5EB', border: '#C45700' },
  },
  {
    id: 'fruits_level_4',
    emoji: '🥑',
    badge: '🥭 🥑',
    titleKey: 'chapterFruitsSummerTitle',
    descKey: 'chapterFruitsSummerDesc',
    colors: { main: '#06D6A0', pale: '#EDFAF5', border: '#039E75' },
  },
];

export const SPORTS_CHAPTER_THEMES: readonly ChapterTheme[] = [
  {
    id: 'sports_ball',
    emoji: '⚽',
    badge: '⚽ 🏀',
    titleKey: 'chapterSportsBallTitle',
    descKey: 'chapterSportsBallDesc',
    colors: { main: '#FF5722', pale: '#FFF3E0', border: '#E64A19' },
  },
  {
    id: 'sports_action',
    emoji: '🏃',
    badge: '🥋 ⛷️',
    titleKey: 'chapterSportsActionTitle',
    descKey: 'chapterSportsActionDesc',
    colors: { main: '#00B4D8', pale: '#E3F8FC', border: '#0077B6' },
  },
];

export type CategoryChapter = {
  number: number;
  theme?: ChapterTheme;
  entries: Array<{ word: WordItem; globalIndex: number }>;
  completedCount: number;
  complete: boolean;
  unlocked: boolean;
};

const ACTIVITY_SEQUENCE: readonly LearningActivity[] = ['picture', 'spell', 'listen', 'spell'];

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

  const isAnimals = category === 'animals';
  const isFlags = category === 'flags';
  const isFruits = category === 'fruits';
  const isSports = category === 'sports';
  const chapters: CategoryChapter[] = [];

  for (let start = 0; start < entries.length; start += WORDS_PER_CHAPTER) {
    const chapterIndex = Math.floor(start / WORDS_PER_CHAPTER);
    const chapterEntries = entries.slice(start, start + WORDS_PER_CHAPTER);
    const completedCount = chapterEntries.filter(({ globalIndex }) =>
      completedLevels.includes(globalIndex),
    ).length;
    const previous = chapters[chapters.length - 1];
    const theme = isAnimals && chapterIndex < ANIMAL_CHAPTER_THEMES.length
      ? ANIMAL_CHAPTER_THEMES[chapterIndex]
      : isFlags && chapterIndex < FLAG_CHAPTER_THEMES.length
        ? FLAG_CHAPTER_THEMES[chapterIndex]
        : isFruits && chapterIndex < FRUIT_CHAPTER_THEMES.length
          ? FRUIT_CHAPTER_THEMES[chapterIndex]
          : isSports && chapterIndex < SPORTS_CHAPTER_THEMES.length
            ? SPORTS_CHAPTER_THEMES[chapterIndex]
            : undefined;

    chapters.push({
      number: chapterIndex + 1,
      theme,
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
