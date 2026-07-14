/**
 * Word list for the letter-drag word-building game.
 *
 * Each word is stored as a lowercase string per language. When a round
 * starts, the active locale's spelling is converted to uppercase with
 * that locale's rules, so Turkish "kedi" becomes "KEDİ" while English
 * "cat" stays "CAT". This keeps the game vocabulary tied to the chosen
 * UI language, not just the surrounding menu strings.
 *
 * Every word also belongs to a kid-friendly category so the Play screen
 * can be grouped with the Library chips (Animals, Fruits, etc.).
 */

import { type CategoryId } from './library';
import { type Locale } from './translations';

export type WordItem = {
  id: string;
  spellings: Record<Locale, string>;
  category: CategoryId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
};

const words: WordItem[] = [
  {
    id: 'elma',
    spellings: { tr: 'elma', en: 'apple', fr: 'pomme', es: 'manzana', it: 'mela', de: 'apfel' },
    category: 'fruits',
    image: require('../assets/images/word-elma.png'),
  },
  {
    id: 'kedi',
    spellings: { tr: 'kedi', en: 'cat', fr: 'chat', es: 'gato', it: 'gatto', de: 'katze' },
    category: 'animals',
    image: require('../assets/images/word-kedi.png'),
  },
  {
    id: 'kus',
    spellings: { tr: 'kuş', en: 'bird', fr: 'oiseau', es: 'pájaro', it: 'uccello', de: 'vogel' },
    category: 'animals',
    image: require('../assets/images/word-kus.png'),
  },
  {
    id: 'ari',
    spellings: { tr: 'arı', en: 'bee', fr: 'abeille', es: 'abeja', it: 'ape', de: 'biene' },
    category: 'animals',
    image: require('../assets/images/word-ari.png'),
  },
  {
    id: 'balik',
    spellings: { tr: 'balık', en: 'fish', fr: 'poisson', es: 'pez', it: 'pesce', de: 'fisch' },
    category: 'animals',
    image: require('../assets/images/word-balik.png'),
  },
  {
    id: 'fil',
    spellings: { tr: 'fil', en: 'elephant', fr: 'éléphant', es: 'elefante', it: 'elefante', de: 'elefant' },
    category: 'animals',
    image: require('../assets/images/word-fil.png'),
  },
  {
    id: 'ayi',
    spellings: { tr: 'ayı', en: 'bear', fr: 'ours', es: 'oso', it: 'orso', de: 'bär' },
    category: 'animals',
    image: require('../assets/images/word-ayi.png'),
  },
  {
    id: 'inek',
    spellings: { tr: 'inek', en: 'cow', fr: 'vache', es: 'vaca', it: 'vacca', de: 'kuh' },
    category: 'animals',
    image: require('../assets/images/word-inek.png'),
  },
  {
    id: 'ordek',
    spellings: { tr: 'ördek', en: 'duck', fr: 'canard', es: 'pato', it: 'anatra', de: 'ente' },
    category: 'animals',
    image: require('../assets/images/word-ordek.png'),
  },
  {
    id: 'tavuk',
    spellings: { tr: 'tavuk', en: 'chicken', fr: 'poulet', es: 'pollo', it: 'pollo', de: 'huhn' },
    category: 'animals',
    image: require('../assets/images/word-tavuk.png'),
  },
];

export default words;
