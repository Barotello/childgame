import type { WordItem } from './words';
import { LOCALES, type Locale } from './translations';

type SimpleSpec = readonly [id: string, tr: string, en: string, emoji: string];

function spellings(_tr: string, en: string): Record<Locale, string> {
  // International names are a safe fallback until a language-specific editorial pass.
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

// The base pack already contains 29 animals. These 71 complete the 100-word path.
const ANIMALS: readonly SimpleSpec[] = [
  ['anim_deer', 'geyik', 'deer', '🦌'],
  ['anim_goat', 'keçi', 'goat', '🐐'],
  ['anim_sheep', 'koyun', 'sheep', '🐑'],
  ['anim_camel', 'deve', 'camel', '🐫'],
  ['anim_donkey', 'eşek', 'donkey', '🫏'],
  ['anim_zebra', 'zebra', 'zebra', '🦓'],
  ['anim_rhino', 'gergedan', 'rhinoceros', '🦏'],
  ['anim_hippo', 'suaygırı', 'hippopotamus', '🦛'],
  ['anim_crocodile', 'timsah', 'crocodile', '🐊'],
  ['anim_turtle', 'kaplumbağa', 'turtle', '🐢'],
  ['anim_snake', 'yılan', 'snake', '🐍'],
  ['anim_frog', 'kurbağa', 'frog', '🐸'],
  ['anim_lizard', 'kertenkele', 'lizard', '🦎'],
  ['anim_octopus', 'ahtapot', 'octopus', '🐙'],
  ['anim_shark', 'köpekbalığı', 'shark', '🦈'],
  ['anim_seal', 'fok', 'seal', '🦭'],
  ['anim_penguin', 'penguen', 'penguin', '🐧'],
  ['anim_peacock', 'tavuskuşu', 'peacock', '🦚'],
  ['anim_parrot', 'papağan', 'parrot', '🦜'],
  ['anim_flamingo', 'flamingo', 'flamingo', '🦩'],
  ['anim_turkey', 'hindi', 'turkey', '🦃'],
  ['anim_goose', 'kaz', 'goose', '🪿'],
  ['anim_rooster', 'horoz', 'rooster', '🐓'],
  ['anim_bat', 'yarasa', 'bat', '🦇'],
  ['anim_butterfly', 'kelebek', 'butterfly', '🦋'],
  ['anim_ladybug', 'uğurböceği', 'ladybug', '🐞'],
  ['anim_snail', 'salyangoz', 'snail', '🐌'],
  ['anim_scorpion', 'akrep', 'scorpion', '🦂'],
  ['anim_spider', 'örümcek', 'spider', '🕷️'],
  ['anim_crab', 'yengeç', 'crab', '🦀'],
  ['anim_lobster', 'ıstakoz', 'lobster', '🦞'],
  ['anim_shrimp', 'karides', 'shrimp', '🦐'],
  ['anim_squid', 'kalamar', 'squid', '🦑'],
  ['anim_jellyfish', 'denizanası', 'jellyfish', '🪼'],
  ['anim_otter', 'su samuru', 'otter', '🦦'],
  ['anim_beaver', 'kunduz', 'beaver', '🦫'],
  ['anim_raccoon', 'rakun', 'raccoon', '🦝'],
  ['anim_skunk', 'kokarca', 'skunk', '🦨'],
  ['anim_badger', 'porsuk', 'badger', '🦡'],
  ['anim_hedgehog', 'kirpi', 'hedgehog', '🦔'],
  ['anim_squirrel', 'sincap', 'squirrel', '🐿️'],
  ['anim_kangaroo', 'kanguru', 'kangaroo', '🦘'],
  ['anim_sloth', 'tembelhayvan', 'sloth', '🦥'],
  ['anim_gorilla', 'goril', 'gorilla', '🦍'],
  ['anim_orangutan', 'orangutan', 'orangutan', '🦧'],
  ['anim_chimpanzee', 'şempanze', 'chimpanzee', '🐒'],
  ['anim_leopard', 'leopar', 'leopard', '🐆'],
  ['anim_cheetah', 'çita', 'cheetah', '🐆'],
  ['anim_jaguar', 'jaguar', 'jaguar', '🐆'],
  ['anim_hyena', 'sırtlan', 'hyena', '🐕'],
  ['anim_bison', 'bizon', 'bison', '🦬'],
  ['anim_buffalo', 'manda', 'buffalo', '🐃'],
  ['anim_moose', 'sığın', 'moose', '🫎'],
  ['anim_reindeer', 'rengeyiği', 'reindeer', '🦌'],
  ['anim_llama', 'lama', 'llama', '🦙'],
  ['anim_alpaca', 'alpaka', 'alpaca', '🦙'],
  ['anim_boar', 'yabandomuzu', 'boar', '🐗'],
  ['anim_mole', 'köstebek', 'mole', '🐾'],
  ['anim_rat', 'sıçan', 'rat', '🐀'],
  ['anim_chinchilla', 'çinçilla', 'chinchilla', '🐭'],
  ['anim_meerkat', 'mirket', 'meerkat', '🐾'],
  ['anim_platypus', 'ornitorenk', 'platypus', '🦆'],
  ['anim_armadillo', 'armadillo', 'armadillo', '🐾'],
  ['anim_anteater', 'karıncayiyen', 'anteater', '🐾'],
  ['anim_porcupine', 'oklukirpi', 'porcupine', '🦔'],
  ['anim_gazelle', 'ceylan', 'gazelle', '🦌'],
  ['anim_antelope', 'antilop', 'antelope', '🦌'],
  ['anim_yak', 'yak', 'yak', '🐂'],
  ['anim_ox', 'öküz', 'ox', '🐂'],
  ['anim_panther', 'panter', 'panther', '🐈‍⬛'],
];

// The base pack contains 7 fruits. Exotic entries intentionally avoid picture rounds
// until dedicated illustrations are available, preventing ambiguous repeated emoji choices.
const FRUITS: readonly SimpleSpec[] = [
  ['fruit_apricot', 'kayısı', 'apricot', '🍑'],
  ['fruit_pear', 'armut', 'pear', '🍐'],
  ['fruit_peach', 'şeftali', 'peach', '🍑'],
  ['fruit_cherry', 'kiraz', 'cherry', '🍒'],
  ['fruit_watermelon', 'karpuz', 'watermelon', '🍉'],
  ['fruit_tangerine', 'mandalina', 'tangerine', '🍊'],
  ['fruit_pineapple', 'ananas', 'pineapple', '🍍'],
  ['fruit_pomegranate', 'nar', 'pomegranate', '🔴'],
  ['fruit_fig', 'incir', 'fig', '🟣'],
  ['fruit_plum', 'erik', 'plum', '🟣'],
  ['fruit_coconut', 'hindistancevizi', 'coconut', '🥥'],
  ['fruit_avocado', 'avokado', 'avocado', '🥑'],
  ['fruit_blueberry', 'yabanmersini', 'blueberry', '🫐'],
  ['fruit_raspberry', 'ahududu', 'raspberry', '🫐'],
  ['fruit_blackberry', 'böğürtlen', 'blackberry', '🫐'],
  ['fruit_cranberry', 'turnayemişi', 'cranberry', '🫐'],
  ['fruit_grapefruit', 'greyfurt', 'grapefruit', '🍊'],
  ['fruit_papaya', 'papaya', 'papaya', '🥭'],
  ['fruit_guava', 'guava', 'guava', '🍐'],
  ['fruit_date', 'hurma', 'date', '🟤'],
  ['fruit_persimmon', 'trabzonhurması', 'persimmon', '🟠'],
  ['fruit_quince', 'ayva', 'quince', '🍐'],
  ['fruit_mulberry', 'dut', 'mulberry', '🫐'],
  ['fruit_currant', 'frenküzümü', 'currant', '🫐'],
  ['fruit_gooseberry', 'bektaşiüzümü', 'gooseberry', '🫐'],
  ['fruit_dragonfruit', 'ejdermeyvesi', 'dragonfruit', '🐉'],
  ['fruit_passionfruit', 'çarkıfelek', 'passionfruit', '🟣'],
  ['fruit_lychee', 'liçi', 'lychee', '🔴'],
  ['fruit_rambutan', 'rambutan', 'rambutan', '🔴'],
  ['fruit_durian', 'durian', 'durian', '🟢'],
  ['fruit_jackfruit', 'jakmeyvesi', 'jackfruit', '🟢'],
  ['fruit_starfruit', 'yıldızmeyvesi', 'starfruit', '⭐'],
  ['fruit_pomelo', 'pomelo', 'pomelo', '🍊'],
  ['fruit_nectarine', 'nektarin', 'nectarine', '🍑'],
  ['fruit_clementine', 'klementin', 'clementine', '🍊'],
  ['fruit_kumquat', 'kamkat', 'kumquat', '🍊'],
  ['fruit_elderberry', 'mürver', 'elderberry', '🫐'],
  ['fruit_acai', 'asai', 'acai', '🫐'],
  ['fruit_mangosteen', 'mangostan', 'mangosteen', '🟣'],
  ['fruit_breadfruit', 'ekmekağacı', 'breadfruit', '🟢'],
  ['fruit_sapodilla', 'sapodilla', 'sapodilla', '🟤'],
  ['fruit_soursop', 'graviola', 'soursop', '🟢'],
  ['fruit_longan', 'longan', 'longan', '🟤'],
  ['fruit_loquat', 'yenidünya', 'loquat', '🟠'],
  ['fruit_salak', 'yılanmeyvesi', 'salak', '🟤'],
  ['fruit_tamarind', 'demirhindi', 'tamarind', '🟤'],
  ['fruit_jabuticaba', 'jabuticaba', 'jabuticaba', '🟣'],
  ['fruit_feijoa', 'feyhoa', 'feijoa', '🟢'],
  ['fruit_cherimoya', 'çerimoya', 'cherimoya', '🟢'],
  ['fruit_bilberry', 'ayıüzümü', 'bilberry', '🫐'],
  ['fruit_cloudberry', 'bataklıkdut', 'cloudberry', '🟠'],
  ['fruit_boysenberry', 'boysenüzümü', 'boysenberry', '🫐'],
  ['fruit_loganberry', 'loganüzümü', 'loganberry', '🫐'],
  ['fruit_huckleberry', 'huckleberry', 'huckleberry', '🫐'],
  ['fruit_lingonberry', 'kekreyemiş', 'lingonberry', '🔴'],
  ['fruit_chokeberry', 'aronya', 'chokeberry', '🫐'],
  ['fruit_serviceberry', 'amelanchier', 'serviceberry', '🫐'],
  ['fruit_miraclefruit', 'mucizemeyvesi', 'miraclefruit', '🔴'],
  ['fruit_hornedmelon', 'boynuzlukavun', 'kiwano', '🍈'],
  ['fruit_plantain', 'plantain', 'plantain', '🍌'],
  ['fruit_cantaloupe', 'kantaluplukavun', 'cantaloupe', '🍈'],
  ['fruit_honeydew', 'balkavunu', 'honeydew', '🍈'],
  ['fruit_galia', 'galiakavunu', 'galia', '🍈'],
  ['fruit_ugli', 'uglimeyvesi', 'ugli', '🍊'],
  ['fruit_yuzu', 'yuzu', 'yuzu', '🍋'],
  ['fruit_citron', 'ağaçkavunu', 'citron', '🍋'],
  ['fruit_lime', 'misketlimonu', 'lime', '🍋'],
  ['fruit_bloodorange', 'kanportakalı', 'bloodorange', '🍊'],
  ['fruit_satsuma', 'satsuma', 'satsuma', '🍊'],
  ['fruit_bergamot', 'bergamot', 'bergamot', '🍋'],
  ['fruit_keylime', 'keylime', 'keylime', '🍋'],
  ['fruit_buddhashand', 'budaeli', 'buddhashand', '🍋'],
  ['fruit_nashi', 'naşiarmudu', 'nashi', '🍐'],
  ['fruit_medlar', 'muşmula', 'medlar', '🟤'],
  ['fruit_rowan', 'üvez', 'rowan', '🔴'],
  ['fruit_barberry', 'kadıntuzluğu', 'barberry', '🔴'],
  ['fruit_seabuckthorn', 'yalancıiğde', 'seabuckthorn', '🟠'],
  ['fruit_pricklypear', 'dikenliincir', 'pricklypear', '🟣'],
  ['fruit_tayberry', 'tayberry', 'tayberry', '🫐'],
  ['fruit_dewberry', 'çiyüzümü', 'dewberry', '🫐'],
  ['fruit_wineberry', 'şarapüzümü', 'wineberry', '🔴'],
  ['fruit_jostaberry', 'jostaberry', 'jostaberry', '🫐'],
  ['fruit_cupuacu', 'kupuaçu', 'cupuacu', '🟤'],
  ['fruit_camu', 'camucamu', 'camucamu', '🔴'],
  ['fruit_canistel', 'kanistel', 'canistel', '🟡'],
  ['fruit_lucuma', 'lukuma', 'lucuma', '🟡'],
  ['fruit_mamey', 'mamey', 'mamey', '🟠'],
  ['fruit_noni', 'noni', 'noni', '🟢'],
  ['fruit_tangelo', 'tanjelo', 'tangelo', '🍊'],
  ['fruit_santol', 'santol', 'santol', '🟡'],
  ['fruit_langsat', 'langsat', 'langsat', '🟡'],
];

const NUMBER_WORDS: WordItem[] = Array.from({ length: 90 }, (_, index) => {
  const value = index + 11;
  const label = String(value);
  return {
    id: `n${value}`,
    category: 'numbers',
    spellings: { tr: label, en: label, fr: label, es: label, it: label, de: label },
    emoji: label,
  };
});

type CountrySpec = readonly [code: string, fallback: string];

const COUNTRIES: readonly CountrySpec[] = [
  ['TR', 'Turkey'], ['US', 'United States'], ['GB', 'United Kingdom'], ['FR', 'France'],
  ['DE', 'Germany'], ['ES', 'Spain'], ['PT', 'Portugal'], ['GR', 'Greece'],
  ['NL', 'Netherlands'], ['BE', 'Belgium'], ['CH', 'Switzerland'], ['AT', 'Austria'],
  ['SE', 'Sweden'], ['NO', 'Norway'], ['DK', 'Denmark'], ['FI', 'Finland'],
  ['IS', 'Iceland'], ['IE', 'Ireland'], ['CZ', 'Czechia'], ['SK', 'Slovakia'],
  ['HU', 'Hungary'], ['RO', 'Romania'], ['BG', 'Bulgaria'], ['HR', 'Croatia'],
  ['RS', 'Serbia'], ['SI', 'Slovenia'], ['AL', 'Albania'], ['BA', 'Bosnia'],
  ['MK', 'Macedonia'], ['UA', 'Ukraine'], ['MD', 'Moldova'], ['LT', 'Lithuania'],
  ['LV', 'Latvia'], ['EE', 'Estonia'], ['JP', 'Japan'], ['KR', 'Korea'],
  ['IN', 'India'], ['PK', 'Pakistan'], ['BD', 'Bangladesh'], ['ID', 'Indonesia'],
  ['MY', 'Malaysia'], ['SG', 'Singapore'], ['TH', 'Thailand'], ['VN', 'Vietnam'],
  ['PH', 'Philippines'], ['AU', 'Australia'], ['NZ', 'New Zealand'], ['BR', 'Brazil'],
  ['AR', 'Argentina'], ['CO', 'Colombia'], ['VE', 'Venezuela'], ['EC', 'Ecuador'],
  ['BO', 'Bolivia'], ['PY', 'Paraguay'], ['UY', 'Uruguay'], ['MA', 'Morocco'],
  ['DZ', 'Algeria'], ['TN', 'Tunisia'], ['ZA', 'South Africa'], ['NG', 'Nigeria'],
  ['GH', 'Ghana'], ['ET', 'Ethiopia'], ['TZ', 'Tanzania'], ['UG', 'Uganda'],
  ['SD', 'Sudan'], ['SN', 'Senegal'], ['CM', 'Cameroon'], ['AO', 'Angola'],
  ['ZW', 'Zimbabwe'], ['ZM', 'Zambia'], ['MG', 'Madagascar'], ['SA', 'Saudi Arabia'],
  ['AE', 'United Arab Emirates'], ['QA', 'Qatar'], ['JO', 'Jordan'], ['LB', 'Lebanon'],
  ['IL', 'Israel'], ['IQ', 'Iraq'], ['IR', 'Iran'], ['AF', 'Afghanistan'],
  ['KZ', 'Kazakhstan'], ['UZ', 'Uzbekistan'], ['MN', 'Mongolia'], ['GE', 'Georgia'],
  ['AM', 'Armenia'], ['AZ', 'Azerbaijan'], ['CY', 'Cyprus'], ['JM', 'Jamaica'],
];

function flagEmoji(code: string) {
  return Array.from(code.toUpperCase())
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('');
}

function countrySpellings(code: string, fallback: string): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((locale) => {
    try {
      const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
      return [locale, displayNames.of(code) ?? fallback];
    } catch {
      return [locale, fallback];
    }
  })) as Record<Locale, string>;
}

const FLAG_WORDS: WordItem[] = COUNTRIES.map(([code, fallback]) => ({
  id: `flag_${code.toLowerCase()}`,
  category: 'flags',
  spellings: countrySpellings(code, fallback),
  emoji: flagEmoji(code),
}));

const EXISTING_FLAG_IDS = new Set([
  'flag_it', 'flag_ca', 'flag_ke', 'flag_cu', 'flag_mt', 'flag_mx',
  'flag_eg', 'flag_np', 'flag_pe', 'flag_pl', 'flag_cn', 'flag_cl',
]);

/**
 * Curated starter expansion for ages 4–7.
 *
 * The larger source lists stay above as an editorial backlog, but are not
 * shipped in the learning path until their translations, artwork and reading
 * difficulty have been reviewed. Quantity must not outrank recognisability.
 */
export const expandedWords: WordItem[] = [
  ...simpleWords(
    'animals',
    ANIMALS.filter(([id]) => [
      'anim_crab', 'anim_deer', 'anim_goat', 'anim_sheep', 'anim_camel',
      'anim_donkey', 'anim_zebra', 'anim_snake', 'anim_frog', 'anim_seal',
      'anim_goose',
    ].includes(id)),
  ),
];
