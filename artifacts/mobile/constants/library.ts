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

export type CategoryId = 'animals' | 'fruits' | 'numbers' | 'colors' | 'flags';

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
  icon: string;
  titleKey: 'categoryAnimals' | 'categoryFruits' | 'categoryNumbers' | 'categoryColors' | 'categoryFlags';
  items: LibraryItem[];
};

const categories: Category[] = [
  {
    id: 'animals',
    icon: 'feather',
    titleKey: 'categoryAnimals',
    items: [
      {
        id: 'kedi',
        wordId: 'kedi',
        image: require('../assets/images/word-kedi.png'),
        names: { tr: 'Kedi', en: 'Cat', fr: 'Chat', es: 'Gato', it: 'Gatto', de: 'Katze' },
      },
      {
        id: 'kus',
        wordId: 'kus',
        image: require('../assets/images/word-kus.png'),
        names: { tr: 'Kuş', en: 'Bird', fr: 'Oiseau', es: 'Pájaro', it: 'Uccello', de: 'Vogel' },
      },
      {
        id: 'ari',
        wordId: 'ari',
        image: require('../assets/images/word-ari.png'),
        names: { tr: 'Arı', en: 'Bee', fr: 'Abeille', es: 'Abeja', it: 'Ape', de: 'Biene' },
      },
      {
        id: 'balik',
        wordId: 'balik',
        image: require('../assets/images/word-balik.png'),
        names: { tr: 'Balık', en: 'Fish', fr: 'Poisson', es: 'Pez', it: 'Pesce', de: 'Fisch' },
      },
      {
        id: 'fil',
        wordId: 'fil',
        image: require('../assets/images/word-fil.png'),
        names: { tr: 'Fil', en: 'Elephant', fr: 'Éléphant', es: 'Elefante', it: 'Elefante', de: 'Elefant' },
      },
      {
        id: 'ayi',
        wordId: 'ayi',
        image: require('../assets/images/word-ayi.png'),
        names: { tr: 'Ayı', en: 'Bear', fr: 'Ours', es: 'Oso', it: 'Orso', de: 'Bär' },
      },
      {
        id: 'inek',
        wordId: 'inek',
        image: require('../assets/images/word-inek.png'),
        names: { tr: 'İnek', en: 'Cow', fr: 'Vache', es: 'Vaca', it: 'Vacca', de: 'Kuh' },
      },
      {
        id: 'ordek',
        wordId: 'ordek',
        image: require('../assets/images/word-ordek.png'),
        names: { tr: 'Ördek', en: 'Duck', fr: 'Canard', es: 'Pato', it: 'Anatra', de: 'Ente' },
      },
      {
        id: 'tavuk',
        wordId: 'tavuk',
        image: require('../assets/images/word-tavuk.png'),
        names: { tr: 'Tavuk', en: 'Chicken', fr: 'Poulet', es: 'Pollo', it: 'Pollo', de: 'Huhn' },
      },
    ],
  },
  {
    id: 'fruits',
    icon: 'box',
    titleKey: 'categoryFruits',
    items: [
      {
        id: 'elma',
        wordId: 'elma',
        image: require('../assets/images/word-elma.png'),
        names: { tr: 'Elma', en: 'Apple', fr: 'Pomme', es: 'Manzana', it: 'Mela', de: 'Apfel' },
      },
      {
        id: 'muz',
        emoji: '🍌',
        names: { tr: 'Muz', en: 'Banana', fr: 'Banane', es: 'Plátano', it: 'Banana', de: 'Banane' },
      },
      {
        id: 'portakal',
        emoji: '🍊',
        names: { tr: 'Portakal', en: 'Orange', fr: 'Orange', es: 'Naranja', it: 'Arancia', de: 'Orange' },
      },
      {
        id: 'cilek',
        emoji: '🍓',
        names: { tr: 'Çilek', en: 'Strawberry', fr: 'Fraise', es: 'Fresa', it: 'Fragola', de: 'Erdbeere' },
      },
      {
        id: 'uzum',
        emoji: '🍇',
        names: { tr: 'Üzüm', en: 'Grapes', fr: 'Raisin', es: 'Uvas', it: 'Uva', de: 'Traube' },
      },
      {
        id: 'karpuz',
        emoji: '🍉',
        names: { tr: 'Karpuz', en: 'Watermelon', fr: 'Pastèque', es: 'Sandía', it: 'Anguria', de: 'Wassermelone' },
      },
    ],
  },
  {
    id: 'numbers',
    icon: 'hash',
    titleKey: 'categoryNumbers',
    items: [
      { id: 'n1', emoji: '1', names: { tr: 'Bir', en: 'One', fr: 'Un', es: 'Uno', it: 'Uno', de: 'Eins' } },
      { id: 'n2', emoji: '2', names: { tr: 'İki', en: 'Two', fr: 'Deux', es: 'Dos', it: 'Due', de: 'Zwei' } },
      { id: 'n3', emoji: '3', names: { tr: 'Üç', en: 'Three', fr: 'Trois', es: 'Tres', it: 'Tre', de: 'Drei' } },
      { id: 'n4', emoji: '4', names: { tr: 'Dört', en: 'Four', fr: 'Quatre', es: 'Cuatro', it: 'Quattro', de: 'Vier' } },
      { id: 'n5', emoji: '5', names: { tr: 'Beş', en: 'Five', fr: 'Cinq', es: 'Cinco', it: 'Cinque', de: 'Fünf' } },
      { id: 'n6', emoji: '6', names: { tr: 'Altı', en: 'Six', fr: 'Six', es: 'Seis', it: 'Sei', de: 'Sechs' } },
      { id: 'n7', emoji: '7', names: { tr: 'Yedi', en: 'Seven', fr: 'Sept', es: 'Siete', it: 'Sette', de: 'Sieben' } },
      { id: 'n8', emoji: '8', names: { tr: 'Sekiz', en: 'Eight', fr: 'Huit', es: 'Ocho', it: 'Otto', de: 'Acht' } },
      { id: 'n9', emoji: '9', names: { tr: 'Dokuz', en: 'Nine', fr: 'Neuf', es: 'Nueve', it: 'Nove', de: 'Neun' } },
      { id: 'n10', emoji: '10', names: { tr: 'On', en: 'Ten', fr: 'Dix', es: 'Diez', it: 'Dieci', de: 'Zehn' } },
    ],
  },
  {
    id: 'colors',
    icon: 'droplet',
    titleKey: 'categoryColors',
    items: [
      { id: 'red', swatch: '#F25C54', names: { tr: 'Kırmızı', en: 'Red', fr: 'Rouge', es: 'Rojo', it: 'Rosso', de: 'Rot' } },
      { id: 'blue', swatch: '#4A90D9', names: { tr: 'Mavi', en: 'Blue', fr: 'Bleu', es: 'Azul', it: 'Blu', de: 'Blau' } },
      { id: 'yellow', swatch: '#F6C445', names: { tr: 'Sarı', en: 'Yellow', fr: 'Jaune', es: 'Amarillo', it: 'Giallo', de: 'Gelb' } },
      { id: 'green', swatch: '#6FCB6B', names: { tr: 'Yeşil', en: 'Green', fr: 'Vert', es: 'Verde', it: 'Verde', de: 'Grün' } },
      { id: 'orange', swatch: '#F5964A', names: { tr: 'Turuncu', en: 'Orange', fr: 'Orange', es: 'Naranja', it: 'Arancione', de: 'Orange' } },
      { id: 'purple', swatch: '#9B72CF', names: { tr: 'Mor', en: 'Purple', fr: 'Violet', es: 'Morado', it: 'Viola', de: 'Lila' } },
      { id: 'pink', swatch: '#F58FB4', names: { tr: 'Pembe', en: 'Pink', fr: 'Rose', es: 'Rosa', it: 'Rosa', de: 'Rosa' } },
      { id: 'black', swatch: '#3A3A3A', names: { tr: 'Siyah', en: 'Black', fr: 'Noir', es: 'Negro', it: 'Nero', de: 'Schwarz' } },
      { id: 'white', swatch: '#FFFFFF', names: { tr: 'Beyaz', en: 'White', fr: 'Blanc', es: 'Blanco', it: 'Bianco', de: 'Weiß' } },
      { id: 'brown', swatch: '#A9714B', names: { tr: 'Kahverengi', en: 'Brown', fr: 'Marron', es: 'Marrón', it: 'Marrone', de: 'Braun' } },
    ],
  },
  {
    id: 'flags',
    icon: 'flag',
    titleKey: 'categoryFlags',
    items: [
      {
        id: 'tr',
        emoji: '🇹🇷',
        names: { tr: 'Türkiye', en: 'Turkey', fr: 'Turquie', es: 'Turquía', it: 'Turchia', de: 'Türkei' },
      },
      {
        id: 'gb',
        emoji: '🇬🇧',
        names: { tr: 'İngiltere', en: 'United Kingdom', fr: 'Royaume-Uni', es: 'Reino Unido', it: 'Regno Unito', de: 'Vereinigtes Königreich' },
      },
      {
        id: 'fr',
        emoji: '🇫🇷',
        names: { tr: 'Fransa', en: 'France', fr: 'France', es: 'Francia', it: 'Francia', de: 'Frankreich' },
      },
      {
        id: 'es',
        emoji: '🇪🇸',
        names: { tr: 'İspanya', en: 'Spain', fr: 'Espagne', es: 'España', it: 'Spagna', de: 'Spanien' },
      },
      {
        id: 'it',
        emoji: '🇮🇹',
        names: { tr: 'İtalya', en: 'Italy', fr: 'Italie', es: 'Italia', it: 'Italia', de: 'Italien' },
      },
      {
        id: 'de',
        emoji: '🇩🇪',
        names: { tr: 'Almanya', en: 'Germany', fr: 'Allemagne', es: 'Alemania', it: 'Germania', de: 'Deutschland' },
      },
      {
        id: 'jp',
        emoji: '🇯🇵',
        names: { tr: 'Japonya', en: 'Japan', fr: 'Japon', es: 'Japón', it: 'Giappone', de: 'Japan' },
      },
      {
        id: 'br',
        emoji: '🇧🇷',
        names: { tr: 'Brezilya', en: 'Brazil', fr: 'Brésil', es: 'Brasil', it: 'Brasile', de: 'Brasilien' },
      },
      {
        id: 'ca',
        emoji: '🇨🇦',
        names: { tr: 'Kanada', en: 'Canada', fr: 'Canada', es: 'Canadá', it: 'Canada', de: 'Kanada' },
      },
      {
        id: 'eg',
        emoji: '🇪🇬',
        names: { tr: 'Mısır', en: 'Egypt', fr: 'Égypte', es: 'Egipto', it: 'Egitto', de: 'Ägypten' },
      },
    ],
  },
];

export default categories;
