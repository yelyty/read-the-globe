import type { BookEntry } from '../types';
import { m } from '../paraglide/messages.js';
import { getLocale } from '../paraglide/runtime.js';
import { authorCountry, storyCountries } from './book';
import { counted, type Marks } from './atlasMarks';
import { CONTINENT_OF, continentName } from './continents';
import { PARENT } from './countryFrom';

// English ordinals; Czech and Ukrainian say the number ("2.", "2-та")
const ORD = [
  '',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
];

// past tenth: 21st, 22nd, 23rd, but 11th, 12th, 13th
const ORD_SUFFIX = ['th', 'st', 'nd', 'rd'];
const TEENS = { from: 11, to: 13 };
const HUNDRED = 100;
const TEN = 10;

const ord = (num: number) => {
  if (ORD[num]) return ORD[num];
  const lastTwo = num % HUNDRED;
  const teen = lastTwo >= TEENS.from && lastTwo <= TEENS.to;

  return `${num}${teen ? 'th' : (ORD_SUFFIX[num % TEN] ?? 'th')}`;
};

// the most countries a pin flies to at once
const MAX_TARGETS = 5;

const list = (items: string[]) =>
  new Intl.ListFormat(getLocale(), { type: 'conjunction' }).format(items);

export type PinMoment = {
  /** the countries the pin flies to: the ones this book adds or gives a new mark, else where it went back to */
  targets: string[];
  /** the one line said when the pins land */
  line: string;
  /** no new country or mark: no flight, just a ring where the book went back to */
  returning: boolean;
};

/**
 * Gets the moment after Pin it: which countries the book adds, and the line that tells where the reader went.
 * @param before - The marks of the atlas without the book.
 * @param after - The marks of the atlas with the book.
 */
export const pinMoment = (
  book: BookEntry,
  before: Marks,
  after: Marks,
  names: Record<string, string>
): PinMoment => {
  const name = (code: string) => names[code] ?? code;
  const was = new Set(counted(before));
  const fresh = counted(after).filter((code) => !was.has(code));

  const had = (code: string, kind: 'set' | 'author') =>
    !!before[code]?.[kind].length;

  // a territory speaks for its country
  const country = (code?: string | null) =>
    code ? (PARENT[code] ?? code) : undefined;

  const placeCodes = [
    ...new Set(
      storyCountries(book)
        .map(country)
        .filter((code): code is string => !!code)
    ),
  ];

  const authorCode = country(authorCountry(book));

  // a country already on the atlas can still gain its other mark
  const gainedCodes = placeCodes.filter(
    (code) => !fresh.includes(code) && !had(code, 'set')
  );

  const gained = gainedCodes.map((code) =>
    m.pin_gained_set({ country: name(code) })
  );

  if (authorCode && !fresh.includes(authorCode) && !had(authorCode, 'author')) {
    gained.push(m.pin_gained_author({ country: name(authorCode) }));
    gainedCodes.push(authorCode);
  }

  let where = [
    fresh.length === 1
      ? m.pin_new_one({ country: name(fresh[0]) })
      : fresh.length
        ? m.pin_new_many({ countries: list(fresh.map(name)) })
        : '',
    ...gained,
  ]
    .filter(Boolean)
    .join(' ');

  // a book that adds no new mark is a return: say which, and how many times the reader has been
  const back = placeCodes[0];

  if (!where && back)
    where = m.pin_back_set({
      country: name(back),
      ord: ord(after[back].set.length),
      count: after[back].set.length,
    });
  else if (!where && authorCode)
    where = m.pin_back_author({
      country: name(authorCode),
      ord: ord(after[authorCode].author.length),
      count: after[authorCode].author.length,
    });

  const first = !was.size;

  // the first country on a continent is a stop worth naming
  const conts = [
    ...new Set(fresh.map((code) => CONTINENT_OF[code]).filter(Boolean)),
  ].filter((cont) => [...was].every((code) => CONTINENT_OF[code] !== cont));

  const stop =
    !first && conts.length
      ? `${(conts.length === 1 ? m.pin_first_stop : m.pin_first_stops)({ continents: list(conts.map((cont) => continentName(cont))) })} `
      : '';

  const moved = [...fresh, ...gainedCodes];

  return {
    targets: (moved.length
      ? [...new Set(moved)]
      : [back ?? authorCode].filter((code): code is string => !!code)
    ).slice(0, MAX_TARGETS),
    line: first
      ? m.pin_begun({ where })
      : m.pin_pinned({ title: book.title, stop, where }),
    returning: !first && !moved.length,
  };
};
