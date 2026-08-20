import type { WordItem } from './words';
import type { Locale } from './translations';

type SimpleSpec = readonly [id: string, tr: string, en: string, emoji: string];

function spellings(_tr: string, en: string): Record<Locale, string> {
  return { en };
}

function simpleWords(
  category: WordItem['category'],
  specs: readonly SimpleSpec[],
  pictureReady = true,
): WordItem[] {
  return specs.map(([id, tr, en, emoji]) => ({
    id,
    category,
    spellings: spellings(tr, en),
    emoji,
    pictureReady,
  }));
}

const EXPANDED_ANIMALS: readonly SimpleSpec[] = [
  ['anim_crab', 'yengeç', 'crab', '🦀'],
  ['anim_deer', 'geyik', 'deer', '🦌'],
  ['anim_goat', 'keçi', 'goat', '🐐'],
  ['anim_sheep', 'koyun', 'sheep', '🐑'],
  ['anim_camel', 'deve', 'camel', '🐫'],
  ['anim_donkey', 'eşek', 'donkey', '🫏'],
  ['anim_zebra', 'zebra', 'zebra', '🦓'],
  ['anim_snake', 'yılan', 'snake', '🐍'],
  ['anim_frog', 'kurbağa', 'frog', '🐸'],
  ['anim_seal', 'fok', 'seal', '🦭'],
  ['anim_goose', 'kaz', 'goose', '🪿'],
];

/**
 * Curated starter expansion for ages 4–7.
 */
export const expandedWords: WordItem[] = [
  ...simpleWords('animals', EXPANDED_ANIMALS),
];
