import { describe, expect, it } from 'vitest';
import type { BookEntry } from '../types';
import {
  booksFromCsv,
  parseCsv,
  readingListRows,
  toCsv,
} from './readingListCsv';

const names = {
  '566': 'Nigeria',
  '392': 'Japan',
  '826': 'United Kingdom',
  '840': 'United States of America',
};

describe('parseCsv', () => {
  it('reads quoted commas, quotes and line breaks, and drops blank lines', () => {
    expect(parseCsv('a,"b, c","say ""hi"""\r\n\r\n"x\ny",z')).toEqual([
      ['a', 'b, c', 'say "hi"'],
      ['x\ny', 'z'],
    ]);
  });
});

describe('booksFromCsv', () => {
  it('reads the example columns and counts the rows that can’t be a book', () => {
    const csv = [
      'title,author,author_country,places,date',
      'Americanah,Chimamanda Ngozi Adichie,Nigeria,"Lagos, Nigeria; United States; Middle-earth (imagined); Nowhere",2025-03',
      'No author,,Japan,,',
      'Somewhere,Someone,Atlantis,,',
    ].join('\n');

    expect(booksFromCsv(csv, names)).toEqual({
      books: [
        {
          title: 'Americanah',
          author: 'Chimamanda Ngozi Adichie',
          authorCountry: '566',
          readOn: '2025-03-01',
          places: [
            { name: 'Lagos', country: '566' },
            { name: 'United States of America', country: '840' },
            { name: 'Middle-earth', country: null, imagined: true },
          ],
        },
      ],
      problems: 2,
    });
  });

  it('reads back what the export writes', () => {
    const book: BookEntry = {
      id: 'b1',
      title: 'Norwegian Wood, "the" novel',
      readOn: '2025-05-20',
      author: {
        name: 'Haruki Murakami',
        country: { code: '392', name: 'Japan' },
      },
      places: [
        {
          id: 'p1',
          name: 'Tokyo',
          countryCode: '392',
          lon: 0,
          lat: 0,
          bookId: 'b1',
        },
        {
          id: 'p2',
          name: 'United Kingdom',
          countryCode: '826',
          lon: 0,
          lat: 0,
          bookId: 'b1',
        },
        {
          id: 'p3',
          name: 'Narnia',
          countryCode: null,
          imagined: true,
          lon: 0,
          lat: 0,
          bookId: 'b1',
        },
      ],
      goals: [],
    };

    const csv = toCsv(readingListRows([book], names));

    expect(booksFromCsv(csv, names).books).toEqual([
      {
        title: book.title,
        author: 'Haruki Murakami',
        authorCountry: '392',
        readOn: '2025-05-20',
        places: [
          { name: 'Tokyo', country: '392' },
          { name: 'United Kingdom', country: '826' },
          { name: 'Narnia', country: null, imagined: true },
        ],
      },
    ]);
  });
});
