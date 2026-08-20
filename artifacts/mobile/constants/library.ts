/**
 * Content for the Library tab: kid-friendly categories (animals, fruits,
 * numbers, colors, flags). Each item's `names` map provides the label in
 * every supported locale, so switching the app language also translates
 * the vocabulary shown here — not just the surrounding UI strings.
 *
 * Animal and fruit items that also exist in the letter-building game
 * (see constants/words.ts) share the same `id` and reuse the same image,
 * and stay lock-gated behind level progress. Everything else is free to
 * explore immediately.
 */
import type { Locale } from './translations';
import words from './words';

export type CategoryId = 'animals' | 'fruits' | 'numbers' | 'colors' | 'flags' | 'body';

export type LibraryItem = {
  id: string;
  names: Record<Locale, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  emoji?: string;
  swatch?: string;
  /** id of the matching entry in constants/words.ts, if this item is gated by game progress */
  wordId?: string;
};

export type Category = {
  id: CategoryId;
  emoji: string;
  image?: any;
  titleKey: 'categoryAnimals' | 'categoryFruits' | 'categoryNumbers' | 'categoryColors' | 'categoryFlags' | 'categoryBody';
  items: LibraryItem[];
};

const categories: Category[] = [
  {
    id: 'animals',
    emoji: '🦁',
    image: require('../assets/images/lion.png'),
    titleKey: 'categoryAnimals',
    items: words.filter((w) => w.category === 'animals').map((w) => ({
      id: w.id,
      wordId: w.id,
      image: w.image,
      emoji: w.emoji,
      names: w.spellings,
    })),
  },
  {
    id: 'fruits',
    emoji: '🍓',
    image: require('../assets/images/strawberry.png'),
    titleKey: 'categoryFruits',
    items: words.filter((w) => w.category === 'fruits').map((w) => ({
      id: w.id,
      wordId: w.id,
      image: w.image,
      emoji: w.emoji,
      names: w.spellings,
    })),
  },
  {
    id: 'numbers',
    emoji: '🔢',
    titleKey: 'categoryNumbers',
    items: words.filter((w) => w.category === 'numbers').map((w) => ({
      id: w.id,
      wordId: w.id,
      image: w.image,
      emoji: w.emoji,
      names: w.spellings,
    })),
  },
  {
    id: 'colors',
    emoji: '🎨',
    titleKey: 'categoryColors',
    items: words.filter((w) => w.category === 'colors').map((w) => ({
      id: w.id,
      wordId: w.id,
      image: w.image,
      swatch: w.swatch,
      names: w.spellings,
    })),
  },
  {
    id: 'flags',
    emoji: '🌍',
    titleKey: 'categoryFlags',
    items: words.filter((w) => w.category === 'flags').map((w) => ({
      id: w.id,
      wordId: w.id,
      image: w.image,
      emoji: w.emoji,
      names: w.spellings,
    })),
  },
  {
    id: 'body',
    emoji: '🖐️',
    image: require('../assets/images/child.png'),
    titleKey: 'categoryBody',
    items: words.filter((w) => w.category === 'body').map((w) => ({
      id: w.id,
      wordId: w.id,
      emoji: w.emoji,
      names: w.spellings,
    })),
  },
];

export default categories;
