/**
 * Word list for the letter-drag word-building game.
 *
 * Each word's `letters` array is the source of truth for both the empty
 * slot row and the scrambled tray — one array entry per visual letter
 * tile, so multi-character Turkish letters (İ, Ş, etc.) stay intact.
 */

export type WordItem = {
  id: string;
  letters: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
};

const words: WordItem[] = [
  {
    id: 'elma',
    letters: ['E', 'L', 'M', 'A'],
    image: require('../assets/images/word-elma.png'),
  },
  {
    id: 'kedi',
    letters: ['K', 'E', 'D', 'İ'],
    image: require('../assets/images/word-kedi.png'),
  },
  {
    id: 'kus',
    letters: ['K', 'U', 'Ş'],
    image: require('../assets/images/word-kus.png'),
  },
  {
    id: 'ari',
    letters: ['A', 'R', 'I'],
    image: require('../assets/images/word-ari.png'),
  },
  {
    id: 'balik',
    letters: ['B', 'A', 'L', 'I', 'K'],
    image: require('../assets/images/word-balik.png'),
  },
  {
    id: 'fil',
    letters: ['F', 'İ', 'L'],
    image: require('../assets/images/word-fil.png'),
  },
];

export default words;
