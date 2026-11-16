import type { BookEntry } from '../src/types';

/* A few books for the stories that show a reader's atlas or shelf. Countries are the map's numeric ISO codes. */

export const COUNTRY_NAMES: Record<string, string> = {
  '076': 'Brazil',
  '170': 'Colombia',
  '250': 'France',
  '392': 'Japan',
  '566': 'Nigeria',
  '643': 'Russia',
  '826': 'United Kingdom',
};

export const BOOKS: BookEntry[] = [
  {
    id: 1,
    title: 'One Hundred Years of Solitude',
    readOn: '2026-03-14',
    author: {
      name: 'Gabriel García Márquez',
      country: { name: 'Colombia', code: '170' },
    },
    places: [
      {
        id: 1,
        name: 'Macondo',
        lon: -74.2,
        lat: 10.4,
        countryCode: '170',
        bookId: 1,
      },
    ],
    goals: [],
  },
  {
    id: 2,
    title: 'Things Fall Apart',
    readOn: '2026-01-02',
    author: {
      name: 'Chinua Achebe',
      country: { name: 'Nigeria', code: '566' },
    },
    places: [
      {
        id: 2,
        name: '',
        lon: 7.5,
        lat: 6.5,
        countryCode: '566',
        bookId: 2,
      },
    ],
    goals: [],
  },
  {
    id: 3,
    title: 'The Remains of the Day',
    readOn: '2025-11-20',
    author: { name: 'Kazuo Ishiguro', country: { name: 'Japan', code: '392' } },
    places: [
      {
        id: 3,
        name: 'Darlington Hall',
        lon: -1.5,
        lat: 52.1,
        countryCode: '826',
        bookId: 3,
      },
    ],
    goals: [],
  },
  {
    id: 4,
    title: 'A Wizard of Earthsea',
    readOn: null,
    author: null,
    places: [
      {
        id: 4,
        name: 'Earthsea',
        lon: 0,
        lat: 0,
        bookId: 4,
        imagined: true,
      },
    ],
    goals: [],
  },
];
