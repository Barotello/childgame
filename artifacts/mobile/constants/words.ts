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

// Original words that have images
const originalWords: WordItem[] = [
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

const emojiWords: WordItem[] = [
  {
    "id": "fruit_apple",
    "emoji": "🍎",
    "category": "fruits",
    "spellings": {
      "tr": "elma",
      "en": "apple",
      "fr": "pomme",
      "es": "manzana",
      "it": "mela",
      "de": "apfel"
    }
  },
  {
    "id": "fruit_pear",
    "emoji": "🍐",
    "category": "fruits",
    "spellings": {
      "tr": "armut",
      "en": "pear",
      "fr": "poire",
      "es": "pera",
      "it": "pera",
      "de": "birne"
    }
  },
  {
    "id": "fruit_orange",
    "emoji": "🍊",
    "category": "fruits",
    "spellings": {
      "tr": "portakal",
      "en": "orange",
      "fr": "orange",
      "es": "naranja",
      "it": "arancia",
      "de": "orange"
    }
  },
  {
    "id": "fruit_lemon",
    "emoji": "🍋",
    "category": "fruits",
    "spellings": {
      "tr": "limon",
      "en": "lemon",
      "fr": "citron",
      "es": "limón",
      "it": "limone",
      "de": "zitrone"
    }
  },
  {
    "id": "fruit_banana",
    "emoji": "🍌",
    "category": "fruits",
    "spellings": {
      "tr": "muz",
      "en": "banana",
      "fr": "banane",
      "es": "plátano",
      "it": "banana",
      "de": "banane"
    }
  },
  {
    "id": "fruit_watermelon",
    "emoji": "🍉",
    "category": "fruits",
    "spellings": {
      "tr": "karpuz",
      "en": "watermelon",
      "fr": "pastèque",
      "es": "sandía",
      "it": "anguria",
      "de": "wassermelone"
    }
  },
  {
    "id": "fruit_grape",
    "emoji": "🍇",
    "category": "fruits",
    "spellings": {
      "tr": "üzüm",
      "en": "grape",
      "fr": "raisin",
      "es": "uva",
      "it": "uva",
      "de": "traube"
    }
  },
  {
    "id": "fruit_strawberry",
    "emoji": "🍓",
    "category": "fruits",
    "spellings": {
      "tr": "çilek",
      "en": "strawberry",
      "fr": "fraise",
      "es": "fresa",
      "it": "fragola",
      "de": "erdbeere"
    }
  },
  {
    "id": "fruit_melon",
    "emoji": "🍈",
    "category": "fruits",
    "spellings": {
      "tr": "kavun",
      "en": "melon",
      "fr": "melon",
      "es": "melón",
      "it": "melone",
      "de": "melone"
    }
  },
  {
    "id": "fruit_cherry",
    "emoji": "🍒",
    "category": "fruits",
    "spellings": {
      "tr": "kiraz",
      "en": "cherry",
      "fr": "cerise",
      "es": "cereza",
      "it": "ciliegia",
      "de": "kirsche"
    }
  },
  {
    "id": "fruit_peach",
    "emoji": "🍑",
    "category": "fruits",
    "spellings": {
      "tr": "şeftali",
      "en": "peach",
      "fr": "pêche",
      "es": "melocotón",
      "it": "pesca",
      "de": "pfirsich"
    }
  },
  {
    "id": "fruit_mango",
    "emoji": "🥭",
    "category": "fruits",
    "spellings": {
      "tr": "mango",
      "en": "mango",
      "fr": "mangue",
      "es": "mango",
      "it": "mango",
      "de": "mango"
    }
  },
  {
    "id": "fruit_pineapple",
    "emoji": "🍍",
    "category": "fruits",
    "spellings": {
      "tr": "ananas",
      "en": "pineapple",
      "fr": "ananas",
      "es": "piña",
      "it": "ananas",
      "de": "ananas"
    }
  },
  {
    "id": "fruit_coconut",
    "emoji": "🥥",
    "category": "fruits",
    "spellings": {
      "tr": "hindistan cevizi",
      "en": "coconut",
      "fr": "noix de coco",
      "es": "coco",
      "it": "cocco",
      "de": "kokosnuss"
    }
  },
  {
    "id": "fruit_kiwi",
    "emoji": "🥝",
    "category": "fruits",
    "spellings": {
      "tr": "kivi",
      "en": "kiwi",
      "fr": "kiwi",
      "es": "kiwi",
      "it": "kiwi",
      "de": "kiwi"
    }
  },
  {
    "id": "fruit_tomato",
    "emoji": "🍅",
    "category": "fruits",
    "spellings": {
      "tr": "domates",
      "en": "tomato",
      "fr": "tomate",
      "es": "tomate",
      "it": "pomodoro",
      "de": "tomate"
    }
  },
  {
    "id": "fruit_eggplant",
    "emoji": "🍆",
    "category": "fruits",
    "spellings": {
      "tr": "patlıcan",
      "en": "eggplant",
      "fr": "aubergine",
      "es": "berenjena",
      "it": "melanzana",
      "de": "aubergine"
    }
  },
  {
    "id": "fruit_avocado",
    "emoji": "🥑",
    "category": "fruits",
    "spellings": {
      "tr": "avokado",
      "en": "avocado",
      "fr": "avocat",
      "es": "aguacate",
      "it": "avocado",
      "de": "avocado"
    }
  },
  {
    "id": "fruit_broccoli",
    "emoji": "🥦",
    "category": "fruits",
    "spellings": {
      "tr": "brokoli",
      "en": "broccoli",
      "fr": "brocoli",
      "es": "brócoli",
      "it": "broccoli",
      "de": "brokkoli"
    }
  },
  {
    "id": "fruit_cucumber",
    "emoji": "🥒",
    "category": "fruits",
    "spellings": {
      "tr": "salatalık",
      "en": "cucumber",
      "fr": "concombre",
      "es": "pepino",
      "it": "cetriolo",
      "de": "gurke"
    }
  },
  {
    "id": "fruit_carrot",
    "emoji": "🥕",
    "category": "fruits",
    "spellings": {
      "tr": "havuç",
      "en": "carrot",
      "fr": "carotte",
      "es": "zanahoria",
      "it": "carota",
      "de": "karotte"
    }
  },
  {
    "id": "fruit_corn",
    "emoji": "🌽",
    "category": "fruits",
    "spellings": {
      "tr": "mısır",
      "en": "corn",
      "fr": "maïs",
      "es": "maíz",
      "it": "mais",
      "de": "mais"
    }
  },
  {
    "id": "fruit_pepper",
    "emoji": "🌶️",
    "category": "fruits",
    "spellings": {
      "tr": "biber",
      "en": "pepper",
      "fr": "poivron",
      "es": "pimiento",
      "it": "peperone",
      "de": "paprika"
    }
  },
  {
    "id": "fruit_potato",
    "emoji": "🥔",
    "category": "fruits",
    "spellings": {
      "tr": "patates",
      "en": "potato",
      "fr": "pomme de terre",
      "es": "patata",
      "it": "patata",
      "de": "kartoffel"
    }
  },
  {
    "id": "fruit_sweet_potato",
    "emoji": "🍠",
    "category": "fruits",
    "spellings": {
      "tr": "tatlı patates",
      "en": "sweet potato",
      "fr": "patate douce",
      "es": "batata",
      "it": "patata dolce",
      "de": "süßkartoffel"
    }
  },
  {
    "id": "fruit_garlic",
    "emoji": "🧄",
    "category": "fruits",
    "spellings": {
      "tr": "sarımsak",
      "en": "garlic",
      "fr": "ail",
      "es": "ajo",
      "it": "aglio",
      "de": "knoblauch"
    }
  },
  {
    "id": "fruit_onion",
    "emoji": "🧅",
    "category": "fruits",
    "spellings": {
      "tr": "soğan",
      "en": "onion",
      "fr": "oignon",
      "es": "cebolla",
      "it": "cipolla",
      "de": "zwiebel"
    }
  },
  {
    "id": "fruit_mushroom",
    "emoji": "🍄",
    "category": "fruits",
    "spellings": {
      "tr": "mantar",
      "en": "mushroom",
      "fr": "champignon",
      "es": "champiñón",
      "it": "fungo",
      "de": "pilz"
    }
  },
  {
    "id": "fruit_peanut",
    "emoji": "🥜",
    "category": "fruits",
    "spellings": {
      "tr": "fıstık",
      "en": "peanut",
      "fr": "cacahuète",
      "es": "cacahuete",
      "it": "arachide",
      "de": "erdnuss"
    }
  },
  {
    "id": "fruit_chestnut",
    "emoji": "🌰",
    "category": "fruits",
    "spellings": {
      "tr": "kestane",
      "en": "chestnut",
      "fr": "châtaigne",
      "es": "castaña",
      "it": "castagna",
      "de": "kastanie"
    }
  },
  {
    "id": "fruit_apple_green",
    "emoji": "🍏",
    "category": "fruits",
    "spellings": {
      "tr": "yeşil elma",
      "en": "green apple",
      "fr": "pomme verte",
      "es": "manzana verde",
      "it": "mela verde",
      "de": "grüner apfel"
    }
  },
  {
    "id": "fruit_olive",
    "emoji": "🫒",
    "category": "fruits",
    "spellings": {
      "tr": "zeytin",
      "en": "olive",
      "fr": "olive",
      "es": "aceituna",
      "it": "oliva",
      "de": "olive"
    }
  },
  {
    "id": "fruit_blueberry",
    "emoji": "🫐",
    "category": "fruits",
    "spellings": {
      "tr": "yaban mersini",
      "en": "blueberry",
      "fr": "myrtille",
      "es": "arándano",
      "it": "mirtillo",
      "de": "blaubeere"
    }
  },
  {
    "id": "fruit_bell_pepper",
    "emoji": "🫑",
    "category": "fruits",
    "spellings": {
      "tr": "dolmalık biber",
      "en": "bell pepper",
      "fr": "poivron doux",
      "es": "pimiento",
      "it": "peperone",
      "de": "paprika"
    }
  },
  {
    "id": "fruit_beans",
    "emoji": "🫘",
    "category": "fruits",
    "spellings": {
      "tr": "fasulye",
      "en": "beans",
      "fr": "haricots",
      "es": "frijoles",
      "it": "fagioli",
      "de": "bohnen"
    }
  },
  {
    "id": "fruit_peas",
    "emoji": "🫛",
    "category": "fruits",
    "spellings": {
      "tr": "bezelye",
      "en": "peas",
      "fr": "petits pois",
      "es": "guisantes",
      "it": "piselli",
      "de": "erbsen"
    }
  },
  {
    "id": "fruit_pumpkin",
    "emoji": "🎃",
    "category": "fruits",
    "spellings": {
      "tr": "balkabağı",
      "en": "pumpkin",
      "fr": "citrouille",
      "es": "calabaza",
      "it": "zucca",
      "de": "kürbis"
    }
  },
  {
    "id": "fruit_cabbage",
    "emoji": "🥬",
    "category": "fruits",
    "spellings": {
      "tr": "lahana",
      "en": "cabbage",
      "fr": "chou",
      "es": "repollo",
      "it": "cavolo",
      "de": "kohl"
    }
  },
  {
    "id": "anim_dog",
    "emoji": "🐶",
    "category": "animals",
    "spellings": {
      "tr": "köpek",
      "en": "dog",
      "fr": "chien",
      "es": "perro",
      "it": "cane",
      "de": "hund"
    }
  },
  {
    "id": "anim_cat",
    "emoji": "🐱",
    "category": "animals",
    "spellings": {
      "tr": "kedi",
      "en": "cat",
      "fr": "chat",
      "es": "gato",
      "it": "gatto",
      "de": "katze"
    }
  },
  {
    "id": "anim_mouse",
    "emoji": "🐭",
    "category": "animals",
    "spellings": {
      "tr": "fare",
      "en": "mouse",
      "fr": "souris",
      "es": "ratón",
      "it": "topo",
      "de": "maus"
    }
  },
  {
    "id": "anim_hamster",
    "emoji": "🐹",
    "category": "animals",
    "spellings": {
      "tr": "hamster",
      "en": "hamster",
      "fr": "hamster",
      "es": "hámster",
      "it": "criceto",
      "de": "hamster"
    }
  },
  {
    "id": "anim_rabbit",
    "emoji": "🐰",
    "category": "animals",
    "spellings": {
      "tr": "tavşan",
      "en": "rabbit",
      "fr": "lapin",
      "es": "conejo",
      "it": "coniglio",
      "de": "kaninchen"
    }
  },
  {
    "id": "anim_fox",
    "emoji": "🦊",
    "category": "animals",
    "spellings": {
      "tr": "tilki",
      "en": "fox",
      "fr": "renard",
      "es": "zorro",
      "it": "volpe",
      "de": "fuchs"
    }
  },
  {
    "id": "anim_bear",
    "emoji": "🐻",
    "category": "animals",
    "spellings": {
      "tr": "ayı",
      "en": "bear",
      "fr": "ours",
      "es": "oso",
      "it": "orso",
      "de": "bär"
    }
  },
  {
    "id": "anim_panda",
    "emoji": "🐼",
    "category": "animals",
    "spellings": {
      "tr": "panda",
      "en": "panda",
      "fr": "panda",
      "es": "panda",
      "it": "panda",
      "de": "panda"
    }
  },
  {
    "id": "anim_polar_bear",
    "emoji": "🐻‍❄️",
    "category": "animals",
    "spellings": {
      "tr": "kutup ayısı",
      "en": "polar bear",
      "fr": "ours polaire",
      "es": "oso polar",
      "it": "orso polare",
      "de": "eisbär"
    }
  },
  {
    "id": "anim_koala",
    "emoji": "🐨",
    "category": "animals",
    "spellings": {
      "tr": "koala",
      "en": "koala",
      "fr": "koala",
      "es": "koala",
      "it": "koala",
      "de": "koala"
    }
  },
  {
    "id": "anim_tiger",
    "emoji": "🐯",
    "category": "animals",
    "spellings": {
      "tr": "kaplan",
      "en": "tiger",
      "fr": "tigre",
      "es": "tigre",
      "it": "tigre",
      "de": "tiger"
    }
  },
  {
    "id": "anim_lion",
    "emoji": "🦁",
    "category": "animals",
    "spellings": {
      "tr": "aslan",
      "en": "lion",
      "fr": "lion",
      "es": "león",
      "it": "leone",
      "de": "löwe"
    }
  },
  {
    "id": "anim_cow",
    "emoji": "🐮",
    "category": "animals",
    "spellings": {
      "tr": "inek",
      "en": "cow",
      "fr": "vache",
      "es": "vaca",
      "it": "mucca",
      "de": "kuh"
    }
  },
  {
    "id": "anim_pig",
    "emoji": "🐷",
    "category": "animals",
    "spellings": {
      "tr": "domuz",
      "en": "pig",
      "fr": "cochon",
      "es": "cerdo",
      "it": "maiale",
      "de": "schwein"
    }
  },
  {
    "id": "anim_frog",
    "emoji": "🐸",
    "category": "animals",
    "spellings": {
      "tr": "kurbağa",
      "en": "frog",
      "fr": "grenouille",
      "es": "rana",
      "it": "rana",
      "de": "frosch"
    }
  },
  {
    "id": "anim_monkey",
    "emoji": "🐵",
    "category": "animals",
    "spellings": {
      "tr": "maymun",
      "en": "monkey",
      "fr": "singe",
      "es": "mono",
      "it": "scimmia",
      "de": "affe"
    }
  },
  {
    "id": "anim_chicken",
    "emoji": "🐔",
    "category": "animals",
    "spellings": {
      "tr": "tavuk",
      "en": "chicken",
      "fr": "poulet",
      "es": "pollo",
      "it": "pollo",
      "de": "huhn"
    }
  },
  {
    "id": "anim_penguin",
    "emoji": "🐧",
    "category": "animals",
    "spellings": {
      "tr": "penguen",
      "en": "penguin",
      "fr": "pingouin",
      "es": "pingüino",
      "it": "pinguino",
      "de": "pinguin"
    }
  },
  {
    "id": "anim_bird",
    "emoji": "🐦",
    "category": "animals",
    "spellings": {
      "tr": "kuş",
      "en": "bird",
      "fr": "oiseau",
      "es": "pájaro",
      "it": "uccello",
      "de": "vogel"
    }
  },
  {
    "id": "anim_duck",
    "emoji": "🦆",
    "category": "animals",
    "spellings": {
      "tr": "ördek",
      "en": "duck",
      "fr": "canard",
      "es": "pato",
      "it": "anatra",
      "de": "ente"
    }
  },
  {
    "id": "anim_eagle",
    "emoji": "🦅",
    "category": "animals",
    "spellings": {
      "tr": "kartal",
      "en": "eagle",
      "fr": "aigle",
      "es": "águila",
      "it": "aquila",
      "de": "adler"
    }
  },
  {
    "id": "anim_owl",
    "emoji": "🦉",
    "category": "animals",
    "spellings": {
      "tr": "baykuş",
      "en": "owl",
      "fr": "hibou",
      "es": "búho",
      "it": "gufo",
      "de": "eule"
    }
  },
  {
    "id": "anim_bat",
    "emoji": "🦇",
    "category": "animals",
    "spellings": {
      "tr": "yarasa",
      "en": "bat",
      "fr": "chauve-souris",
      "es": "murciélago",
      "it": "pipistrello",
      "de": "fledermaus"
    }
  },
  {
    "id": "anim_wolf",
    "emoji": "🐺",
    "category": "animals",
    "spellings": {
      "tr": "kurt",
      "en": "wolf",
      "fr": "loup",
      "es": "lobo",
      "it": "lupo",
      "de": "wolf"
    }
  },
  {
    "id": "anim_boar",
    "emoji": "🐗",
    "category": "animals",
    "spellings": {
      "tr": "yaban domuzu",
      "en": "boar",
      "fr": "sanglier",
      "es": "jabalí",
      "it": "cinghiale",
      "de": "wildschwein"
    }
  },
  {
    "id": "anim_horse",
    "emoji": "🐴",
    "category": "animals",
    "spellings": {
      "tr": "at",
      "en": "horse",
      "fr": "cheval",
      "es": "caballo",
      "it": "cavallo",
      "de": "pferd"
    }
  },
  {
    "id": "anim_unicorn",
    "emoji": "🦄",
    "category": "animals",
    "spellings": {
      "tr": "tekboynuz",
      "en": "unicorn",
      "fr": "licorne",
      "es": "unicornio",
      "it": "unicorno",
      "de": "einhorn"
    }
  },
  {
    "id": "anim_bee",
    "emoji": "🐝",
    "category": "animals",
    "spellings": {
      "tr": "arı",
      "en": "bee",
      "fr": "abeille",
      "es": "abeja",
      "it": "ape",
      "de": "biene"
    }
  },
  {
    "id": "anim_worm",
    "emoji": "🐛",
    "category": "animals",
    "spellings": {
      "tr": "tırtıl",
      "en": "worm",
      "fr": "ver",
      "es": "gusano",
      "it": "verme",
      "de": "raupe"
    }
  },
  {
    "id": "anim_butterfly",
    "emoji": "🦋",
    "category": "animals",
    "spellings": {
      "tr": "kelebek",
      "en": "butterfly",
      "fr": "papillon",
      "es": "mariposa",
      "it": "farfalla",
      "de": "schmetterling"
    }
  },
  {
    "id": "anim_snail",
    "emoji": "🐌",
    "category": "animals",
    "spellings": {
      "tr": "salyangoz",
      "en": "snail",
      "fr": "escargot",
      "es": "caracol",
      "it": "lumaca",
      "de": "schnecke"
    }
  },
  {
    "id": "anim_beetle",
    "emoji": "🐞",
    "category": "animals",
    "spellings": {
      "tr": "uğur böceği",
      "en": "ladybug",
      "fr": "coccinelle",
      "es": "mariquita",
      "it": "coccinella",
      "de": "marienkäfer"
    }
  },
  {
    "id": "anim_ant",
    "emoji": "🐜",
    "category": "animals",
    "spellings": {
      "tr": "karınca",
      "en": "ant",
      "fr": "fourmi",
      "es": "hormiga",
      "it": "formica",
      "de": "ameise"
    }
  },
  {
    "id": "anim_mosquito",
    "emoji": "🦟",
    "category": "animals",
    "spellings": {
      "tr": "sivrisinek",
      "en": "mosquito",
      "fr": "moustique",
      "es": "mosquito",
      "it": "zanzara",
      "de": "mücke"
    }
  },
  {
    "id": "anim_turtle",
    "emoji": "🐢",
    "category": "animals",
    "spellings": {
      "tr": "kaplumbağa",
      "en": "turtle",
      "fr": "tortue",
      "es": "tortuga",
      "it": "tartaruga",
      "de": "schildkröte"
    }
  },
  {
    "id": "anim_snake",
    "emoji": "🐍",
    "category": "animals",
    "spellings": {
      "tr": "yılan",
      "en": "snake",
      "fr": "serpent",
      "es": "serpiente",
      "it": "serpente",
      "de": "schlange"
    }
  },
  {
    "id": "anim_octopus",
    "emoji": "🐙",
    "category": "animals",
    "spellings": {
      "tr": "ahtapot",
      "en": "octopus",
      "fr": "pieuvre",
      "es": "pulpo",
      "it": "polpo",
      "de": "oktopus"
    }
  },
  {
    "id": "anim_squid",
    "emoji": "🦑",
    "category": "animals",
    "spellings": {
      "tr": "kalamar",
      "en": "squid",
      "fr": "calmar",
      "es": "calamar",
      "it": "calamaro",
      "de": "tintenfisch"
    }
  },
  {
    "id": "anim_shrimp",
    "emoji": "🦐",
    "category": "animals",
    "spellings": {
      "tr": "karides",
      "en": "shrimp",
      "fr": "crevette",
      "es": "camarón",
      "it": "gamberetto",
      "de": "garnele"
    }
  },
  {
    "id": "anim_lobster",
    "emoji": "🦞",
    "category": "animals",
    "spellings": {
      "tr": "ıstakoz",
      "en": "lobster",
      "fr": "homard",
      "es": "langosta",
      "it": "aragosta",
      "de": "hummer"
    }
  },
  {
    "id": "anim_crab",
    "emoji": "🦀",
    "category": "animals",
    "spellings": {
      "tr": "yengeç",
      "en": "crab",
      "fr": "crabe",
      "es": "cangrejo",
      "it": "granchio",
      "de": "krabbe"
    }
  },
  {
    "id": "anim_fish",
    "emoji": "🐟",
    "category": "animals",
    "spellings": {
      "tr": "balık",
      "en": "fish",
      "fr": "poisson",
      "es": "pez",
      "it": "pesce",
      "de": "fisch"
    }
  },
  {
    "id": "anim_blowfish",
    "emoji": "🐡",
    "category": "animals",
    "spellings": {
      "tr": "balon balığı",
      "en": "blowfish",
      "fr": "poisson-globe",
      "es": "pez globo",
      "it": "pesce palla",
      "de": "kugelfisch"
    }
  },
  {
    "id": "anim_shark",
    "emoji": "🦈",
    "category": "animals",
    "spellings": {
      "tr": "köpek balığı",
      "en": "shark",
      "fr": "requin",
      "es": "tiburón",
      "it": "squalo",
      "de": "hai"
    }
  },
  {
    "id": "anim_dolphin",
    "emoji": "🐬",
    "category": "animals",
    "spellings": {
      "tr": "yunus",
      "en": "dolphin",
      "fr": "dauphin",
      "es": "delfín",
      "it": "delfino",
      "de": "delfin"
    }
  },
  {
    "id": "anim_whale",
    "emoji": "🐳",
    "category": "animals",
    "spellings": {
      "tr": "balina",
      "en": "whale",
      "fr": "baleine",
      "es": "ballena",
      "it": "balena",
      "de": "wal"
    }
  },
  {
    "id": "anim_crocodile",
    "emoji": "🐊",
    "category": "animals",
    "spellings": {
      "tr": "timsah",
      "en": "crocodile",
      "fr": "crocodile",
      "es": "cocodrilo",
      "it": "coccodrillo",
      "de": "krokodil"
    }
  },
  {
    "id": "anim_camel",
    "emoji": "🐪",
    "category": "animals",
    "spellings": {
      "tr": "deve",
      "en": "camel",
      "fr": "chameau",
      "es": "camello",
      "it": "cammello",
      "de": "kamel"
    }
  },
  {
    "id": "anim_giraffe",
    "emoji": "🦒",
    "category": "animals",
    "spellings": {
      "tr": "zürafa",
      "en": "giraffe",
      "fr": "girafe",
      "es": "jirafa",
      "it": "giraffa",
      "de": "giraffe"
    }
  },
  {
    "id": "anim_elephant",
    "emoji": "🐘",
    "category": "animals",
    "spellings": {
      "tr": "fil",
      "en": "elephant",
      "fr": "éléphant",
      "es": "elefante",
      "it": "elefante",
      "de": "elefant"
    }
  },
  {
    "id": "anim_rhino",
    "emoji": "🦏",
    "category": "animals",
    "spellings": {
      "tr": "gergedan",
      "en": "rhino",
      "fr": "rhinocéros",
      "es": "rinoceronte",
      "it": "rinoceronte",
      "de": "nashorn"
    }
  },
  {
    "id": "anim_hippo",
    "emoji": "🦛",
    "category": "animals",
    "spellings": {
      "tr": "su aygırı",
      "en": "hippo",
      "fr": "hippopotame",
      "es": "hipopótamo",
      "it": "ippopotamo",
      "de": "nilpferd"
    }
  },
  {
    "id": "anim_mouse_face",
    "emoji": "🐁",
    "category": "animals",
    "spellings": {
      "tr": "fare",
      "en": "mouse",
      "fr": "souris",
      "es": "ratón",
      "it": "topo",
      "de": "maus"
    }
  },
  {
    "id": "anim_swan",
    "emoji": "🦢",
    "category": "animals",
    "spellings": {
      "tr": "kuğu",
      "en": "swan",
      "fr": "cygne",
      "es": "cisne",
      "it": "cigno",
      "de": "schwan"
    }
  },
  {
    "id": "anim_peacock",
    "emoji": "🦚",
    "category": "animals",
    "spellings": {
      "tr": "tavus kuşu",
      "en": "peacock",
      "fr": "paon",
      "es": "pavo real",
      "it": "pavone",
      "de": "pfau"
    }
  },
  {
    "id": "anim_parrot",
    "emoji": "🦜",
    "category": "animals",
    "spellings": {
      "tr": "papağan",
      "en": "parrot",
      "fr": "perroquet",
      "es": "loro",
      "it": "pappagallo",
      "de": "papagei"
    }
  },
  {
    "id": "flag_ad",
    "spellings": {
      "tr": "andorra",
      "en": "andorra",
      "fr": "andorre",
      "es": "andorra",
      "it": "andorra",
      "de": "andorra"
    },
    "category": "flags",
    "emoji": "🇦🇩"
  },
  {
    "id": "flag_af",
    "spellings": {
      "tr": "afganistan",
      "en": "afghanistan",
      "fr": "afghanistan",
      "es": "afganistán",
      "it": "afghanistan",
      "de": "afghanistan"
    },
    "category": "flags",
    "emoji": "🇦🇫"
  },
  {
    "id": "flag_al",
    "spellings": {
      "tr": "arnavutluk",
      "en": "albania",
      "fr": "albanie",
      "es": "albania",
      "it": "albania",
      "de": "albanien"
    },
    "category": "flags",
    "emoji": "🇦🇱"
  },
  {
    "id": "flag_am",
    "spellings": {
      "tr": "ermenistan",
      "en": "armenia",
      "fr": "arménie",
      "es": "armenia",
      "it": "armenia",
      "de": "armenien"
    },
    "category": "flags",
    "emoji": "🇦🇲"
  },
  {
    "id": "flag_ao",
    "spellings": {
      "tr": "angola",
      "en": "angola",
      "fr": "angola",
      "es": "angola",
      "it": "angola",
      "de": "angola"
    },
    "category": "flags",
    "emoji": "🇦🇴"
  },
  {
    "id": "flag_ar",
    "spellings": {
      "tr": "arjantin",
      "en": "argentina",
      "fr": "argentine",
      "es": "argentina",
      "it": "argentina",
      "de": "argentinien"
    },
    "category": "flags",
    "emoji": "🇦🇷"
  },
  {
    "id": "flag_at",
    "spellings": {
      "tr": "avusturya",
      "en": "austria",
      "fr": "autriche",
      "es": "austria",
      "it": "austria",
      "de": "österreich"
    },
    "category": "flags",
    "emoji": "🇦🇹"
  },
  {
    "id": "flag_au",
    "spellings": {
      "tr": "avustralya",
      "en": "australia",
      "fr": "australie",
      "es": "australia",
      "it": "australia",
      "de": "australien"
    },
    "category": "flags",
    "emoji": "🇦🇺"
  },
  {
    "id": "flag_bb",
    "spellings": {
      "tr": "barbados",
      "en": "barbados",
      "fr": "barbade",
      "es": "barbados",
      "it": "barbados",
      "de": "barbados"
    },
    "category": "flags",
    "emoji": "🇧🇧"
  },
  {
    "id": "flag_bd",
    "spellings": {
      "tr": "bangladeş",
      "en": "bangladesh",
      "fr": "bangladesh",
      "es": "bangladés",
      "it": "bangladesh",
      "de": "bangladesch"
    },
    "category": "flags",
    "emoji": "🇧🇩"
  },
  {
    "id": "flag_be",
    "spellings": {
      "tr": "belçika",
      "en": "belgium",
      "fr": "belgique",
      "es": "bélgica",
      "it": "belgio",
      "de": "belgien"
    },
    "category": "flags",
    "emoji": "🇧🇪"
  },
  {
    "id": "flag_bg",
    "spellings": {
      "tr": "bulgaristan",
      "en": "bulgaria",
      "fr": "bulgarie",
      "es": "bulgaria",
      "it": "bulgaria",
      "de": "bulgarien"
    },
    "category": "flags",
    "emoji": "🇧🇬"
  },
  {
    "id": "flag_bh",
    "spellings": {
      "tr": "bahreyn",
      "en": "bahrain",
      "fr": "bahreïn",
      "es": "baréin",
      "it": "bahrein",
      "de": "bahrain"
    },
    "category": "flags",
    "emoji": "🇧🇭"
  },
  {
    "id": "flag_bi",
    "spellings": {
      "tr": "burundi",
      "en": "burundi",
      "fr": "burundi",
      "es": "burundi",
      "it": "burundi",
      "de": "burundi"
    },
    "category": "flags",
    "emoji": "🇧🇮"
  },
  {
    "id": "flag_bj",
    "spellings": {
      "tr": "benin",
      "en": "benin",
      "fr": "bénin",
      "es": "benín",
      "it": "benin",
      "de": "benin"
    },
    "category": "flags",
    "emoji": "🇧🇯"
  },
  {
    "id": "flag_bo",
    "spellings": {
      "tr": "bolivya",
      "en": "bolivia",
      "fr": "bolivie",
      "es": "bolivia",
      "it": "bolivia",
      "de": "bolivien"
    },
    "category": "flags",
    "emoji": "🇧🇴"
  },
  {
    "id": "flag_br",
    "spellings": {
      "tr": "brezilya",
      "en": "brazil",
      "fr": "brésil",
      "es": "brasil",
      "it": "brasile",
      "de": "brasilien"
    },
    "category": "flags",
    "emoji": "🇧🇷"
  },
  {
    "id": "flag_bs",
    "spellings": {
      "tr": "bahamalar",
      "en": "bahamas",
      "fr": "bahamas",
      "es": "bahamas",
      "it": "bahamas",
      "de": "bahamas"
    },
    "category": "flags",
    "emoji": "🇧🇸"
  },
  {
    "id": "flag_bt",
    "spellings": {
      "tr": "butan",
      "en": "bhutan",
      "fr": "bhoutan",
      "es": "bután",
      "it": "bhutan",
      "de": "bhutan"
    },
    "category": "flags",
    "emoji": "🇧🇹"
  },
  {
    "id": "flag_bw",
    "spellings": {
      "tr": "botsvana",
      "en": "botswana",
      "fr": "botswana",
      "es": "botsuana",
      "it": "botswana",
      "de": "botsuana"
    },
    "category": "flags",
    "emoji": "🇧🇼"
  },
  {
    "id": "flag_by",
    "spellings": {
      "tr": "belarus",
      "en": "belarus",
      "fr": "biélorussie",
      "es": "bielorrusia",
      "it": "bielorussia",
      "de": "belarus"
    },
    "category": "flags",
    "emoji": "🇧🇾"
  },
  {
    "id": "flag_bz",
    "spellings": {
      "tr": "belize",
      "en": "belize",
      "fr": "belize",
      "es": "belice",
      "it": "belize",
      "de": "belize"
    },
    "category": "flags",
    "emoji": "🇧🇿"
  },
  {
    "id": "flag_ca",
    "spellings": {
      "tr": "kanada",
      "en": "canada",
      "fr": "canada",
      "es": "canadá",
      "it": "canada",
      "de": "kanada"
    },
    "category": "flags",
    "emoji": "🇨🇦"
  },
  {
    "id": "flag_ch",
    "spellings": {
      "tr": "i̇sviçre",
      "en": "switzerland",
      "fr": "suisse",
      "es": "suiza",
      "it": "svizzera",
      "de": "schweiz"
    },
    "category": "flags",
    "emoji": "🇨🇭"
  },
  {
    "id": "flag_cl",
    "spellings": {
      "tr": "şili",
      "en": "chile",
      "fr": "chili",
      "es": "chile",
      "it": "cile",
      "de": "chile"
    },
    "category": "flags",
    "emoji": "🇨🇱"
  },
  {
    "id": "flag_cm",
    "spellings": {
      "tr": "kamerun",
      "en": "cameroon",
      "fr": "cameroun",
      "es": "camerún",
      "it": "camerun",
      "de": "kamerun"
    },
    "category": "flags",
    "emoji": "🇨🇲"
  },
  {
    "id": "flag_cn",
    "spellings": {
      "tr": "çin",
      "en": "china",
      "fr": "chine",
      "es": "china",
      "it": "cina",
      "de": "china"
    },
    "category": "flags",
    "emoji": "🇨🇳"
  },
  {
    "id": "flag_co",
    "spellings": {
      "tr": "kolombiya",
      "en": "colombia",
      "fr": "colombie",
      "es": "colombia",
      "it": "colombia",
      "de": "kolumbien"
    },
    "category": "flags",
    "emoji": "🇨🇴"
  },
  {
    "id": "flag_cr",
    "spellings": {
      "tr": "kosta rika",
      "en": "costa rica",
      "fr": "costa rica",
      "es": "costa rica",
      "it": "costa rica",
      "de": "costa rica"
    },
    "category": "flags",
    "emoji": "🇨🇷"
  },
  {
    "id": "flag_cu",
    "spellings": {
      "tr": "küba",
      "en": "cuba",
      "fr": "cuba",
      "es": "cuba",
      "it": "cuba",
      "de": "kuba"
    },
    "category": "flags",
    "emoji": "🇨🇺"
  },
  {
    "id": "flag_cv",
    "spellings": {
      "tr": "cabo verde",
      "en": "cape verde",
      "fr": "cap-vert",
      "es": "cabo verde",
      "it": "capo verde",
      "de": "cabo verde"
    },
    "category": "flags",
    "emoji": "🇨🇻"
  },
  {
    "id": "flag_cy",
    "spellings": {
      "tr": "kıbrıs",
      "en": "cyprus",
      "fr": "chypre",
      "es": "chipre",
      "it": "cipro",
      "de": "zypern"
    },
    "category": "flags",
    "emoji": "🇨🇾"
  },
  {
    "id": "flag_cz",
    "spellings": {
      "tr": "çekya",
      "en": "czechia",
      "fr": "tchéquie",
      "es": "chequia",
      "it": "cechia",
      "de": "tschechien"
    },
    "category": "flags",
    "emoji": "🇨🇿"
  },
  {
    "id": "flag_de",
    "spellings": {
      "tr": "almanya",
      "en": "germany",
      "fr": "allemagne",
      "es": "alemania",
      "it": "germania",
      "de": "deutschland"
    },
    "category": "flags",
    "emoji": "🇩🇪"
  },
  {
    "id": "flag_dj",
    "spellings": {
      "tr": "cibuti",
      "en": "djibouti",
      "fr": "djibouti",
      "es": "yibuti",
      "it": "gibuti",
      "de": "dschibuti"
    },
    "category": "flags",
    "emoji": "🇩🇯"
  },
  {
    "id": "flag_dk",
    "spellings": {
      "tr": "danimarka",
      "en": "denmark",
      "fr": "danemark",
      "es": "dinamarca",
      "it": "danimarca",
      "de": "dänemark"
    },
    "category": "flags",
    "emoji": "🇩🇰"
  },
  {
    "id": "flag_dm",
    "spellings": {
      "tr": "dominika",
      "en": "dominica",
      "fr": "dominique",
      "es": "dominica",
      "it": "dominica",
      "de": "dominica"
    },
    "category": "flags",
    "emoji": "🇩🇲"
  },
  {
    "id": "flag_dz",
    "spellings": {
      "tr": "cezayir",
      "en": "algeria",
      "fr": "algérie",
      "es": "argelia",
      "it": "algeria",
      "de": "algerien"
    },
    "category": "flags",
    "emoji": "🇩🇿"
  },
  {
    "id": "flag_ec",
    "spellings": {
      "tr": "ekvador",
      "en": "ecuador",
      "fr": "équateur",
      "es": "ecuador",
      "it": "ecuador",
      "de": "ecuador"
    },
    "category": "flags",
    "emoji": "🇪🇨"
  },
  {
    "id": "flag_ee",
    "spellings": {
      "tr": "estonya",
      "en": "estonia",
      "fr": "estonie",
      "es": "estonia",
      "it": "estonia",
      "de": "estland"
    },
    "category": "flags",
    "emoji": "🇪🇪"
  },
  {
    "id": "flag_eg",
    "spellings": {
      "tr": "mısır",
      "en": "egypt",
      "fr": "égypte",
      "es": "egipto",
      "it": "egitto",
      "de": "ägypten"
    },
    "category": "flags",
    "emoji": "🇪🇬"
  },
  {
    "id": "flag_er",
    "spellings": {
      "tr": "eritre",
      "en": "eritrea",
      "fr": "érythrée",
      "es": "eritrea",
      "it": "eritrea",
      "de": "eritrea"
    },
    "category": "flags",
    "emoji": "🇪🇷"
  },
  {
    "id": "flag_es",
    "spellings": {
      "tr": "i̇spanya",
      "en": "spain",
      "fr": "espagne",
      "es": "españa",
      "it": "spagna",
      "de": "spanien"
    },
    "category": "flags",
    "emoji": "🇪🇸"
  },
  {
    "id": "flag_et",
    "spellings": {
      "tr": "etiyopya",
      "en": "ethiopia",
      "fr": "éthiopie",
      "es": "etiopía",
      "it": "etiopia",
      "de": "äthiopien"
    },
    "category": "flags",
    "emoji": "🇪🇹"
  },
  {
    "id": "flag_fi",
    "spellings": {
      "tr": "finlandiya",
      "en": "finland",
      "fr": "finlande",
      "es": "finlandia",
      "it": "finlandia",
      "de": "finnland"
    },
    "category": "flags",
    "emoji": "🇫🇮"
  },
  {
    "id": "flag_fj",
    "spellings": {
      "tr": "fiji",
      "en": "fiji",
      "fr": "fidji",
      "es": "fiyi",
      "it": "figi",
      "de": "fidschi"
    },
    "category": "flags",
    "emoji": "🇫🇯"
  },
  {
    "id": "flag_fm",
    "spellings": {
      "tr": "mikronezya",
      "en": "micronesia",
      "fr": "micronésie",
      "es": "micronesia",
      "it": "micronesia",
      "de": "mikronesien"
    },
    "category": "flags",
    "emoji": "🇫🇲"
  },
  {
    "id": "flag_fr",
    "spellings": {
      "tr": "fransa",
      "en": "france",
      "fr": "france",
      "es": "francia",
      "it": "francia",
      "de": "frankreich"
    },
    "category": "flags",
    "emoji": "🇫🇷"
  },
  {
    "id": "flag_ga",
    "spellings": {
      "tr": "gabon",
      "en": "gabon",
      "fr": "gabon",
      "es": "gabón",
      "it": "gabon",
      "de": "gabun"
    },
    "category": "flags",
    "emoji": "🇬🇦"
  },
  {
    "id": "flag_gd",
    "spellings": {
      "tr": "grenada",
      "en": "grenada",
      "fr": "grenade",
      "es": "granada",
      "it": "grenada",
      "de": "grenada"
    },
    "category": "flags",
    "emoji": "🇬🇩"
  },
  {
    "id": "flag_ge",
    "spellings": {
      "tr": "gürcistan",
      "en": "georgia",
      "fr": "géorgie",
      "es": "georgia",
      "it": "georgia",
      "de": "georgien"
    },
    "category": "flags",
    "emoji": "🇬🇪"
  },
  {
    "id": "flag_gh",
    "spellings": {
      "tr": "gana",
      "en": "ghana",
      "fr": "ghana",
      "es": "ghana",
      "it": "ghana",
      "de": "ghana"
    },
    "category": "flags",
    "emoji": "🇬🇭"
  },
  {
    "id": "flag_gm",
    "spellings": {
      "tr": "gambiya",
      "en": "gambia",
      "fr": "gambie",
      "es": "gambia",
      "it": "gambia",
      "de": "gambia"
    },
    "category": "flags",
    "emoji": "🇬🇲"
  },
  {
    "id": "flag_gn",
    "spellings": {
      "tr": "gine",
      "en": "guinea",
      "fr": "guinée",
      "es": "guinea",
      "it": "guinea",
      "de": "guinea"
    },
    "category": "flags",
    "emoji": "🇬🇳"
  },
  {
    "id": "flag_gt",
    "spellings": {
      "tr": "guatemala",
      "en": "guatemala",
      "fr": "guatemala",
      "es": "guatemala",
      "it": "guatemala",
      "de": "guatemala"
    },
    "category": "flags",
    "emoji": "🇬🇹"
  },
  {
    "id": "flag_gy",
    "spellings": {
      "tr": "guyana",
      "en": "guyana",
      "fr": "guyana",
      "es": "guyana",
      "it": "guyana",
      "de": "guyana"
    },
    "category": "flags",
    "emoji": "🇬🇾"
  },
  {
    "id": "flag_hn",
    "spellings": {
      "tr": "honduras",
      "en": "honduras",
      "fr": "honduras",
      "es": "honduras",
      "it": "honduras",
      "de": "honduras"
    },
    "category": "flags",
    "emoji": "🇭🇳"
  },
  {
    "id": "flag_hr",
    "spellings": {
      "tr": "hırvatistan",
      "en": "croatia",
      "fr": "croatie",
      "es": "croacia",
      "it": "croazia",
      "de": "kroatien"
    },
    "category": "flags",
    "emoji": "🇭🇷"
  },
  {
    "id": "flag_ht",
    "spellings": {
      "tr": "haiti",
      "en": "haiti",
      "fr": "haïti",
      "es": "haití",
      "it": "haiti",
      "de": "haiti"
    },
    "category": "flags",
    "emoji": "🇭🇹"
  },
  {
    "id": "flag_hu",
    "spellings": {
      "tr": "macaristan",
      "en": "hungary",
      "fr": "hongrie",
      "es": "hungría",
      "it": "ungheria",
      "de": "ungarn"
    },
    "category": "flags",
    "emoji": "🇭🇺"
  },
  {
    "id": "flag_id",
    "spellings": {
      "tr": "endonezya",
      "en": "indonesia",
      "fr": "indonésie",
      "es": "indonesia",
      "it": "indonesia",
      "de": "indonesien"
    },
    "category": "flags",
    "emoji": "🇮🇩"
  },
  {
    "id": "flag_ie",
    "spellings": {
      "tr": "i̇rlanda",
      "en": "ireland",
      "fr": "irlande",
      "es": "irlanda",
      "it": "irlanda",
      "de": "irland"
    },
    "category": "flags",
    "emoji": "🇮🇪"
  },
  {
    "id": "flag_il",
    "spellings": {
      "tr": "i̇srail",
      "en": "israel",
      "fr": "israël",
      "es": "israel",
      "it": "israele",
      "de": "israel"
    },
    "category": "flags",
    "emoji": "🇮🇱"
  },
  {
    "id": "flag_in",
    "spellings": {
      "tr": "hindistan",
      "en": "india",
      "fr": "inde",
      "es": "india",
      "it": "india",
      "de": "indien"
    },
    "category": "flags",
    "emoji": "🇮🇳"
  },
  {
    "id": "flag_iq",
    "spellings": {
      "tr": "irak",
      "en": "iraq",
      "fr": "irak",
      "es": "irak",
      "it": "iraq",
      "de": "irak"
    },
    "category": "flags",
    "emoji": "🇮🇶"
  },
  {
    "id": "flag_ir",
    "spellings": {
      "tr": "i̇ran",
      "en": "iran",
      "fr": "iran",
      "es": "irán",
      "it": "iran",
      "de": "iran"
    },
    "category": "flags",
    "emoji": "🇮🇷"
  },
  {
    "id": "flag_is",
    "spellings": {
      "tr": "i̇zlanda",
      "en": "iceland",
      "fr": "islande",
      "es": "islandia",
      "it": "islanda",
      "de": "island"
    },
    "category": "flags",
    "emoji": "🇮🇸"
  },
  {
    "id": "flag_it",
    "spellings": {
      "tr": "i̇talya",
      "en": "italy",
      "fr": "italie",
      "es": "italia",
      "it": "italia",
      "de": "italien"
    },
    "category": "flags",
    "emoji": "🇮🇹"
  },
  {
    "id": "flag_jm",
    "spellings": {
      "tr": "jamaika",
      "en": "jamaica",
      "fr": "jamaïque",
      "es": "jamaica",
      "it": "giamaica",
      "de": "jamaika"
    },
    "category": "flags",
    "emoji": "🇯🇲"
  },
  {
    "id": "flag_jo",
    "spellings": {
      "tr": "ürdün",
      "en": "jordan",
      "fr": "jordanie",
      "es": "jordania",
      "it": "giordania",
      "de": "jordanien"
    },
    "category": "flags",
    "emoji": "🇯🇴"
  },
  {
    "id": "flag_jp",
    "spellings": {
      "tr": "japonya",
      "en": "japan",
      "fr": "japon",
      "es": "japón",
      "it": "giappone",
      "de": "japan"
    },
    "category": "flags",
    "emoji": "🇯🇵"
  },
  {
    "id": "flag_ke",
    "spellings": {
      "tr": "kenya",
      "en": "kenya",
      "fr": "kenya",
      "es": "kenia",
      "it": "kenya",
      "de": "kenia"
    },
    "category": "flags",
    "emoji": "🇰🇪"
  },
  {
    "id": "flag_kh",
    "spellings": {
      "tr": "kamboçya",
      "en": "cambodia",
      "fr": "cambodge",
      "es": "camboya",
      "it": "cambogia",
      "de": "kambodscha"
    },
    "category": "flags",
    "emoji": "🇰🇭"
  },
  {
    "id": "flag_ki",
    "spellings": {
      "tr": "kiribati",
      "en": "kiribati",
      "fr": "kiribati",
      "es": "kiribati",
      "it": "kiribati",
      "de": "kiribati"
    },
    "category": "flags",
    "emoji": "🇰🇮"
  },
  {
    "id": "flag_km",
    "spellings": {
      "tr": "komorlar",
      "en": "comoros",
      "fr": "comores",
      "es": "comoras",
      "it": "comore",
      "de": "komoren"
    },
    "category": "flags",
    "emoji": "🇰🇲"
  },
  {
    "id": "flag_kw",
    "spellings": {
      "tr": "kuveyt",
      "en": "kuwait",
      "fr": "koweït",
      "es": "kuwait",
      "it": "kuwait",
      "de": "kuwait"
    },
    "category": "flags",
    "emoji": "🇰🇼"
  },
  {
    "id": "flag_kz",
    "spellings": {
      "tr": "kazakistan",
      "en": "kazakhstan",
      "fr": "kazakhstan",
      "es": "kazajistán",
      "it": "kazakistan",
      "de": "kasachstan"
    },
    "category": "flags",
    "emoji": "🇰🇿"
  },
  {
    "id": "flag_la",
    "spellings": {
      "tr": "laos",
      "en": "laos",
      "fr": "laos",
      "es": "laos",
      "it": "laos",
      "de": "laos"
    },
    "category": "flags",
    "emoji": "🇱🇦"
  },
  {
    "id": "flag_lb",
    "spellings": {
      "tr": "lübnan",
      "en": "lebanon",
      "fr": "liban",
      "es": "líbano",
      "it": "libano",
      "de": "libanon"
    },
    "category": "flags",
    "emoji": "🇱🇧"
  },
  {
    "id": "flag_lk",
    "spellings": {
      "tr": "sri lanka",
      "en": "sri lanka",
      "fr": "sri lanka",
      "es": "sri lanka",
      "it": "sri lanka",
      "de": "sri lanka"
    },
    "category": "flags",
    "emoji": "🇱🇰"
  },
  {
    "id": "flag_lr",
    "spellings": {
      "tr": "liberya",
      "en": "liberia",
      "fr": "liberia",
      "es": "liberia",
      "it": "liberia",
      "de": "liberia"
    },
    "category": "flags",
    "emoji": "🇱🇷"
  },
  {
    "id": "flag_ls",
    "spellings": {
      "tr": "lesotho",
      "en": "lesotho",
      "fr": "lesotho",
      "es": "lesoto",
      "it": "lesotho",
      "de": "lesotho"
    },
    "category": "flags",
    "emoji": "🇱🇸"
  },
  {
    "id": "flag_lt",
    "spellings": {
      "tr": "litvanya",
      "en": "lithuania",
      "fr": "lituanie",
      "es": "lituania",
      "it": "lituania",
      "de": "litauen"
    },
    "category": "flags",
    "emoji": "🇱🇹"
  },
  {
    "id": "flag_lu",
    "spellings": {
      "tr": "lüksemburg",
      "en": "luxembourg",
      "fr": "luxembourg",
      "es": "luxemburgo",
      "it": "lussemburgo",
      "de": "luxemburg"
    },
    "category": "flags",
    "emoji": "🇱🇺"
  },
  {
    "id": "flag_lv",
    "spellings": {
      "tr": "letonya",
      "en": "latvia",
      "fr": "lettonie",
      "es": "letonia",
      "it": "lettonia",
      "de": "lettland"
    },
    "category": "flags",
    "emoji": "🇱🇻"
  },
  {
    "id": "flag_ly",
    "spellings": {
      "tr": "libya",
      "en": "libya",
      "fr": "libye",
      "es": "libia",
      "it": "libia",
      "de": "libyen"
    },
    "category": "flags",
    "emoji": "🇱🇾"
  },
  {
    "id": "flag_ma",
    "spellings": {
      "tr": "fas",
      "en": "morocco",
      "fr": "maroc",
      "es": "marruecos",
      "it": "marocco",
      "de": "marokko"
    },
    "category": "flags",
    "emoji": "🇲🇦"
  },
  {
    "id": "flag_mc",
    "spellings": {
      "tr": "monako",
      "en": "monaco",
      "fr": "monaco",
      "es": "mónaco",
      "it": "monaco",
      "de": "monaco"
    },
    "category": "flags",
    "emoji": "🇲🇨"
  },
  {
    "id": "flag_me",
    "spellings": {
      "tr": "karadağ",
      "en": "montenegro",
      "fr": "monténégro",
      "es": "montenegro",
      "it": "montenegro",
      "de": "montenegro"
    },
    "category": "flags",
    "emoji": "🇲🇪"
  },
  {
    "id": "flag_mg",
    "spellings": {
      "tr": "madagaskar",
      "en": "madagascar",
      "fr": "madagascar",
      "es": "madagascar",
      "it": "madagascar",
      "de": "madagaskar"
    },
    "category": "flags",
    "emoji": "🇲🇬"
  },
  {
    "id": "flag_ml",
    "spellings": {
      "tr": "mali",
      "en": "mali",
      "fr": "mali",
      "es": "mali",
      "it": "mali",
      "de": "mali"
    },
    "category": "flags",
    "emoji": "🇲🇱"
  },
  {
    "id": "flag_mn",
    "spellings": {
      "tr": "moğolistan",
      "en": "mongolia",
      "fr": "mongolie",
      "es": "mongolia",
      "it": "mongolia",
      "de": "mongolei"
    },
    "category": "flags",
    "emoji": "🇲🇳"
  },
  {
    "id": "flag_mr",
    "spellings": {
      "tr": "moritanya",
      "en": "mauritania",
      "fr": "mauritanie",
      "es": "mauritania",
      "it": "mauritania",
      "de": "mauretanien"
    },
    "category": "flags",
    "emoji": "🇲🇷"
  },
  {
    "id": "flag_mt",
    "spellings": {
      "tr": "malta",
      "en": "malta",
      "fr": "malte",
      "es": "malta",
      "it": "malta",
      "de": "malta"
    },
    "category": "flags",
    "emoji": "🇲🇹"
  },
  {
    "id": "flag_mu",
    "spellings": {
      "tr": "mauritius",
      "en": "mauritius",
      "fr": "maurice",
      "es": "mauricio",
      "it": "mauritius",
      "de": "mauritius"
    },
    "category": "flags",
    "emoji": "🇲🇺"
  },
  {
    "id": "flag_mv",
    "spellings": {
      "tr": "maldivler",
      "en": "maldives",
      "fr": "maldives",
      "es": "maldivas",
      "it": "maldive",
      "de": "malediven"
    },
    "category": "flags",
    "emoji": "🇲🇻"
  },
  {
    "id": "flag_mw",
    "spellings": {
      "tr": "malavi",
      "en": "malawi",
      "fr": "malawi",
      "es": "malaui",
      "it": "malawi",
      "de": "malawi"
    },
    "category": "flags",
    "emoji": "🇲🇼"
  },
  {
    "id": "flag_mx",
    "spellings": {
      "tr": "meksika",
      "en": "mexico",
      "fr": "mexique",
      "es": "méxico",
      "it": "messico",
      "de": "mexiko"
    },
    "category": "flags",
    "emoji": "🇲🇽"
  },
  {
    "id": "flag_my",
    "spellings": {
      "tr": "malezya",
      "en": "malaysia",
      "fr": "malaisie",
      "es": "malasia",
      "it": "malaysia",
      "de": "malaysia"
    },
    "category": "flags",
    "emoji": "🇲🇾"
  },
  {
    "id": "flag_mz",
    "spellings": {
      "tr": "mozambik",
      "en": "mozambique",
      "fr": "mozambique",
      "es": "mozambique",
      "it": "mozambico",
      "de": "mosambik"
    },
    "category": "flags",
    "emoji": "🇲🇿"
  },
  {
    "id": "flag_na",
    "spellings": {
      "tr": "namibya",
      "en": "namibia",
      "fr": "namibie",
      "es": "namibia",
      "it": "namibia",
      "de": "namibia"
    },
    "category": "flags",
    "emoji": "🇳🇦"
  },
  {
    "id": "flag_ne",
    "spellings": {
      "tr": "nijer",
      "en": "niger",
      "fr": "niger",
      "es": "níger",
      "it": "niger",
      "de": "niger"
    },
    "category": "flags",
    "emoji": "🇳🇪"
  },
  {
    "id": "flag_ng",
    "spellings": {
      "tr": "nijerya",
      "en": "nigeria",
      "fr": "nigeria",
      "es": "nigeria",
      "it": "nigeria",
      "de": "nigeria"
    },
    "category": "flags",
    "emoji": "🇳🇬"
  },
  {
    "id": "flag_ni",
    "spellings": {
      "tr": "nikaragua",
      "en": "nicaragua",
      "fr": "nicaragua",
      "es": "nicaragua",
      "it": "nicaragua",
      "de": "nicaragua"
    },
    "category": "flags",
    "emoji": "🇳🇮"
  },
  {
    "id": "flag_no",
    "spellings": {
      "tr": "norveç",
      "en": "norway",
      "fr": "norvège",
      "es": "noruega",
      "it": "norvegia",
      "de": "norwegen"
    },
    "category": "flags",
    "emoji": "🇳🇴"
  },
  {
    "id": "flag_np",
    "spellings": {
      "tr": "nepal",
      "en": "nepal",
      "fr": "népal",
      "es": "nepal",
      "it": "nepal",
      "de": "nepal"
    },
    "category": "flags",
    "emoji": "🇳🇵"
  },
  {
    "id": "flag_nr",
    "spellings": {
      "tr": "nauru",
      "en": "nauru",
      "fr": "nauru",
      "es": "nauru",
      "it": "nauru",
      "de": "nauru"
    },
    "category": "flags",
    "emoji": "🇳🇷"
  },
  {
    "id": "flag_om",
    "spellings": {
      "tr": "umman",
      "en": "oman",
      "fr": "oman",
      "es": "omán",
      "it": "oman",
      "de": "oman"
    },
    "category": "flags",
    "emoji": "🇴🇲"
  },
  {
    "id": "flag_pa",
    "spellings": {
      "tr": "panama",
      "en": "panama",
      "fr": "panama",
      "es": "panamá",
      "it": "panama",
      "de": "panama"
    },
    "category": "flags",
    "emoji": "🇵🇦"
  },
  {
    "id": "flag_pe",
    "spellings": {
      "tr": "peru",
      "en": "peru",
      "fr": "pérou",
      "es": "perú",
      "it": "perù",
      "de": "peru"
    },
    "category": "flags",
    "emoji": "🇵🇪"
  },
  {
    "id": "flag_ph",
    "spellings": {
      "tr": "filipinler",
      "en": "philippines",
      "fr": "philippines",
      "es": "filipinas",
      "it": "filippine",
      "de": "philippinen"
    },
    "category": "flags",
    "emoji": "🇵🇭"
  },
  {
    "id": "flag_pk",
    "spellings": {
      "tr": "pakistan",
      "en": "pakistan",
      "fr": "pakistan",
      "es": "pakistán",
      "it": "pakistan",
      "de": "pakistan"
    },
    "category": "flags",
    "emoji": "🇵🇰"
  },
  {
    "id": "flag_pl",
    "spellings": {
      "tr": "polonya",
      "en": "poland",
      "fr": "pologne",
      "es": "polonia",
      "it": "polonia",
      "de": "polen"
    },
    "category": "flags",
    "emoji": "🇵🇱"
  },
  {
    "id": "flag_pt",
    "spellings": {
      "tr": "portekiz",
      "en": "portugal",
      "fr": "portugal",
      "es": "portugal",
      "it": "portogallo",
      "de": "portugal"
    },
    "category": "flags",
    "emoji": "🇵🇹"
  },
  {
    "id": "flag_pw",
    "spellings": {
      "tr": "palau",
      "en": "palau",
      "fr": "palaos",
      "es": "palaos",
      "it": "palau",
      "de": "palau"
    },
    "category": "flags",
    "emoji": "🇵🇼"
  },
  {
    "id": "flag_py",
    "spellings": {
      "tr": "paraguay",
      "en": "paraguay",
      "fr": "paraguay",
      "es": "paraguay",
      "it": "paraguay",
      "de": "paraguay"
    },
    "category": "flags",
    "emoji": "🇵🇾"
  },
  {
    "id": "flag_qa",
    "spellings": {
      "tr": "katar",
      "en": "qatar",
      "fr": "qatar",
      "es": "catar",
      "it": "qatar",
      "de": "katar"
    },
    "category": "flags",
    "emoji": "🇶🇦"
  },
  {
    "id": "flag_ro",
    "spellings": {
      "tr": "romanya",
      "en": "romania",
      "fr": "roumanie",
      "es": "rumanía",
      "it": "romania",
      "de": "rumänien"
    },
    "category": "flags",
    "emoji": "🇷🇴"
  },
  {
    "id": "flag_rs",
    "spellings": {
      "tr": "sırbistan",
      "en": "serbia",
      "fr": "serbie",
      "es": "serbia",
      "it": "serbia",
      "de": "serbien"
    },
    "category": "flags",
    "emoji": "🇷🇸"
  },
  {
    "id": "flag_ru",
    "spellings": {
      "tr": "rusya",
      "en": "russia",
      "fr": "russie",
      "es": "rusia",
      "it": "russia",
      "de": "russland"
    },
    "category": "flags",
    "emoji": "🇷🇺"
  },
  {
    "id": "flag_rw",
    "spellings": {
      "tr": "ruanda",
      "en": "rwanda",
      "fr": "rwanda",
      "es": "ruanda",
      "it": "ruanda",
      "de": "ruanda"
    },
    "category": "flags",
    "emoji": "🇷🇼"
  },
  {
    "id": "flag_sc",
    "spellings": {
      "tr": "seyşeller",
      "en": "seychelles",
      "fr": "seychelles",
      "es": "seychelles",
      "it": "seychelles",
      "de": "seychellen"
    },
    "category": "flags",
    "emoji": "🇸🇨"
  },
  {
    "id": "flag_sd",
    "spellings": {
      "tr": "sudan",
      "en": "sudan",
      "fr": "soudan",
      "es": "sudán",
      "it": "sudan",
      "de": "sudan"
    },
    "category": "flags",
    "emoji": "🇸🇩"
  },
  {
    "id": "flag_se",
    "spellings": {
      "tr": "i̇sveç",
      "en": "sweden",
      "fr": "suède",
      "es": "suecia",
      "it": "svezia",
      "de": "schweden"
    },
    "category": "flags",
    "emoji": "🇸🇪"
  },
  {
    "id": "flag_sg",
    "spellings": {
      "tr": "singapur",
      "en": "singapore",
      "fr": "singapour",
      "es": "singapur",
      "it": "singapore",
      "de": "singapur"
    },
    "category": "flags",
    "emoji": "🇸🇬"
  },
  {
    "id": "flag_si",
    "spellings": {
      "tr": "slovenya",
      "en": "slovenia",
      "fr": "slovénie",
      "es": "eslovenia",
      "it": "slovenia",
      "de": "slowenien"
    },
    "category": "flags",
    "emoji": "🇸🇮"
  },
  {
    "id": "flag_sk",
    "spellings": {
      "tr": "slovakya",
      "en": "slovakia",
      "fr": "slovaquie",
      "es": "eslovaquia",
      "it": "slovacchia",
      "de": "slowakei"
    },
    "category": "flags",
    "emoji": "🇸🇰"
  },
  {
    "id": "flag_sm",
    "spellings": {
      "tr": "san marino",
      "en": "san marino",
      "fr": "saint-marin",
      "es": "san marino",
      "it": "san marino",
      "de": "san marino"
    },
    "category": "flags",
    "emoji": "🇸🇲"
  },
  {
    "id": "flag_sn",
    "spellings": {
      "tr": "senegal",
      "en": "senegal",
      "fr": "sénégal",
      "es": "senegal",
      "it": "senegal",
      "de": "senegal"
    },
    "category": "flags",
    "emoji": "🇸🇳"
  },
  {
    "id": "flag_so",
    "spellings": {
      "tr": "somali",
      "en": "somalia",
      "fr": "somalie",
      "es": "somalia",
      "it": "somalia",
      "de": "somalia"
    },
    "category": "flags",
    "emoji": "🇸🇴"
  },
  {
    "id": "flag_sr",
    "spellings": {
      "tr": "surinam",
      "en": "suriname",
      "fr": "suriname",
      "es": "surinam",
      "it": "suriname",
      "de": "suriname"
    },
    "category": "flags",
    "emoji": "🇸🇷"
  },
  {
    "id": "flag_sv",
    "spellings": {
      "tr": "el salvador",
      "en": "el salvador",
      "fr": "salvador",
      "es": "el salvador",
      "it": "el salvador",
      "de": "el salvador"
    },
    "category": "flags",
    "emoji": "🇸🇻"
  },
  {
    "id": "flag_sy",
    "spellings": {
      "tr": "suriye",
      "en": "syria",
      "fr": "syrie",
      "es": "siria",
      "it": "siria",
      "de": "syrien"
    },
    "category": "flags",
    "emoji": "🇸🇾"
  },
  {
    "id": "flag_sz",
    "spellings": {
      "tr": "esvatini",
      "en": "eswatini",
      "fr": "eswatini",
      "es": "esuatini",
      "it": "eswatini",
      "de": "eswatini"
    },
    "category": "flags",
    "emoji": "🇸🇿"
  },
  {
    "id": "flag_td",
    "spellings": {
      "tr": "çad",
      "en": "chad",
      "fr": "tchad",
      "es": "chad",
      "it": "ciad",
      "de": "tschad"
    },
    "category": "flags",
    "emoji": "🇹🇩"
  },
  {
    "id": "flag_tg",
    "spellings": {
      "tr": "togo",
      "en": "togo",
      "fr": "togo",
      "es": "togo",
      "it": "togo",
      "de": "togo"
    },
    "category": "flags",
    "emoji": "🇹🇬"
  },
  {
    "id": "flag_th",
    "spellings": {
      "tr": "tayland",
      "en": "thailand",
      "fr": "thaïlande",
      "es": "tailandia",
      "it": "thailandia",
      "de": "thailand"
    },
    "category": "flags",
    "emoji": "🇹🇭"
  },
  {
    "id": "flag_tn",
    "spellings": {
      "tr": "tunus",
      "en": "tunisia",
      "fr": "tunisie",
      "es": "túnez",
      "it": "tunisia",
      "de": "tunesien"
    },
    "category": "flags",
    "emoji": "🇹🇳"
  },
  {
    "id": "flag_to",
    "spellings": {
      "tr": "tonga",
      "en": "tonga",
      "fr": "tonga",
      "es": "tonga",
      "it": "tonga",
      "de": "tonga"
    },
    "category": "flags",
    "emoji": "🇹🇴"
  },
  {
    "id": "flag_tr",
    "spellings": {
      "tr": "türkiye",
      "en": "türkiye",
      "fr": "turquie",
      "es": "turquía",
      "it": "turchia",
      "de": "türkei"
    },
    "category": "flags",
    "emoji": "🇹🇷"
  },
  {
    "id": "flag_tv",
    "spellings": {
      "tr": "tuvalu",
      "en": "tuvalu",
      "fr": "tuvalu",
      "es": "tuvalu",
      "it": "tuvalu",
      "de": "tuvalu"
    },
    "category": "flags",
    "emoji": "🇹🇻"
  },
  {
    "id": "flag_tw",
    "spellings": {
      "tr": "tayvan",
      "en": "taiwan",
      "fr": "taïwan",
      "es": "taiwán",
      "it": "taiwan",
      "de": "taiwan"
    },
    "category": "flags",
    "emoji": "🇹🇼"
  },
  {
    "id": "flag_tz",
    "spellings": {
      "tr": "tanzanya",
      "en": "tanzania",
      "fr": "tanzanie",
      "es": "tanzania",
      "it": "tanzania",
      "de": "tansania"
    },
    "category": "flags",
    "emoji": "🇹🇿"
  },
  {
    "id": "flag_ua",
    "spellings": {
      "tr": "ukrayna",
      "en": "ukraine",
      "fr": "ukraine",
      "es": "ucrania",
      "it": "ucraina",
      "de": "ukraine"
    },
    "category": "flags",
    "emoji": "🇺🇦"
  },
  {
    "id": "flag_ug",
    "spellings": {
      "tr": "uganda",
      "en": "uganda",
      "fr": "ouganda",
      "es": "uganda",
      "it": "uganda",
      "de": "uganda"
    },
    "category": "flags",
    "emoji": "🇺🇬"
  },
  {
    "id": "flag_uy",
    "spellings": {
      "tr": "uruguay",
      "en": "uruguay",
      "fr": "uruguay",
      "es": "uruguay",
      "it": "uruguay",
      "de": "uruguay"
    },
    "category": "flags",
    "emoji": "🇺🇾"
  },
  {
    "id": "flag_uz",
    "spellings": {
      "tr": "özbekistan",
      "en": "uzbekistan",
      "fr": "ouzbékistan",
      "es": "uzbekistán",
      "it": "uzbekistan",
      "de": "usbekistan"
    },
    "category": "flags",
    "emoji": "🇺🇿"
  },
  {
    "id": "flag_ve",
    "spellings": {
      "tr": "venezuela",
      "en": "venezuela",
      "fr": "venezuela",
      "es": "venezuela",
      "it": "venezuela",
      "de": "venezuela"
    },
    "category": "flags",
    "emoji": "🇻🇪"
  },
  {
    "id": "flag_vn",
    "spellings": {
      "tr": "vietnam",
      "en": "vietnam",
      "fr": "viêt nam",
      "es": "vietnam",
      "it": "vietnam",
      "de": "vietnam"
    },
    "category": "flags",
    "emoji": "🇻🇳"
  },
  {
    "id": "flag_vu",
    "spellings": {
      "tr": "vanuatu",
      "en": "vanuatu",
      "fr": "vanuatu",
      "es": "vanuatu",
      "it": "vanuatu",
      "de": "vanuatu"
    },
    "category": "flags",
    "emoji": "🇻🇺"
  },
  {
    "id": "flag_ws",
    "spellings": {
      "tr": "samoa",
      "en": "samoa",
      "fr": "samoa",
      "es": "samoa",
      "it": "samoa",
      "de": "samoa"
    },
    "category": "flags",
    "emoji": "🇼🇸"
  },
  {
    "id": "flag_ye",
    "spellings": {
      "tr": "yemen",
      "en": "yemen",
      "fr": "yémen",
      "es": "yemen",
      "it": "yemen",
      "de": "jemen"
    },
    "category": "flags",
    "emoji": "🇾🇪"
  },
  {
    "id": "flag_zm",
    "spellings": {
      "tr": "zambiya",
      "en": "zambia",
      "fr": "zambie",
      "es": "zambia",
      "it": "zambia",
      "de": "sambia"
    },
    "category": "flags",
    "emoji": "🇿🇲"
  },
  {
    "id": "flag_zw",
    "spellings": {
      "tr": "zimbabve",
      "en": "zimbabwe",
      "fr": "zimbabwe",
      "es": "zimbabue",
      "it": "zimbabwe",
      "de": "simbabwe"
    },
    "category": "flags",
    "emoji": "🇿🇼"
  },
  {
    "id": "n1",
    "emoji": "1",
    "category": "numbers",
    "spellings": {
      "tr": "bir",
      "en": "one",
      "fr": "un",
      "es": "uno",
      "it": "uno",
      "de": "eins"
    }
  },
  {
    "id": "n2",
    "emoji": "2",
    "category": "numbers",
    "spellings": {
      "tr": "iki",
      "en": "two",
      "fr": "deux",
      "es": "dos",
      "it": "due",
      "de": "zwei"
    }
  },
  {
    "id": "n3",
    "emoji": "3",
    "category": "numbers",
    "spellings": {
      "tr": "üç",
      "en": "three",
      "fr": "trois",
      "es": "tres",
      "it": "tre",
      "de": "drei"
    }
  },
  {
    "id": "n4",
    "emoji": "4",
    "category": "numbers",
    "spellings": {
      "tr": "dört",
      "en": "four",
      "fr": "quatre",
      "es": "cuatro",
      "it": "quattro",
      "de": "vier"
    }
  },
  {
    "id": "n5",
    "emoji": "5",
    "category": "numbers",
    "spellings": {
      "tr": "beş",
      "en": "five",
      "fr": "cinq",
      "es": "cinco",
      "it": "cinque",
      "de": "fünf"
    }
  },
  {
    "id": "n6",
    "emoji": "6",
    "category": "numbers",
    "spellings": {
      "tr": "altı",
      "en": "six",
      "fr": "six",
      "es": "seis",
      "it": "sei",
      "de": "sechs"
    }
  },
  {
    "id": "n7",
    "emoji": "7",
    "category": "numbers",
    "spellings": {
      "tr": "yedi",
      "en": "seven",
      "fr": "sept",
      "es": "siete",
      "it": "sette",
      "de": "sieben"
    }
  },
  {
    "id": "n8",
    "emoji": "8",
    "category": "numbers",
    "spellings": {
      "tr": "sekiz",
      "en": "eight",
      "fr": "huit",
      "es": "ocho",
      "it": "otto",
      "de": "acht"
    }
  },
  {
    "id": "n9",
    "emoji": "9",
    "category": "numbers",
    "spellings": {
      "tr": "dokuz",
      "en": "nine",
      "fr": "neuf",
      "es": "nueve",
      "it": "nove",
      "de": "neun"
    }
  },
  {
    "id": "n10",
    "emoji": "10",
    "category": "numbers",
    "spellings": {
      "tr": "on",
      "en": "ten",
      "fr": "dix",
      "es": "diez",
      "it": "dieci",
      "de": "zehn"
    }
  },
  {
    "id": "red",
    "swatch": "#F25C54",
    "category": "colors",
    "spellings": {
      "tr": "kırmızı",
      "en": "red",
      "fr": "rouge",
      "es": "rojo",
      "it": "rosso",
      "de": "rot"
    }
  },
  {
    "id": "blue",
    "swatch": "#4A90D9",
    "category": "colors",
    "spellings": {
      "tr": "mavi",
      "en": "blue",
      "fr": "bleu",
      "es": "azul",
      "it": "blu",
      "de": "blau"
    }
  },
  {
    "id": "yellow",
    "swatch": "#F6C445",
    "category": "colors",
    "spellings": {
      "tr": "sarı",
      "en": "yellow",
      "fr": "jaune",
      "es": "amarillo",
      "it": "giallo",
      "de": "gelb"
    }
  },
  {
    "id": "green",
    "swatch": "#6FCB6B",
    "category": "colors",
    "spellings": {
      "tr": "yeşil",
      "en": "green",
      "fr": "vert",
      "es": "verde",
      "it": "verde",
      "de": "grün"
    }
  },
  {
    "id": "orange",
    "swatch": "#F5964A",
    "category": "colors",
    "spellings": {
      "tr": "turuncu",
      "en": "orange",
      "fr": "orange",
      "es": "naranja",
      "it": "arancione",
      "de": "orange"
    }
  },
  {
    "id": "purple",
    "swatch": "#9B72CF",
    "category": "colors",
    "spellings": {
      "tr": "mor",
      "en": "purple",
      "fr": "violet",
      "es": "morado",
      "it": "viola",
      "de": "lila"
    }
  },
  {
    "id": "pink",
    "swatch": "#F58FB4",
    "category": "colors",
    "spellings": {
      "tr": "pembe",
      "en": "pink",
      "fr": "rose",
      "es": "rosa",
      "it": "rosa",
      "de": "rosa"
    }
  },
  {
    "id": "black",
    "swatch": "#3A3A3A",
    "category": "colors",
    "spellings": {
      "tr": "siyah",
      "en": "black",
      "fr": "noir",
      "es": "negro",
      "it": "nero",
      "de": "schwarz"
    }
  },
  {
    "id": "white",
    "swatch": "#FFFFFF",
    "category": "colors",
    "spellings": {
      "tr": "beyaz",
      "en": "white",
      "fr": "blanc",
      "es": "blanco",
      "it": "bianco",
      "de": "weiß"
    }
  },
  {
    "id": "brown",
    "swatch": "#A9714B",
    "category": "colors",
    "spellings": {
      "tr": "kahverengi",
      "en": "brown",
      "fr": "marron",
      "es": "marrón",
      "it": "marrone",
      "de": "braun"
    }
  }
];

const words: WordItem[] = [...originalWords, ...emojiWords].filter(w => Object.values(w.spellings).every(s => s.length <= 11));

export default words;
