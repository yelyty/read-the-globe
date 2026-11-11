import type { BookEntry } from '../types';
import { counted, type Marks } from './atlasMarks';
import { CONTINENT_OF, continentName } from './continents';
import { PARENT } from './countryFrom';
import { m } from '../paraglide/messages.js';
import { getLocale } from '../paraglide/runtime.js';

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
const ord = (n: number) =>
  ORD[n] ??
  `${n}${n % 100 > 10 && n % 100 < 14 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')}`;
const list = (a: string[]) =>
  new Intl.ListFormat(getLocale(), { type: 'conjunction' }).format(a);

export type PinMoment = {
  /** the countries the pin flies to: the ones this book adds or gives a new mark, else where it went back to */
  targets: string[];
  /** the one line said when the pins land */
  line: string;
  /** no new country or mark: no flight, just a ring where the book went back to */
  returning: boolean;
};

/* The one authored moment after Pin it: which countries the book adds, and the line that says where you went.
   before and after are the atlas's marks without and with the book. */
export function pinMoment(
  book: BookEntry,
  before: Marks,
  after: Marks,
  names: Record<string, string>
): PinMoment {
  const name = (c: string) => names[c] ?? c;
  const was = new Set(counted(before));
  const fresh = counted(after).filter((c) => !was.has(c));
  const had = (c: string, kind: 'set' | 'author') => !!before[c]?.[kind].length;
  // a territory speaks for its country
  const country = (c?: string | null) => (c ? (PARENT[c] ?? c) : undefined);
  const placeCodes = [
    ...new Set(
      book.places
        .map((p) => country(p.countryCode))
        .filter((c): c is string => !!c)
    ),
  ];
  const authorCode = country(book.author?.country?.code);
  // a country already on the atlas can still gain its other mark
  const gainedCodes = placeCodes.filter(
    (c) => !fresh.includes(c) && !had(c, 'set')
  );
  const gained = gainedCodes.map((c) => m.pin_gained_set({ country: name(c) }));
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
    ...new Set(fresh.map((c) => CONTINENT_OF[c]).filter(Boolean)),
  ].filter((cont) => [...was].every((c) => CONTINENT_OF[c] !== cont));
  const stop =
    !first && conts.length
      ? `${(conts.length === 1 ? m.pin_first_stop : m.pin_first_stops)({ continents: list(conts.map((c) => continentName(c))) })} `
      : '';

  const moved = [...fresh, ...gainedCodes];
  return {
    targets: (moved.length
      ? [...new Set(moved)]
      : [back ?? authorCode].filter((c): c is string => !!c)
    ).slice(0, 5),
    line: first
      ? m.pin_begun({ where })
      : m.pin_pinned({ title: book.title, stop, where }),
    returning: !first && !moved.length,
  };
}
