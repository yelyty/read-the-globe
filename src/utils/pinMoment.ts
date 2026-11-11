import type { BookEntry } from '../types';
import { counted, type Marks } from './atlasMarks';
import { CONTINENT_NAMES, CONTINENT_OF } from './continents';
import { PARENT } from './countryFrom';

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
const list = (a: string[]) => (a.length === 2 ? a.join(' and ') : a.join(', '));

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
  const gained = gainedCodes.map(
    (c) => `${name(c)} now has a story set there.`
  );
  if (authorCode && !fresh.includes(authorCode) && !had(authorCode, 'author')) {
    gained.push(`${name(authorCode)} now has an author from there.`);
    gainedCodes.push(authorCode);
  }

  let where = [
    fresh.length === 1
      ? `${name(fresh[0])} is new on your atlas.`
      : fresh.length
        ? `${list(fresh.map(name))} are new on your atlas.`
        : '',
    ...gained,
  ]
    .filter(Boolean)
    .join(' ');
  // a book that adds no new mark is a return: say which, and how many times the reader has been
  const back = placeCodes[0];
  if (!where && back)
    where = `Back in ${name(back)}: the ${ord(after[back].set.length)} story set there.`;
  else if (!where && authorCode)
    where = `${name(authorCode)} again: the ${ord(after[authorCode].author.length)} author from there.`;

  const first = !was.size;
  // the first country on a continent is a stop worth naming
  const conts = [
    ...new Set(fresh.map((c) => CONTINENT_OF[c]).filter(Boolean)),
  ].filter((cont) => [...was].every((c) => CONTINENT_OF[c] !== cont));
  const stop =
    !first && conts.length
      ? `${conts.length === 1 ? 'First stop in' : 'First stops in'} ${list(conts.map((c) => CONTINENT_NAMES[c]))}. `
      : '';

  const moved = [...fresh, ...gainedCodes];
  return {
    targets: (moved.length
      ? [...new Set(moved)]
      : [back ?? authorCode].filter((c): c is string => !!c)
    ).slice(0, 5),
    line: first
      ? `Your atlas has begun. ${where}`
      : `Pinned ${book.title}. ${stop}${where}`,
    returning: !first && !moved.length,
  };
}
