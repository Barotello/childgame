/**
 * Word list for the letter-drag word-building game.
 *
 * Each word's `letters` array is the source of truth for both the empty
 * slot row and the scrambled tray — one array entry per visual letter
 * tile, so multi-character Turkish letters (İ, Ş, etc.) stay intact.
 *
 * Every word also belongs to a kid-friendly category so the Play screen
 * can be grouped with the Library chips (Animals, Fruits, etc.).
 */

import { type CategoryId } from './library';

export type WordItem = {
  id: string;
  letters: string[];
  category: CategoryId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
};

const words: WordItem[] = [
  {
    id: 'elma',
    letters: ['E', 'L', 'M', 'A'],
    category: 'fruits',
    image: require('../assets/images/word-elma.png'),
  },
  {
    id: 'kedi',
    letters: ['K', 'E', 'D', 'İ'],
    category: 'animals',
    image: require('../assets/images/word-kedi.png'),
  },
  {
    id: 'kus',
    letters: ['K', 'U', 'Ş'],
    category: 'animals',
    image: require('../assets/images/word-kus.png'),
  },
  {
    id: 'ari',
    letters: ['A', 'R', 'I'],
    category: 'animals',
    image: require('../assets/images/word-ari.png'),
  },
  {
    id: 'balik',
    letters: ['B', 'A', 'L', 'I', 'K'],
    category: 'animals',
    image: require('../assets/images/word-balik.png'),
  },
  {
    id: 'fil',
    letters: ['F', 'İ', 'L'],
    category: 'animals',
    image: require('../assets/images/word-fil.png'),
  },
  {
    id: 'ayi',
    letters: ['A', 'Y', 'I'],
    category: 'animals',
    image: require('../assets/images/word-ayi.png'),
  },
  {
    id: 'inek',
    letters: ['İ', 'N', 'E', 'K'],
    category: 'animals',
    image: require('../assets/images/word-inek.png'),
  },
  {
    id: 'ordek',
    letters: ['Ö', 'R', 'D', 'E', 'K'],
    category: 'animals',
    image: require('../assets/images/word-ordek.png'),
  },
  {
    id: 'tavuk',
    letters: ['T', 'A', 'V', 'U', 'K'],
    category: 'animals',
    image: require('../assets/images/word-tavuk.png'),
  },
];

export default words;
