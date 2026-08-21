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
 * Kid-friendly word list (ages 4–7): 2–7 letters, English spelling.
 */
const baseWords: WordItem[] = [
  // --- Chapter 1: Farm & Pets ---
  {
    id: 'kedi',
    spellings: { en: 'cat' },
    category: 'animals',
    image: require('../assets/images/cat.png'),
    emoji: '🐱',
  },
  {
    id: 'anim_dog',
    spellings: { en: 'dog' },
    category: 'animals',
    image: require('../assets/images/dog.png'),
    emoji: '🐶',
  },
  {
    id: 'inek',
    spellings: { en: 'cow' },
    category: 'animals',
    image: require('../assets/images/cow.png'),
    emoji: '🐄',
  },
  {
    id: 'anim_horse',
    spellings: { en: 'horse' },
    category: 'animals',
    image: require('../assets/images/horse.png'),
    emoji: '🐴',
  },
  {
    id: 'anim_rabbit',
    spellings: { en: 'rabbit' },
    category: 'animals',
    image: require('../assets/images/rabbit.png'),
    emoji: '🐰',
  },

  // --- Chapter 2: Wild Safari & Forest ---
  {
    id: 'anim_lion',
    spellings: { en: 'lion' },
    category: 'animals',
    image: require('../assets/images/lion.png'),
    emoji: '🦁',
  },
  {
    id: 'fil',
    spellings: { en: 'elephant' },
    category: 'animals',
    image: require('../assets/images/elephant.png'),
    emoji: '🐘',
  },
  {
    id: 'ayi',
    spellings: { en: 'bear' },
    category: 'animals',
    image: require('../assets/images/bear.png'),
    emoji: '🐻',
  },
  {
    id: 'anim_monkey',
    spellings: { en: 'monkey' },
    category: 'animals',
    image: require('../assets/images/monkey.png'),
    emoji: '🐵',
  },
  {
    id: 'anim_giraffe',
    spellings: { en: 'giraffe' },
    category: 'animals',
    image: require('../assets/images/giraffe.png'),
    emoji: '🦒',
  },

  // --- Chapter 3: Birds & Wings ---
  {
    id: 'kus',
    spellings: { en: 'bird' },
    category: 'animals',
    image: require('../assets/images/bird.png'),
    emoji: '🐦',
  },
  {
    id: 'tavuk',
    spellings: { en: 'chicken' },
    category: 'animals',
    image: require('../assets/images/chicken.png'),
    emoji: '🐔',
  },
  {
    id: 'ordek',
    spellings: { en: 'duck' },
    category: 'animals',
    image: require('../assets/images/duck.png'),
    emoji: '🦆',
  },
  {
    id: 'anim_owl',
    spellings: { en: 'owl' },
    category: 'animals',
    image: require('../assets/images/owl.png'),
    emoji: '🦉',
  },
  {
    id: 'anim_eagle',
    spellings: { en: 'eagle' },
    category: 'animals',
    image: require('../assets/images/eagle.png'),
    emoji: '🦅',
  },

  // --- Chapter 4: Sea & Ocean Life ---
  {
    id: 'balik',
    spellings: { en: 'fish' },
    category: 'animals',
    image: require('../assets/images/fish.png'),
    emoji: '🐟',
  },
  {
    id: 'anim_dolphin',
    spellings: { en: 'dolphin' },
    category: 'animals',
    image: require('../assets/images/dolphin.png'),
    emoji: '🐬',
  },
  {
    id: 'anim_whale',
    spellings: { en: 'whale' },
    category: 'animals',
    image: require('../assets/images/whale.png'),
    emoji: '🐳',
  },
  {
    id: 'anim_swan',
    spellings: { en: 'swan' },
    category: 'animals',
    image: require('../assets/images/swan.png'),
    emoji: '🦢',
  },
  {
    id: 'anim_koala',
    spellings: { en: 'koala' },
    category: 'animals',
    image: require('../assets/images/koala.png'),
    emoji: '🐨',
  },

  // --- Chapter 5: Wildlife & Nature ---
  {
    id: 'anim_tiger',
    spellings: { en: 'tiger' },
    category: 'animals',
    image: require('../assets/images/tiger.png'),
    emoji: '🐯',
  },
  {
    id: 'anim_panda',
    spellings: { en: 'panda' },
    category: 'animals',
    image: require('../assets/images/panda.png'),
    emoji: '🐼',
  },
  {
    id: 'anim_wolf',
    spellings: { en: 'wolf' },
    category: 'animals',
    image: require('../assets/images/wolf.png'),
    emoji: '🐺',
  },
  {
    id: 'anim_fox',
    spellings: { en: 'fox' },
    category: 'animals',
    image: require('../assets/images/fox.png'),
    emoji: '🦊',
  },
  {
    id: 'anim_pig',
    spellings: { en: 'pig' },
    category: 'animals',
    image: require('../assets/images/pig.png'),
    emoji: '🐷',
  },

  // --- Chapter 6: Insects & Tiny Friends ---
  {
    id: 'ari',
    spellings: { en: 'bee' },
    category: 'animals',
    image: require('../assets/images/bee.png'),
    emoji: '🐝',
  },
  {
    id: 'anim_ant',
    spellings: { en: 'ant' },
    category: 'animals',
    image: require('../assets/images/ant.png'),
    emoji: '🐜',
  },
  {
    id: 'anim_worm',
    spellings: { en: 'worm' },
    category: 'animals',
    image: require('../assets/images/worm.png'),
    emoji: '🐛',
  },
  {
    id: 'anim_mouse',
    spellings: { en: 'mouse' },
    category: 'animals',
    image: require('../assets/images/mouse.png'),
    emoji: '🐭',
  },
  {
    id: 'anim_hamster',
    spellings: { en: 'hamster' },
    category: 'animals',
    image: require('../assets/images/hamster.png'),
    emoji: '🐹',
  },

  // ==========================================
  // FRUITS — CHAPTER 1: Favorite Fruits (Level 1)
  // ==========================================
  {
    id: 'elma',
    spellings: { en: 'apple' },
    category: 'fruits',
    image: require('../assets/images/apple.png'),
    emoji: '🍎',
  },
  {
    id: 'fruit_banana',
    spellings: { en: 'banana' },
    category: 'fruits',
    image: require('../assets/images/banana.png'),
    emoji: '🍌',
  },
  {
    id: 'fruit_strawberry',
    spellings: { en: 'strawberry' },
    category: 'fruits',
    image: require('../assets/images/strawberry.png'),
    emoji: '🍓',
  },
  {
    id: 'fruit_orange',
    spellings: { en: 'orange' },
    category: 'fruits',
    image: require('../assets/images/orange.png'),
    emoji: '🍊',
  },
  {
    id: 'fruit_watermelon',
    spellings: { en: 'watermelon' },
    category: 'fruits',
    image: require('../assets/images/watermelon.png'),
    emoji: '🍉',
  },

  // ==========================================
  // FRUITS — CHAPTER 2: Familiar Bites (Level 2)
  // ==========================================
  {
    id: 'fruit_lemon',
    spellings: { en: 'lemon' },
    category: 'fruits',
    image: require('../assets/images/lemon.png'),
    emoji: '🍋',
  },
  {
    id: 'fruit_grape',
    spellings: { en: 'grape' },
    category: 'fruits',
    image: require('../assets/images/grape.png'),
    emoji: '🍇',
  },
  {
    id: 'fruit_cherry',
    spellings: { en: 'cherry' },
    category: 'fruits',
    image: require('../assets/images/cherry.png'),
    emoji: '🍒',
  },
  {
    id: 'fruit_pear',
    spellings: { en: 'pear' },
    category: 'fruits',
    image: require('../assets/images/pear.png'),
    emoji: '🍐',
  },
  {
    id: 'fruit_peach',
    spellings: { en: 'peach' },
    category: 'fruits',
    image: require('../assets/images/peach.png'),
    emoji: '🍑',
  },

  // ==========================================
  // FRUITS — CHAPTER 3: Fruit Explorers (Level 3)
  // ==========================================
  {
    id: 'fruit_pineapple',
    spellings: { en: 'pineapple' },
    category: 'fruits',
    image: require('../assets/images/pineapple.png'),
    emoji: '🍍',
  },
  {
    id: 'fruit_tangerine',
    spellings: { en: 'tangerine' },
    category: 'fruits',
    image: require('../assets/images/tangerine.png'),
    emoji: '🍊',
  },
  {
    id: 'fruit_melon',
    spellings: { en: 'melon' },
    category: 'fruits',
    image: require('../assets/images/melon.png'),
    emoji: '🍈',
  },
  {
    id: 'fruit_kiwi',
    spellings: { en: 'kiwi' },
    category: 'fruits',
    image: require('../assets/images/kiwi.png'),
    emoji: '🥝',
  },
  {
    id: 'fruit_plum',
    spellings: { en: 'plum' },
    category: 'fruits',
    image: require('../assets/images/plum.png'),
    emoji: '🟣',
  },

  // ==========================================
  // FRUITS — CHAPTER 4: Master Fruit Journey (Level 4)
  // ==========================================
  {
    id: 'fruit_mango',
    spellings: { en: 'mango' },
    category: 'fruits',
    image: require('../assets/images/mango.png'),
    emoji: '🥭',
  },
  {
    id: 'fruit_pomegranate',
    spellings: { en: 'pomegranate' },
    category: 'fruits',
    image: require('../assets/images/pomegranate.png'),
    emoji: '🔴',
  },
  {
    id: 'fruit_avocado',
    spellings: { en: 'avocado' },
    category: 'fruits',
    image: require('../assets/images/avocado.png'),
    emoji: '🥑',
  },
  {
    id: 'fruit_coconut',
    spellings: { en: 'coconut' },
    category: 'fruits',
    image: require('../assets/images/coconut.png'),
    emoji: '🥥',
  },
  {
    id: 'fruit_blueberry',
    spellings: { en: 'blueberry' },
    category: 'fruits',
    image: require('../assets/images/blueberry.png'),
    emoji: '🫐',
  },

  // --- Numbers ---
  {
    id: 'n6',
    spellings: { en: 'six' },
    category: 'numbers',
    emoji: '6',
  },
  {
    id: 'n5',
    spellings: { en: 'five' },
    category: 'numbers',
    emoji: '5',
  },
  {
    id: 'n1',
    spellings: { en: 'one' },
    category: 'numbers',
    emoji: '1',
  },
  {
    id: 'n9',
    spellings: { en: 'nine' },
    category: 'numbers',
    emoji: '9',
  },
  {
    id: 'n4',
    spellings: { en: 'four' },
    category: 'numbers',
    emoji: '4',
  },
  {
    id: 'n2',
    spellings: { en: 'two' },
    category: 'numbers',
    emoji: '2',
  },
  {
    id: 'n10',
    spellings: { en: 'ten' },
    category: 'numbers',
    emoji: '10',
  },
  {
    id: 'n8',
    spellings: { en: 'eight' },
    category: 'numbers',
    emoji: '8',
  },
  {
    id: 'n7',
    spellings: { en: 'seven' },
    category: 'numbers',
    emoji: '7',
  },
  {
    id: 'n3',
    spellings: { en: 'three' },
    category: 'numbers',
    emoji: '3',
  },

  // --- Colors ---
  {
    id: 'red',
    spellings: { en: 'red' },
    category: 'colors',
    swatch: '#FF1E56',
  },
  {
    id: 'blue',
    spellings: { en: 'blue' },
    category: 'colors',
    swatch: '#0088FF',
  },
  {
    id: 'green',
    spellings: { en: 'green' },
    category: 'colors',
    swatch: '#00D06C',
  },
  {
    id: 'yellow',
    spellings: { en: 'yellow' },
    category: 'colors',
    swatch: '#FFD200',
  },
  {
    id: 'orange',
    spellings: { en: 'orange' },
    category: 'colors',
    swatch: '#FF7A00',
  },
  {
    id: 'purple',
    spellings: { en: 'purple' },
    category: 'colors',
    swatch: '#9D4EDD',
  },
  {
    id: 'pink',
    spellings: { en: 'pink' },
    category: 'colors',
    swatch: '#FF2A85',
  },
  {
    id: 'black',
    spellings: { en: 'black' },
    category: 'colors',
    swatch: '#1A1726',
  },
  {
    id: 'white',
    spellings: { en: 'white' },
    category: 'colors',
    swatch: '#FFFFFF',
  },

  // --- Flags ---
  // --- Chapter 1: Europe ---
  {
    id: 'flag_tr',
    spellings: { en: 'turkey' },
    category: 'flags',
    emoji: '🇹🇷',
  },
  {
    id: 'flag_de',
    spellings: { en: 'germany' },
    category: 'flags',
    emoji: '🇩🇪',
  },
  {
    id: 'flag_it',
    spellings: { en: 'italy' },
    category: 'flags',
    emoji: '🇮🇹',
  },
  {
    id: 'flag_fr',
    spellings: { en: 'france' },
    category: 'flags',
    emoji: '🇫🇷',
  },
  {
    id: 'flag_es',
    spellings: { en: 'spain' },
    category: 'flags',
    emoji: '🇪🇸',
  },

  // --- Chapter 2: Asia & Middle East ---
  {
    id: 'flag_jp',
    spellings: { en: 'japan' },
    category: 'flags',
    emoji: '🇯🇵',
  },
  {
    id: 'flag_kr',
    spellings: { en: 'korea' },
    category: 'flags',
    emoji: '🇰🇷',
  },
  {
    id: 'flag_cn',
    spellings: { en: 'china' },
    category: 'flags',
    emoji: '🇨🇳',
  },
  {
    id: 'flag_in',
    spellings: { en: 'india' },
    category: 'flags',
    emoji: '🇮🇳',
  },
  {
    id: 'flag_az',
    spellings: { en: 'azerbaijan' },
    category: 'flags',
    emoji: '🇦🇿',
  },

  // --- Chapter 3: The Americas ---
  {
    id: 'flag_us',
    spellings: { en: 'usa' },
    category: 'flags',
    emoji: '🇺🇸',
  },
  {
    id: 'flag_ca',
    spellings: { en: 'canada' },
    category: 'flags',
    emoji: '🇨🇦',
  },
  {
    id: 'flag_br',
    spellings: { en: 'brazil' },
    category: 'flags',
    emoji: '🇧🇷',
  },
  {
    id: 'flag_mx',
    spellings: { en: 'mexico' },
    category: 'flags',
    emoji: '🇲🇽',
  },
  {
    id: 'flag_ar',
    spellings: { en: 'argentina' },
    category: 'flags',
    emoji: '🇦🇷',
  },

  // --- Chapter 4: Africa & Oceania ---
  {
    id: 'flag_eg',
    spellings: { en: 'egypt' },
    category: 'flags',
    emoji: '🇪🇬',
  },
  {
    id: 'flag_za',
    spellings: { en: 'south africa' },
    category: 'flags',
    emoji: '🇿🇦',
  },
  {
    id: 'flag_ke',
    spellings: { en: 'kenya' },
    category: 'flags',
    emoji: '🇰🇪',
  },
  {
    id: 'flag_au',
    spellings: { en: 'australia' },
    category: 'flags',
    emoji: '🇦🇺',
  },
  {
    id: 'flag_nz',
    spellings: { en: 'new zealand' },
    category: 'flags',
    emoji: '🇳🇿',
  },

  // --- Body ---
  {
    id: 'body_goz',
    spellings: { en: 'eye' },
    category: 'body',
    image: require('../assets/images/eye.png'),
    emoji: '👁️',
  },
  {
    id: 'body_el',
    spellings: { en: 'hand' },
    category: 'body',
    image: require('../assets/images/hand.png'),
    emoji: '✋',
  },
  {
    id: 'body_dis',
    spellings: { en: 'tooth' },
    category: 'body',
    image: require('../assets/images/tooth.png'),
    emoji: '🦷',
  },
  {
    id: 'body_kulak',
    spellings: { en: 'ear' },
    category: 'body',
    image: require('../assets/images/ear.png'),
    emoji: '👂',
  },
  {
    id: 'body_burun',
    spellings: { en: 'nose' },
    category: 'body',
    image: require('../assets/images/nose.png'),
    emoji: '👃',
  },
  {
    id: 'body_kalp',
    spellings: { en: 'heart' },
    category: 'body',
    image: require('../assets/images/heart.png'),
    emoji: '❤️',
  },
  {
    id: 'body_beyin',
    spellings: { en: 'brain' },
    category: 'body',
    image: require('../assets/images/brain.png'),
    emoji: '🧠',
  },
  {
    id: 'body_ayak',
    spellings: { en: 'foot' },
    category: 'body',
    image: require('../assets/images/foot.png'),
    emoji: '🦶',
  },
  {
    id: 'body_dil',
    spellings: { en: 'tongue' },
    category: 'body',
    image: require('../assets/images/tongue.png'),
    emoji: '👅',
  },
  {
    id: 'body_sac',
    spellings: { en: 'hair' },
    category: 'body',
    image: require('../assets/images/hair.png'),
    emoji: '🦱',
  },
];

// Expansion packs are appended so persisted numeric progress for existing words stays valid.
const words: WordItem[] = [...baseWords, ...expandedWords];

export default words;
