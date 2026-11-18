import type { BookEntry } from '../../../../../types';
import type { Backup } from '../../../../../api/data/data';
import { m } from '../../../../../paraglide/messages.js';
import { localToday as today } from '../../../../../utils/readDate';
import { CSV_HEAD, readingListRows, toCsv } from './readingListCsv';

const download = (text: string, name: string, type: string) => {
  const link = document.createElement('a');

  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
};

/**
 * Downloads the reading list as a CSV file. The file name contains the date of today.
 * @param names - The country names, by country code.
 */
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

/**
 * Downloads the full backup of the atlas as a JSON file. The file name contains the date of today.
 */
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

/**
 * Downloads an example reading list as a CSV file.
 * The example has five books. One book has no date, to show that the date is optional.
 */
export const exportExample = () =>
  download(
    toCsv(EXAMPLE),
    'read-the-globe-example-reading-list.csv',
    'text/csv'
  );

/**
 * Gets the number of books as text, for example "1 book" or "3 books".
 */
export const bookCount = (count: number) => m.count_book({ count: count });
/**
 * Gets the number of goals as text, for example "1 goal" or "2 goals".
 */
export const goalCount = (count: number) => m.count_goal({ count: count });

/**
 * Tells what a clear or a restore removes from the atlas, for example "3 books and 1 goal".
 * The text does not include a part with a count of 0. If both counts are 0, the text is "nothing yet".
 */
export const atlasWords = (books: number, goals: number) =>
  books && goals
    ? m.account_and({ a: bookCount(books), b: goalCount(goals) })
    : books
      ? bookCount(books)
      : goals
        ? goalCount(goals)
        : m.account_nothing_yet();

/**
 * Makes the report of a reading list import. Each part of the report is one sentence.
 * The report gives the number of books that the import added.
 * If the import skipped duplicates or rows, the report also gives these numbers.
 */
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
