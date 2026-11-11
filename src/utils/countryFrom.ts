import { toNumeric } from './toIsoNumeric';
import { englishName } from './countryNames';

/* The 195 are the UN's members, Vatican City and Palestine. Two kinds of name map onto them:
   - a state that no longer exists is counted as the country there today; where it split, the reader picks which (HIST);
   - a dependent territory counts toward the country it belongs to, and its own shape fills on the map too (TERR).
   Tables in ISO alpha-2 as in the mock, turned into the map's numeric codes below. */
const SU = 'ru ua by kz uz ge az am md lt lv ee kg tj tm';

const HIST_A2: Record<string, string> = {
  ussr: SU,
  'the ussr': SU,
  'soviet union': SU,
  'the soviet union': SU,
  yugoslavia: 'rs hr si ba me mk',
  czechoslovakia: 'cz sk',
  'austria-hungary': 'at hu cz sk hr si ua pl ro',
  'serbia and montenegro': 'rs me',
  'british india': 'in pk bd',
  'ottoman empire': 'tr',
  'the ottoman empire': 'tr',
  'russian empire': 'ru',
  'the russian empire': 'ru',
  prussia: 'de',
  'east germany': 'de',
  'west germany': 'de',
  gdr: 'de',
  ceylon: 'lk',
  rhodesia: 'zw',
  zaire: 'cd',
  siam: 'th',
  abyssinia: 'et',
  dahomey: 'bj',
  'upper volta': 'bf',
  mesopotamia: 'iq',
  kampuchea: 'kh',
  tanganyika: 'tz',
  'gold coast': 'gh',
  'south vietnam': 'vn',
  'north vietnam': 'vn',
  bechuanaland: 'bw',
  basutoland: 'ls',
  nyasaland: 'mw',
  'dutch east indies': 'id',
  'belgian congo': 'cd',
  'east pakistan': 'bd',
  'south yemen': 'ye',
  'north yemen': 'ye',
};

// [the territory's own shape, the country it counts toward]
const TERR_A2: Record<string, string> = {
  greenland: 'gl dk',
  'faroe islands': 'fo dk',
  'puerto rico': 'pr us',
  guam: 'gu us',
  'us virgin islands': 'vi us',
  'american samoa': 'as us',
  'hong kong': 'hk cn',
  macau: 'mo cn',
  macao: 'mo cn',
  'new caledonia': 'nc fr',
  'french polynesia': 'pf fr',
  'french guiana': 'gf fr',
  martinique: 'mq fr',
  guadeloupe: 'gp fr',
  réunion: 're fr',
  reunion: 're fr',
  bermuda: 'bm gb',
  gibraltar: 'gi gb',
  'falkland islands': 'fk gb',
  'cayman islands': 'ky gb',
  aruba: 'aw nl',
  curaçao: 'cw nl',
  curacao: 'cw nl',
  'cook islands': 'ck nz',
};

// the same old states and territories by their Czech and Ukrainian names
const SAME: Record<string, string> = {
  sssr: 'ussr',
  'sovětský svaz': 'ussr',
  jugoslávie: 'yugoslavia',
  československo: 'czechoslovakia',
  'rakousko-uhersko': 'austria-hungary',
  'osmanská říše': 'ottoman empire',
  'ruské impérium': 'russian empire',
  'ruská říše': 'russian empire',
  prusko: 'prussia',
  ndr: 'east germany',
  'východní německo': 'east germany',
  'západní německo': 'west germany',
  cejlon: 'ceylon',
  rhodesie: 'rhodesia',
  zair: 'zaire',
  habeš: 'abyssinia',
  'britská indie': 'british india',
  'srbsko a černá hora': 'serbia and montenegro',
  срср: 'ussr',
  'радянський союз': 'ussr',
  югославія: 'yugoslavia',
  чехословаччина: 'czechoslovakia',
  'австро-угорщина': 'austria-hungary',
  'османська імперія': 'ottoman empire',
  'російська імперія': 'russian empire',
  пруссія: 'prussia',
  ндр: 'east germany',
  цейлон: 'ceylon',
  родезія: 'rhodesia',
  заїр: 'zaire',
  сіам: 'siam',
  абіссінія: 'abyssinia',
  'британська індія': 'british india',
  'сербія і чорногорія': 'serbia and montenegro',
  grónsko: 'greenland',
  'faerské ostrovy': 'faroe islands',
  portoriko: 'puerto rico',
  hongkong: 'hong kong',
  'nová kaledonie': 'new caledonia',
  'francouzská polynésie': 'french polynesia',
  'francouzská guyana': 'french guiana',
  bermudy: 'bermuda',
  falklandy: 'falkland islands',
  'kajmanské ostrovy': 'cayman islands',
  гренландія: 'greenland',
  'фарерські острови': 'faroe islands',
  'пуерто-рико': 'puerto rico',
  'пуерто-ріко': 'puerto rico',
  гонконг: 'hong kong',
  макао: 'macau',
  'нова каледонія': 'new caledonia',
  'французька полінезія': 'french polynesia',
  'французька гвіана': 'french guiana',
  бермуди: 'bermuda',
  гібралтар: 'gibraltar',
  'фолклендські острови': 'falkland islands',
  'кайманові острови': 'cayman islands',
  гуам: 'guam',
};

