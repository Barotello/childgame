import { type CategoryId } from './library';
import { type Locale } from './translations';

export type WordItem = {
  id: string;
  spellings: Record<Locale, string>;
  category: CategoryId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  emoji?: string;
  swatch?: string;
};

/**
 * Kid-friendly word list (ages 4–7): 2–7 letters, no spaces,
 * no multi-word names, vegetables removed from fruits, flags capped.
 */
const words: WordItem[] = [
  {
    id: 'ari',
    spellings: { tr: 'arı', en: 'bee', fr: 'abeille', es: 'abeja', it: 'ape', de: 'biene' },
    category: 'animals',
    image: require('../assets/images/word-ari.png'),
  },
  {
    id: 'ayi',
    spellings: { tr: 'ayı', en: 'bear', fr: 'ours', es: 'oso', it: 'orso', de: 'bär' },
    category: 'animals',
    image: require('../assets/images/word-ayi.png'),
  },
  {
    id: 'balik',
    spellings: { tr: 'balık', en: 'fish', fr: 'poisson', es: 'pez', it: 'pesce', de: 'fisch' },
    category: 'animals',
    image: require('../assets/images/word-balik.png'),
  },
  {
    id: 'fil',
    spellings: { tr: 'fil', en: 'fil', fr: 'fil', es: 'fil', it: 'fil', de: 'fil' },
    category: 'animals',
    image: require('../assets/images/word-fil.png'),
  },
  {
    id: 'inek',
    spellings: { tr: 'inek', en: 'cow', fr: 'vache', es: 'vaca', it: 'vacca', de: 'kuh' },
    category: 'animals',
    image: require('../assets/images/word-inek.png'),
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
    id: 'tavuk',
    spellings: { tr: 'tavuk', en: 'chicken', fr: 'poulet', es: 'pollo', it: 'pollo', de: 'huhn' },
    category: 'animals',
    image: require('../assets/images/word-tavuk.png'),
  },
  {
    id: 'ordek',
    spellings: { tr: 'ördek', en: 'duck', fr: 'canard', es: 'pato', it: 'anatra', de: 'ente' },
    category: 'animals',
    image: require('../assets/images/word-ordek.png'),
  },
  {
    id: 'anim_lion',
    spellings: { tr: 'aslan', en: 'lion', fr: 'lion', es: 'león', it: 'leone', de: 'löwe' },
    category: 'animals',
    emoji: '🦁',
  },
  {
    id: 'anim_horse',
    spellings: { tr: 'at', en: 'horse', fr: 'cheval', es: 'caballo', it: 'cavallo', de: 'pferd' },
    category: 'animals',
    emoji: '🐴',
  },
  {
    id: 'anim_whale',
    spellings: { tr: 'balina', en: 'whale', fr: 'baleine', es: 'ballena', it: 'balena', de: 'wal' },
    category: 'animals',
    emoji: '🐳',
  },
  {
    id: 'anim_owl',
    spellings: { tr: 'baykuş', en: 'owl', fr: 'hibou', es: 'búho', it: 'gufo', de: 'eule' },
    category: 'animals',
    emoji: '🦉',
  },
  {
    id: 'anim_pig',
    spellings: { tr: 'domuz', en: 'pig', fr: 'cochon', es: 'cerdo', it: 'maiale', de: 'schwein' },
    category: 'animals',
    emoji: '🐷',
  },
  {
    id: 'anim_mouse',
    spellings: { tr: 'fare', en: 'mouse', fr: 'souris', es: 'ratón', it: 'topo', de: 'maus' },
    category: 'animals',
    emoji: '🐭',
  },
  {
    id: 'anim_hamster',
    spellings: { tr: 'hamster', en: 'hamster', fr: 'hamster', es: 'hámster', it: 'criceto', de: 'hamster' },
    category: 'animals',
    emoji: '🐹',
  },
  {
    id: 'anim_tiger',
    spellings: { tr: 'kaplan', en: 'tiger', fr: 'tigre', es: 'tigre', it: 'tigre', de: 'tiger' },
    category: 'animals',
    emoji: '🐯',
  },
  {
    id: 'anim_eagle',
    spellings: { tr: 'kartal', en: 'eagle', fr: 'aigle', es: 'águila', it: 'aquila', de: 'adler' },
    category: 'animals',
    emoji: '🦅',
  },
  {
    id: 'anim_ant',
    spellings: { tr: 'karınca', en: 'ant', fr: 'fourmi', es: 'hormiga', it: 'formica', de: 'ameise' },
    category: 'animals',
    emoji: '🐜',
  },
  {
    id: 'anim_koala',
    spellings: { tr: 'koala', en: 'koala', fr: 'koala', es: 'koala', it: 'koala', de: 'koala' },
    category: 'animals',
    emoji: '🐨',
  },
  {
    id: 'anim_wolf',
    spellings: { tr: 'kurt', en: 'wolf', fr: 'loup', es: 'lobo', it: 'lupo', de: 'wolf' },
    category: 'animals',
    emoji: '🐺',
  },
  {
    id: 'anim_swan',
    spellings: { tr: 'kuğu', en: 'swan', fr: 'cygne', es: 'cisne', it: 'cigno', de: 'schwan' },
    category: 'animals',
    emoji: '🦢',
  },
  {
    id: 'anim_dog',
    spellings: { tr: 'köpek', en: 'dog', fr: 'chien', es: 'perro', it: 'cane', de: 'hund' },
    category: 'animals',
    emoji: '🐶',
  },
  {
    id: 'anim_monkey',
    spellings: { tr: 'maymun', en: 'monkey', fr: 'singe', es: 'mono', it: 'scimmia', de: 'affe' },
    category: 'animals',
    emoji: '🐵',
  },
  {
    id: 'anim_panda',
    spellings: { tr: 'panda', en: 'panda', fr: 'panda', es: 'panda', it: 'panda', de: 'panda' },
    category: 'animals',
    emoji: '🐼',
  },
  {
    id: 'anim_fox',
    spellings: { tr: 'tilki', en: 'fox', fr: 'renard', es: 'zorro', it: 'volpe', de: 'fuchs' },
    category: 'animals',
    emoji: '🦊',
  },
  {
    id: 'anim_worm',
    spellings: { tr: 'tırtıl', en: 'worm', fr: 'ver', es: 'gusano', it: 'verme', de: 'raupe' },
    category: 'animals',
    emoji: '🐛',
  },
  {
    id: 'anim_dolphin',
    spellings: { tr: 'yunus', en: 'dolphin', fr: 'dauphin', es: 'delfín', it: 'delfino', de: 'delfin' },
    category: 'animals',
    emoji: '🐬',
  },
  {
    id: 'anim_giraffe',
    spellings: { tr: 'zürafa', en: 'giraffe', fr: 'girafe', es: 'jirafa', it: 'giraffa', de: 'giraffe' },
    category: 'animals',
    emoji: '🦒',
  },
  {
    id: 'elma',
    spellings: { tr: 'elma', en: 'apple', fr: 'pomme', es: 'manzana', it: 'mela', de: 'apfel' },
    category: 'fruits',
    image: require('../assets/images/word-elma.png'),
  },
  {
    id: 'fruit_melon',
    spellings: { tr: 'kavun', en: 'melon', fr: 'melon', es: 'melón', it: 'melone', de: 'melone' },
    category: 'fruits',
    emoji: '🍈',
  },
  {
    id: 'fruit_kiwi',
    spellings: { tr: 'kivi', en: 'kiwi', fr: 'kiwi', es: 'kiwi', it: 'kiwi', de: 'kiwi' },
    category: 'fruits',
    emoji: '🥝',
  },
  {
    id: 'fruit_lemon',
    spellings: { tr: 'limon', en: 'lemon', fr: 'citron', es: 'limón', it: 'limone', de: 'zitrone' },
    category: 'fruits',
    emoji: '🍋',
  },
  {
    id: 'fruit_mango',
    spellings: { tr: 'mango', en: 'mango', fr: 'mangue', es: 'mango', it: 'mango', de: 'mango' },
    category: 'fruits',
    emoji: '🥭',
  },
  {
    id: 'fruit_banana',
    spellings: { tr: 'muz', en: 'banana', fr: 'banane', es: 'plátano', it: 'banana', de: 'banane' },
    category: 'fruits',
    emoji: '🍌',
  },
  {
    id: 'fruit_grape',
    spellings: { tr: 'üzüm', en: 'grape', fr: 'raisin', es: 'uva', it: 'uva', de: 'traube' },
    category: 'fruits',
    emoji: '🍇',
  },
  {
    id: 'n6',
    spellings: { tr: 'altı', en: 'six', fr: 'six', es: 'seis', it: 'sei', de: 'sechs' },
    category: 'numbers',
    emoji: '6',
  },
  {
    id: 'n5',
    spellings: { tr: 'beş', en: 'five', fr: 'cinq', es: 'cinco', it: 'cinque', de: 'fünf' },
    category: 'numbers',
    emoji: '5',
  },
  {
    id: 'n1',
    spellings: { tr: 'bir', en: 'one', fr: 'un', es: 'uno', it: 'uno', de: 'eins' },
    category: 'numbers',
    emoji: '1',
  },
  {
    id: 'n9',
    spellings: { tr: 'dokuz', en: 'nine', fr: 'neuf', es: 'nueve', it: 'nove', de: 'neun' },
    category: 'numbers',
    emoji: '9',
  },
  {
    id: 'n4',
    spellings: { tr: 'dört', en: 'four', fr: 'quatre', es: 'cuatro', it: 'quattro', de: 'vier' },
    category: 'numbers',
    emoji: '4',
  },
  {
    id: 'n2',
    spellings: { tr: 'iki', en: 'two', fr: 'deux', es: 'dos', it: 'due', de: 'zwei' },
    category: 'numbers',
    emoji: '2',
  },
  {
    id: 'n10',
    spellings: { tr: 'on', en: 'ten', fr: 'dix', es: 'diez', it: 'dieci', de: 'zehn' },
    category: 'numbers',
    emoji: '10',
  },
  {
    id: 'n8',
    spellings: { tr: 'sekiz', en: 'eight', fr: 'huit', es: 'ocho', it: 'otto', de: 'acht' },
    category: 'numbers',
    emoji: '8',
  },
  {
    id: 'n7',
    spellings: { tr: 'yedi', en: 'seven', fr: 'sept', es: 'siete', it: 'sette', de: 'sieben' },
    category: 'numbers',
    emoji: '7',
  },
  {
    id: 'n3',
    spellings: { tr: 'üç', en: 'three', fr: 'trois', es: 'tres', it: 'tre', de: 'drei' },
    category: 'numbers',
    emoji: '3',
  },
  {
    id: 'white',
    spellings: { tr: 'beyaz', en: 'white', fr: 'blanc', es: 'blanco', it: 'bianco', de: 'weiß' },
    category: 'colors',
    swatch: '#FFFFFF',
  },
  {
    id: 'red',
    spellings: { tr: 'kırmızı', en: 'red', fr: 'rouge', es: 'rojo', it: 'rosso', de: 'rot' },
    category: 'colors',
    swatch: '#F25C54',
  },
  {
    id: 'blue',
    spellings: { tr: 'mavi', en: 'blue', fr: 'bleu', es: 'azul', it: 'blu', de: 'blau' },
    category: 'colors',
    swatch: '#4A90D9',
  },
  {
    id: 'purple',
    spellings: { tr: 'mor', en: 'purple', fr: 'violet', es: 'morado', it: 'viola', de: 'lila' },
    category: 'colors',
    swatch: '#9B72CF',
  },
  {
    id: 'pink',
    spellings: { tr: 'pembe', en: 'pink', fr: 'rose', es: 'rosa', it: 'rosa', de: 'rosa' },
    category: 'colors',
    swatch: '#F58FB4',
  },
  {
    id: 'black',
    spellings: { tr: 'siyah', en: 'black', fr: 'noir', es: 'negro', it: 'nero', de: 'schwarz' },
    category: 'colors',
    swatch: '#3A3A3A',
  },
  {
    id: 'green',
    spellings: { tr: 'yeşil', en: 'green', fr: 'vert', es: 'verde', it: 'verde', de: 'grün' },
    category: 'colors',
    swatch: '#6FCB6B',
  },
  {
    id: 'flag_it',
    spellings: { tr: 'italya', en: 'italy', fr: 'italie', es: 'italia', it: 'italia', de: 'italien' },
    category: 'flags',
    emoji: '🇮🇹',
  },
  {
    id: 'flag_ca',
    spellings: { tr: 'kanada', en: 'canada', fr: 'canada', es: 'canadá', it: 'canada', de: 'kanada' },
    category: 'flags',
    emoji: '🇨🇦',
  },
  {
    id: 'flag_ke',
    spellings: { tr: 'kenya', en: 'kenya', fr: 'kenya', es: 'kenia', it: 'kenya', de: 'kenia' },
    category: 'flags',
    emoji: '🇰🇪',
  },
  {
    id: 'flag_cu',
    spellings: { tr: 'küba', en: 'cuba', fr: 'cuba', es: 'cuba', it: 'cuba', de: 'kuba' },
    category: 'flags',
    emoji: '🇨🇺',
  },
  {
    id: 'flag_mt',
    spellings: { tr: 'malta', en: 'malta', fr: 'malte', es: 'malta', it: 'malta', de: 'malta' },
    category: 'flags',
    emoji: '🇲🇹',
  },
  {
    id: 'flag_mx',
    spellings: { tr: 'meksika', en: 'mexico', fr: 'mexique', es: 'méxico', it: 'messico', de: 'mexiko' },
    category: 'flags',
    emoji: '🇲🇽',
  },
  {
    id: 'flag_eg',
    spellings: { tr: 'mısır', en: 'egypt', fr: 'égypte', es: 'egipto', it: 'egitto', de: 'ägypten' },
    category: 'flags',
    emoji: '🇪🇬',
  },
  {
    id: 'flag_np',
    spellings: { tr: 'nepal', en: 'nepal', fr: 'népal', es: 'nepal', it: 'nepal', de: 'nepal' },
    category: 'flags',
    emoji: '🇳🇵',
  },
  {
    id: 'flag_pe',
    spellings: { tr: 'peru', en: 'peru', fr: 'pérou', es: 'perú', it: 'perù', de: 'peru' },
    category: 'flags',
    emoji: '🇵🇪',
  },
  {
    id: 'flag_pl',
    spellings: { tr: 'polonya', en: 'poland', fr: 'pologne', es: 'polonia', it: 'polonia', de: 'polen' },
    category: 'flags',
    emoji: '🇵🇱',
  },
  {
    id: 'flag_cn',
    spellings: { tr: 'çin', en: 'china', fr: 'chine', es: 'china', it: 'cina', de: 'china' },
    category: 'flags',
    emoji: '🇨🇳',
  },
  {
    id: 'flag_cl',
    spellings: { tr: 'şili', en: 'chile', fr: 'chili', es: 'chile', it: 'cile', de: 'chile' },
    category: 'flags',
    emoji: '🇨🇱',
  },
];

export default words;
