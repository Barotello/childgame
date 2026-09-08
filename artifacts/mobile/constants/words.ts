import { type CategoryId } from './library';
import { type Locale } from './translations';
import { expandedWords } from './expandedWords';

export type WordItem = {
  id: string;
  spellings: Record<Locale, string>;
  category: CategoryId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  emoji?: string;
  swatch?: string;
  /** False when the fallback artwork is not distinct enough for a picture-choice round. */
  pictureReady?: boolean;
};

/**
 * Kid-friendly word list (ages 4–7): 2–7 letters, no spaces,
 * no multi-word names, vegetables removed from fruits, flags capped.
 */
const baseWords: WordItem[] = [
  // --- Chapter 1: Farm & Pets (Evcil & Çiftlik) ---
  {
    id: 'kedi',
    spellings: { tr: 'kedi', en: 'cat', fr: 'chat', es: 'gato', it: 'gatto', de: 'katze' },
    category: 'animals',
    image: require('../assets/images/word-kedi.png'),
    emoji: '🐱',
  },
  {
    id: 'anim_dog',
    spellings: { tr: 'köpek', en: 'dog', fr: 'chien', es: 'perro', it: 'cane', de: 'hund' },
    category: 'animals',
    image: require('../assets/images/word-kopek.png'),
    emoji: '🐶',
  },
  {
    id: 'inek',
    spellings: { tr: 'inek', en: 'cow', fr: 'vache', es: 'vaca', it: 'vacca', de: 'kuh' },
    category: 'animals',
    image: require('../assets/images/word-inek.png'),
    emoji: '🐄',
  },
  {
    id: 'anim_horse',
    spellings: { tr: 'at', en: 'horse', fr: 'cheval', es: 'caballo', it: 'cavallo', de: 'pferd' },
    category: 'animals',
    image: require('../assets/images/word-at.png'),
    emoji: '🐴',
  },
  {
    id: 'anim_rabbit',
    spellings: { tr: 'tavşan', en: 'rabbit', fr: 'lapin', es: 'conejo', it: 'coniglio', de: 'hase' },
    category: 'animals',
    image: require('../assets/images/word-tavsan.png'),
    emoji: '🐰',
  },

  // --- Chapter 2: Wild Safari & Forest (Vahşi Orman & Safari) ---
  {
    id: 'anim_lion',
    spellings: { tr: 'aslan', en: 'lion', fr: 'lion', es: 'león', it: 'leone', de: 'löwe' },
    category: 'animals',
    image: require('../assets/images/word-aslan.png'),
    emoji: '🦁',
  },
  {
    id: 'fil',
    spellings: { tr: 'fil', en: 'elephant', fr: 'éléphant', es: 'elefante', it: 'elefante', de: 'elefant' },
    category: 'animals',
    image: require('../assets/images/word-fil.png'),
    emoji: '🐘',
  },
  {
    id: 'ayi',
    spellings: { tr: 'ayı', en: 'bear', fr: 'ours', es: 'oso', it: 'orso', de: 'bär' },
    category: 'animals',
    image: require('../assets/images/word-ayi.png'),
    emoji: '🐻',
  },
  {
    id: 'anim_monkey',
    spellings: { tr: 'maymun', en: 'monkey', fr: 'singe', es: 'mono', it: 'scimmia', de: 'affe' },
    category: 'animals',
    emoji: '🐵',
  },
  {
    id: 'anim_giraffe',
    spellings: { tr: 'zürafa', en: 'giraffe', fr: 'girafe', es: 'jirafa', it: 'giraffa', de: 'giraffe' },
    category: 'animals',
    emoji: '🦒',
  },

  // --- Chapter 3: Birds & Wings (Kanatlı Dostlar / Kuşlar) ---
  {
    id: 'kus',
    spellings: { tr: 'kuş', en: 'bird', fr: 'oiseau', es: 'pájaro', it: 'uccello', de: 'vogel' },
    category: 'animals',
    image: require('../assets/images/word-kus.png'),
    emoji: '🐦',
  },
  {
    id: 'tavuk',
    spellings: { tr: 'tavuk', en: 'chicken', fr: 'poulet', es: 'pollo', it: 'pollo', de: 'huhn' },
    category: 'animals',
    image: require('../assets/images/word-tavuk.png'),
    emoji: '🐔',
  },
  {
    id: 'ordek',
    spellings: { tr: 'ördek', en: 'duck', fr: 'canard', es: 'pato', it: 'anatra', de: 'ente' },
    category: 'animals',
    image: require('../assets/images/duck.png'),
    emoji: '🦆',
  },
  {
    id: 'anim_owl',
    spellings: { tr: 'baykuş', en: 'owl', fr: 'hibou', es: 'búho', it: 'gufo', de: 'eule' },
    category: 'animals',
    emoji: '🦉',
  },
  {
    id: 'anim_eagle',
    spellings: { tr: 'kartal', en: 'eagle', fr: 'aigle', es: 'águila', it: 'aquila', de: 'adler' },
    category: 'animals',
    emoji: '🦅',
  },

  // --- Chapter 4: Sea & Ocean Life (Deniz & Okyanus Canlıları) ---
  {
    id: 'balik',
    spellings: { tr: 'balık', en: 'fish', fr: 'poisson', es: 'pez', it: 'pesce', de: 'fisch' },
    category: 'animals',
    image: require('../assets/images/word-balik.png'),
    emoji: '🐟',
  },
  {
    id: 'anim_dolphin',
    spellings: { tr: 'yunus', en: 'dolphin', fr: 'dauphin', es: 'delfín', it: 'delfino', de: 'delfin' },
    category: 'animals',
    emoji: '🐬',
  },
  {
    id: 'anim_whale',
    spellings: { tr: 'balina', en: 'whale', fr: 'baleine', es: 'ballena', it: 'balena', de: 'wal' },
    category: 'animals',
    emoji: '🐳',
  },
  {
    id: 'anim_swan',
    spellings: { tr: 'kuğu', en: 'swan', fr: 'cygne', es: 'cisne', it: 'cigno', de: 'schwan' },
    category: 'animals',
    emoji: '🦢',
  },
  {
    id: 'anim_koala',
    spellings: { tr: 'koala', en: 'koala', fr: 'koala', es: 'koala', it: 'koala', de: 'koala' },
    category: 'animals',
    emoji: '🐨',
  },

  // --- Chapter 5: Wildlife & Nature (Vahşi Doğa & Çeşitlilik) ---
  {
    id: 'anim_tiger',
    spellings: { tr: 'kaplan', en: 'tiger', fr: 'tigre', es: 'tigre', it: 'tigre', de: 'tiger' },
    category: 'animals',
    emoji: '🐯',
  },
  {
    id: 'anim_panda',
    spellings: { tr: 'panda', en: 'panda', fr: 'panda', es: 'panda', it: 'panda', de: 'panda' },
    category: 'animals',
    emoji: '🐼',
  },
  {
    id: 'anim_wolf',
    spellings: { tr: 'kurt', en: 'wolf', fr: 'loup', es: 'lobo', it: 'lupo', de: 'wolf' },
    category: 'animals',
    emoji: '🐺',
  },
  {
    id: 'anim_fox',
    spellings: { tr: 'tilki', en: 'fox', fr: 'renard', es: 'zorro', it: 'volpe', de: 'fuchs' },
    category: 'animals',
    emoji: '🦊',
  },
  {
    id: 'anim_pig',
    spellings: { tr: 'domuz', en: 'pig', fr: 'cochon', es: 'cerdo', it: 'maiale', de: 'schwein' },
    category: 'animals',
    emoji: '🐷',
  },

  // --- Chapter 6: Insects & Tiny Friends (Minik Dostlar & Böcekler) ---
  {
    id: 'ari',
    spellings: { tr: 'arı', en: 'bee', fr: 'abeille', es: 'abeja', it: 'ape', de: 'biene' },
    category: 'animals',
    image: require('../assets/images/word-ari.png'),
    emoji: '🐝',
  },
  {
    id: 'anim_ant',
    spellings: { tr: 'karınca', en: 'ant', fr: 'fourmi', es: 'hormiga', it: 'formica', de: 'ameise' },
    category: 'animals',
    emoji: '🐜',
  },
  {
    id: 'anim_worm',
    spellings: { tr: 'tırtıl', en: 'worm', fr: 'ver', es: 'gusano', it: 'verme', de: 'raupe' },
    category: 'animals',
    emoji: '🐛',
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
  // ==========================================
  // FRUITS — CHAPTER 1: En Sevilen Meyveler 🍎 (Level 1 - Easiest)
  // ==========================================
  {
    id: 'elma',
    spellings: { tr: 'elma', en: 'apple', fr: 'pomme', es: 'manzana', it: 'mela', de: 'apfel' },
    category: 'fruits',
    image: require('../assets/images/word-elma.png'),
    emoji: '🍎',
  },
  {
    id: 'fruit_banana',
    spellings: { tr: 'muz', en: 'banana', fr: 'banane', es: 'plátano', it: 'banana', de: 'banane' },
    category: 'fruits',
    image: require('../assets/images/word-muz.png'),
    emoji: '🍌',
  },
  {
    id: 'fruit_strawberry',
    spellings: { tr: 'çilek', en: 'strawberry', fr: 'fraise', es: 'fresa', it: 'fragola', de: 'erdbeere' },
    category: 'fruits',
    image: require('../assets/images/word-cilek.png'),
    emoji: '🍓',
  },
  {
    id: 'fruit_orange',
    spellings: { tr: 'portakal', en: 'orange', fr: 'orange', es: 'naranja', it: 'arancia', de: 'orange' },
    category: 'fruits',
    image: require('../assets/images/word-portakal.png'),
    emoji: '🍊',
  },
  {
    id: 'fruit_watermelon',
    spellings: { tr: 'karpuz', en: 'watermelon', fr: 'pastèque', es: 'sandía', it: 'anguria', de: 'wassermelone' },
    category: 'fruits',
    emoji: '🍉',
  },

  // ==========================================
  // FRUITS — CHAPTER 2: Tanıdık Lezzetler 🍋 (Level 2 - Easy)
  // ==========================================
  {
    id: 'fruit_lemon',
    spellings: { tr: 'limon', en: 'lemon', fr: 'citron', es: 'limón', it: 'limone', de: 'zitrone' },
    category: 'fruits',
    emoji: '🍋',
  },
  {
    id: 'fruit_grape',
    spellings: { tr: 'üzüm', en: 'grape', fr: 'raisin', es: 'uva', it: 'uva', de: 'traube' },
    category: 'fruits',
    emoji: '🍇',
  },
  {
    id: 'fruit_cherry',
    spellings: { tr: 'kiraz', en: 'cherry', fr: 'cerise', es: 'cereza', it: 'ciliegia', de: 'kirsche' },
    category: 'fruits',
    emoji: '🍒',
  },
  {
    id: 'fruit_pear',
    spellings: { tr: 'armut', en: 'pear', fr: 'poire', es: 'pera', it: 'pera', de: 'birne' },
    category: 'fruits',
    emoji: '🍐',
  },
  {
    id: 'fruit_peach',
    spellings: { tr: 'şeftali', en: 'peach', fr: 'pêche', es: 'melocotón', it: 'pesca', de: 'pfirsich' },
    category: 'fruits',
    emoji: '🍑',
  },

  // ==========================================
  // FRUITS — CHAPTER 3: Meyve Kaşifleri 🍍 (Level 3 - Medium)
  // ==========================================
  {
    id: 'fruit_pineapple',
    spellings: { tr: 'ananas', en: 'pineapple', fr: 'ananas', es: 'piña', it: 'ananas', de: 'ananas' },
    category: 'fruits',
    emoji: '🍍',
  },
  {
    id: 'fruit_tangerine',
    spellings: { tr: 'mandalina', en: 'tangerine', fr: 'mandarine', es: 'mandarina', it: 'mandarino', de: 'mandarine' },
    category: 'fruits',
    emoji: '🍊',
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
    id: 'fruit_plum',
    spellings: { tr: 'erik', en: 'plum', fr: 'prune', es: 'ciruela', it: 'prugna', de: 'pflaume' },
    category: 'fruits',
    emoji: '🟣',
  },

  // ==========================================
  // FRUITS — CHAPTER 4: Usta Kaşif Meyveleri 🥑 (Level 4 - Challenging)
  // ==========================================
  {
    id: 'fruit_mango',
    spellings: { tr: 'mango', en: 'mango', fr: 'mangue', es: 'mango', it: 'mango', de: 'mango' },
    category: 'fruits',
    emoji: '🥭',
  },
  {
    id: 'fruit_pomegranate',
    spellings: { tr: 'nar', en: 'pomegranate', fr: 'grenade', es: 'granada', it: 'melagrana', de: 'granatapfel' },
    category: 'fruits',
    emoji: '🔴',
  },
  {
    id: 'fruit_avocado',
    spellings: { tr: 'avokado', en: 'avocado', fr: 'avocat', es: 'aguacate', it: 'avocado', de: 'avocado' },
    category: 'fruits',
    emoji: '🥑',
  },
  {
    id: 'fruit_coconut',
    spellings: { tr: 'hindistan cevizi', en: 'coconut', fr: 'noix de coco', es: 'coco', it: 'cocco', de: 'kokosnuss' },
    category: 'fruits',
    emoji: '🥥',
  },
  {
    id: 'fruit_blueberry',
    spellings: { tr: 'yaban mersini', en: 'blueberry', fr: 'myrtille', es: 'arándano', it: 'mirtillo', de: 'heidelbeere' },
    category: 'fruits',
    emoji: '🫐',
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
  // ─── Bayraklar / Flags (Organized by Continent — 4 Chapters x 5 Flags) ─────────
  // --- Chapter 1: Europe (Avrupa Bayrakları) ---
  {
    id: 'flag_tr',
    spellings: { tr: 'türkiye', en: 'turkey', fr: 'turquie', es: 'turquía', it: 'turchia', de: 'türkei' },
    category: 'flags',
    emoji: '🇹🇷',
  },
  {
    id: 'flag_de',
    spellings: { tr: 'almanya', en: 'germany', fr: 'allemagne', es: 'alemania', it: 'germania', de: 'deutschland' },
    category: 'flags',
    emoji: '🇩🇪',
  },
  {
    id: 'flag_it',
    spellings: { tr: 'italya', en: 'italy', fr: 'italie', es: 'italia', it: 'italia', de: 'italien' },
    category: 'flags',
    emoji: '🇮🇹',
  },
  {
    id: 'flag_fr',
    spellings: { tr: 'fransa', en: 'france', fr: 'france', es: 'francia', it: 'francia', de: 'frankreich' },
    category: 'flags',
    emoji: '🇫🇷',
  },
  {
    id: 'flag_es',
    spellings: { tr: 'ispanya', en: 'spain', fr: 'espagne', es: 'españa', it: 'spagna', de: 'spanien' },
    category: 'flags',
    emoji: '🇪🇸',
  },

  // --- Chapter 2: Asia & Middle East (Asya & Orta Doğu Bayrakları) ---
  {
    id: 'flag_jp',
    spellings: { tr: 'japonya', en: 'japan', fr: 'japon', es: 'japón', it: 'giappone', de: 'japan' },
    category: 'flags',
    emoji: '🇯🇵',
  },
  {
    id: 'flag_kr',
    spellings: { tr: 'kore', en: 'korea', fr: 'corée', es: 'corea', it: 'corea', de: 'korea' },
    category: 'flags',
    emoji: '🇰🇷',
  },
  {
    id: 'flag_cn',
    spellings: { tr: 'çin', en: 'china', fr: 'chine', es: 'china', it: 'cina', de: 'china' },
    category: 'flags',
    emoji: '🇨🇳',
  },
  {
    id: 'flag_in',
    spellings: { tr: 'hindistan', en: 'india', fr: 'inde', es: 'india', it: 'india', de: 'indien' },
    category: 'flags',
    emoji: '🇮🇳',
  },
  {
    id: 'flag_az',
    spellings: { tr: 'azerbaycan', en: 'azerbaijan', fr: 'azerbaïdjan', es: 'azerbaiyán', it: 'azerbaigian', de: 'aserbaidschan' },
    category: 'flags',
    emoji: '🇦🇿',
  },

  // --- Chapter 3: The Americas (Amerika Kıtası Bayrakları) ---
  {
    id: 'flag_us',
    spellings: { tr: 'amerika', en: 'usa', fr: 'états-unis', es: 'ee.uu.', it: 'usa', de: 'usa' },
    category: 'flags',
    emoji: '🇺🇸',
  },
  {
    id: 'flag_ca',
    spellings: { tr: 'kanada', en: 'canada', fr: 'canada', es: 'canadá', it: 'canada', de: 'kanada' },
    category: 'flags',
    emoji: '🇨🇦',
  },
  {
    id: 'flag_br',
    spellings: { tr: 'brezilya', en: 'brazil', fr: 'brésil', es: 'brasil', it: 'brasile', de: 'brasilien' },
    category: 'flags',
    emoji: '🇧🇷',
  },
  {
    id: 'flag_mx',
    spellings: { tr: 'meksika', en: 'mexico', fr: 'mexique', es: 'méxico', it: 'messico', de: 'mexiko' },
    category: 'flags',
    emoji: '🇲🇽',
  },
  {
    id: 'flag_ar',
    spellings: { tr: 'arjantin', en: 'argentina', fr: 'argentine', es: 'argentina', it: 'argentina', de: 'argentinien' },
    category: 'flags',
    emoji: '🇦🇷',
  },

  // --- Chapter 4: Africa & Oceania (Afrika & Okyanusya Bayrakları) ---
  {
    id: 'flag_eg',
    spellings: { tr: 'mısır', en: 'egypt', fr: 'égypte', es: 'egipto', it: 'egitto', de: 'ägypten' },
    category: 'flags',
    emoji: '🇪🇬',
  },
  {
    id: 'flag_za',
    spellings: { tr: 'güney afrika', en: 'south africa', fr: 'afrique du sud', es: 'sudáfrica', it: 'sudafrica', de: 'südafrika' },
    category: 'flags',
    emoji: '🇿🇦',
  },
  {
    id: 'flag_ke',
    spellings: { tr: 'kenya', en: 'kenya', fr: 'kenya', es: 'kenia', it: 'kenya', de: 'kenia' },
    category: 'flags',
    emoji: '🇰🇪',
  },
  {
    id: 'flag_au',
    spellings: { tr: 'avustralya', en: 'australia', fr: 'australie', es: 'australia', it: 'australia', de: 'australien' },
    category: 'flags',
    emoji: '🇦🇺',
  },
  {
    id: 'flag_nz',
    spellings: { tr: 'yeni zelanda', en: 'new zealand', fr: 'nouvelle-zélande', es: 'nueva zelanda', it: 'nuova zelanda', de: 'neuseeland' },
    category: 'flags',
    emoji: '🇳🇿',
  },

  // ─── Vücudumuz / Body ────────────────────────────────────────────────────────
  {
    id: 'body_goz',
    spellings: { tr: 'göz', en: 'eye', fr: 'œil', es: 'ojo', it: 'occhio', de: 'auge' },
    category: 'body',
    image: require('../assets/images/body-goz.jpg'),
    emoji: '👁️',
  },
  {
    id: 'body_el',
    spellings: { tr: 'el', en: 'hand', fr: 'main', es: 'mano', it: 'mano', de: 'hand' },
    category: 'body',
    image: require('../assets/images/body-el.jpg'),
    emoji: '✋',
  },
  {
    id: 'body_dis',
    spellings: { tr: 'diş', en: 'tooth', fr: 'dent', es: 'diente', it: 'dente', de: 'zahn' },
    category: 'body',
    image: require('../assets/images/body-dis.jpg'),
    emoji: '🦷',
  },
  {
    id: 'body_kulak',
    spellings: { tr: 'kulak', en: 'ear', fr: 'oreille', es: 'oreja', it: 'orecchio', de: 'ohr' },
    category: 'body',
    image: require('../assets/images/body-kulak.jpg'),
    emoji: '👂',
  },
  {
    id: 'body_burun',
    spellings: { tr: 'burun', en: 'nose', fr: 'nez', es: 'nariz', it: 'naso', de: 'nase' },
    category: 'body',
    image: require('../assets/images/body-burun.jpg'),
    emoji: '👃',
  },
  {
    id: 'body_kalp',
    spellings: { tr: 'kalp', en: 'heart', fr: 'cœur', es: 'corazón', it: 'cuore', de: 'herz' },
    category: 'body',
    image: require('../assets/images/body-kalp.jpg'),
    emoji: '❤️',
  },
  {
    id: 'body_beyin',
    spellings: { tr: 'beyin', en: 'brain', fr: 'cerveau', es: 'cerebro', it: 'cervello', de: 'gehirn' },
    category: 'body',
    image: require('../assets/images/body-beyin.jpg'),
    emoji: '🧠',
  },
  {
    id: 'body_ayak',
    spellings: { tr: 'ayak', en: 'foot', fr: 'pied', es: 'pie', it: 'piede', de: 'fuß' },
    category: 'body',
    image: require('../assets/images/body-ayak.jpg'),
    emoji: '🦶',
  },
  {
    id: 'body_dil',
    spellings: { tr: 'dil', en: 'tongue', fr: 'langue', es: 'lengua', it: 'lingua', de: 'zunge' },
    category: 'body',
    image: require('../assets/images/body-dil.jpg'),
    emoji: '👅',
  },
  {
    id: 'body_sac',
    spellings: { tr: 'saç', en: 'hair', fr: 'cheveux', es: 'pelo', it: 'capelli', de: 'haar' },
    category: 'body',
    image: require('../assets/images/body-sac.jpg'),
    emoji: '🦱',
  },

  // --- Sports / Sporlar ---
  // Chapter 1: Ball Sports (Top Sporları)
  {
    id: 'sport_football',
    spellings: { tr: 'futbol', en: 'soccer', fr: 'football', es: 'fútbol', it: 'calcio', de: 'fussball' },
    category: 'sports',
    emoji: '⚽',
  },
  {
    id: 'sport_basket',
    spellings: { tr: 'basket', en: 'basket', fr: 'basket', es: 'basket', it: 'basket', de: 'basket' },
    category: 'sports',
    emoji: '🏀',
  },
  {
    id: 'sport_tennis',
    spellings: { tr: 'tenis', en: 'tennis', fr: 'tennis', es: 'tenis', it: 'tennis', de: 'tennis' },
    category: 'sports',
    emoji: '🎾',
  },
  {
    id: 'sport_golf',
    spellings: { tr: 'golf', en: 'golf', fr: 'golf', es: 'golf', it: 'golf', de: 'golf' },
    category: 'sports',
    emoji: '⛳',
  },
  {
    id: 'sport_bowling',
    spellings: { tr: 'bovling', en: 'bowling', fr: 'bowling', es: 'bolos', it: 'bowling', de: 'bowling' },
    category: 'sports',
    emoji: '🎳',
  },

  // Chapter 2: Action & Adventure (Hareket & Macera)
  {
    id: 'sport_judo',
    spellings: { tr: 'judo', en: 'judo', fr: 'judo', es: 'judo', it: 'judo', de: 'judo' },
    category: 'sports',
    emoji: '🥋',
  },
  {
    id: 'sport_box',
    spellings: { tr: 'boks', en: 'boxing', fr: 'boxe', es: 'boxeo', it: 'boxe', de: 'boxen' },
    category: 'sports',
    emoji: '🥊',
  },
  {
    id: 'sport_ski',
    spellings: { tr: 'kayak', en: 'ski', fr: 'ski', es: 'esquí', it: 'sci', de: 'ski' },
    category: 'sports',
    emoji: '⛷️',
  },
  {
    id: 'sport_run',
    spellings: { tr: 'koşu', en: 'run', fr: 'course', es: 'correr', it: 'corsa', de: 'lauf' },
    category: 'sports',
    emoji: '🏃',
  },
  {
    id: 'sport_bike',
    spellings: { tr: 'bisiklet', en: 'bike', fr: 'vélo', es: 'bici', it: 'bici', de: 'rad' },
    category: 'sports',
    emoji: '🚴',
  },
];

// Expansion packs are appended so persisted numeric progress for existing words stays valid.
const words: WordItem[] = [...baseWords, ...expandedWords];

export default words;