// everyday names the map's own list spells differently
const ALIASES_A2: Record<string, string> = {
  usa: 'us',
  'united states': 'us',
  'united states of america': 'us',
  america: 'us',
  uk: 'gb',
  britain: 'gb',
  'great britain': 'gb',
  england: 'gb',
  scotland: 'gb',
  wales: 'gb',
  turkey: 'tr',
  türkiye: 'tr',
  korea: 'kr',
  'south korea': 'kr',
  'north korea': 'kp',
  'czech republic': 'cz',
  'ivory coast': 'ci',
  holland: 'nl',
  burma: 'mm',
  persia: 'ir',
  uae: 'ae',
  'democratic republic of the congo': 'cd',
  'dr congo': 'cd',
  'republic of the congo': 'cg',
  'holy see': 'va',
  'vatican city': 'va',
  swaziland: 'sz',
  macedonia: 'mk',
  'east timor': 'tl',
  'the gambia': 'gm',
  'the bahamas': 'bs',
  'russian federation': 'ru',
  'viet nam': 'vn',
  laos: 'la',
  'bosnia and herzegovina': 'ba',
  'central african republic': 'cf',
};

const codes = (a2: string) => a2.split(' ').map((code) => toNumeric(code)!);
const HIST: Record<string, string[]> = {};

for (const [oldName, alpha2s] of Object.entries(HIST_A2))
  HIST[oldName] = codes(alpha2s);
const TERR: Record<string, [area: string, parent: string]> = {};

for (const [territory, alpha2s] of Object.entries(TERR_A2))
  TERR[territory] = codes(alpha2s) as [string, string];

for (const [alias, en] of Object.entries(SAME)) {
  if (HIST[en]) HIST[alias] = HIST[en];
  if (TERR[en]) TERR[alias] = TERR[en];
}

const ALIASES: Record<string, string> = {};

for (const [alias, alpha2] of Object.entries(ALIASES_A2))
  ALIASES[alias] = toNumeric(alpha2)!;

/** a territory's own shape → the country it counts toward: the map fills both, the count takes only the country */
export const PARENT: Record<string, string> = Object.fromEntries(
  Object.values(TERR)
);

export const tidy = (text: string) => text.trim().replace(/\s+/g, ' ');

export type CountryMatch = {
  /** the code saved: the country, or a territory's own shape */
  code: string;
  /** an old name the book uses ("USSR"): counted as code */
  then?: string;
  /** a territory ("Greenland"), counted under `under` */
  as?: string;
  under?: string;
};

/** a state that split: the countries there today, for the reader to choose from */
export const splitStates = (typed: string) => {
  const successors = HIST[tidy(typed).toLowerCase()];

  return successors && successors.length > 1 ? successors : null;
};

/* What a typed country counts as. names is the map's own list (code → name), in the reader's language; the English name matches too; pick is the reader's choice for a
   state that split. ponytail: a linear scan of ~240 names per call, cheap next to a render */
export function countryFrom(
  typed: string,
  names: Record<string, string>,
  pick?: string
): CountryMatch | null {
  const raw = tidy(typed);
  const key = raw.toLowerCase();

  if (!key) return null;
  const territory = TERR[key];

  // a territory too small for the map's list is saved as its country
  if (territory)
    return {
      code: names[territory[0]] ? territory[0] : territory[1],
      as: raw,
      under: territory[1],
    };

  const code =
    Object.keys(names).find(
      (candidate) =>
        names[candidate].toLowerCase() === key ||
        englishName(candidate)?.toLowerCase() === key
    ) ?? ALIASES[key];

  if (code) return { code };
  const successors = HIST[key];

  if (!successors) return null;

  const to =
    successors.length === 1
      ? successors[0]
      : pick && successors.includes(pick)
        ? pick
        : null;

  return to ? { code: to, then: raw } : null;
}
