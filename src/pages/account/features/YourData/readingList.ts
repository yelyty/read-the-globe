import type { BookEntry } from '../../../../types';
import type { Backup } from '../../../../api/data/data';
import {
  CSV_HEAD,
  readingListRows,
  toCsv,
} from '../../../../utils/readingListCsv';
import { m } from '../../../../paraglide/messages.js';
import { localToday as today } from '../../../../utils/readDate';

const download = (text: string, name: string, type: string) => {
  const link = document.createElement('a');

  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
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

export const bookCount = (count: number) => m.count_book({ count: count });
export const goalCount = (count: number) => m.count_goal({ count: count });

// what clearing or replacing the atlas takes away, without a "0 goals"
export const atlasWords = (books: number, goals: number) =>
  books && goals
    ? m.account_and({ a: bookCount(books), b: goalCount(goals) })
    : books
      ? bookCount(books)
      : goals
        ? goalCount(goals)
        : m.account_nothing_yet();

// the result of a reading list import, a sentence for each part
export const importReport = (
  added: number,
  duplicates: number,
  problems: number
) =>
  [
    m.account_imported({ books: bookCount(added) }),
    duplicates
      ? m.account_skipped_duplicates({ books: bookCount(duplicates) })
      : '',
    problems
      ? m.account_skipped_rows({ rows: m.count_row({ count: problems }) })
      : '',
  ]
    .filter(Boolean)
    .join(' ');
