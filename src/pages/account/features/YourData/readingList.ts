import type { BookEntry } from '../../../../types';
import type { Backup } from '../../../../api/data/data';
import {
  CSV_HEAD,
  readingListRows,
  toCsv,
} from '../../../../utils/readingListCsv';

const today = () => new Date().toISOString().slice(0, 10);

const download = (text: string, name: string, type: string) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 0);
};

// in the importer's own columns, so it round-trips
export function exportReadingList(
  books: BookEntry[],
  names: Record<string, string>
) {
  download(
    toCsv(readingListRows(books, names)),
    `read-the-globe-reading-list-${today()}.csv`,
    'text/csv'
  );
}

export function exportBackup(backup: Backup) {
  download(
    JSON.stringify(backup, null, 2),
    `read-the-globe-backup-${today()}.json`,
    'application/json'
  );
}

// a reading list to fill in: five well-known books, one date left blank to show it's optional
const EXAMPLE = [
  CSV_HEAD,
  [
    'Things Fall Apart',
    'Chinua Achebe',
    'Nigeria',
    'Umuofia, Nigeria',
    '2025-01-12',
  ],
  [
    'One Hundred Years of Solitude',
    'Gabriel García Márquez',
    'Colombia',
    'Macondo, Colombia',
    '2025-03-02',
  ],
  ['Norwegian Wood', 'Haruki Murakami', 'Japan', 'Tokyo, Japan', '2025-05-20'],
  [
    'The God of Small Things',
    'Arundhati Roy',
    'India',
    'Ayemenem, India; Kerala, India',
    '2025-08-09',
  ],
  [
    'Americanah',
    'Chimamanda Ngozi Adichie',
    'Nigeria',
    'Lagos, Nigeria; United States; London, United Kingdom',
    '',
  ],
];

export const exportExample = () =>
  download(
    toCsv(EXAMPLE),
    'read-the-globe-example-reading-list.csv',
    'text/csv'
  );

export const bookCount = (n: number) => `${n} ${n === 1 ? 'book' : 'books'}`;
export const goalCount = (n: number) => `${n} ${n === 1 ? 'goal' : 'goals'}`;
const rowCount = (n: number) => `${n} ${n === 1 ? 'row' : 'rows'}`;

// what clearing or replacing the atlas takes away, without a "0 goals"
export const atlasWords = (books: number, goals: number) =>
  books && goals
    ? `${bookCount(books)} and ${goalCount(goals)}`
    : books
      ? bookCount(books)
      : goals
        ? goalCount(goals)
        : 'nothing yet';

// the result of a reading list import, a sentence for each part
export const importReport = (
  added: number,
  duplicates: number,
  problems: number
) =>
  [
    `Imported ${bookCount(added)}.`,
    duplicates ? `Skipped ${bookCount(duplicates)} already on your shelf.` : '',
    problems
      ? `Skipped ${rowCount(problems)}: each needs a title, an author and a country from the list.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');
