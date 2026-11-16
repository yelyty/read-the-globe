import { describe, expect, it } from 'vitest';

import type { BookDraft } from '../../api/books/books';
import type { BookEntry, Goal } from '../../types';
import {
  draftOf,
  duplicateOf,
  landingFor,
  PLACE_KEY,
  readLog,
  type LogFields,
} from './bookLog';
import { row } from './placeRow';

const names = {
  '250': 'France',
  '380': 'Italy',
  '392': 'Japan',
  '804': 'Ukraine',
  '643': 'Russia',
};

const TODAY = '2026-11-15';

const fields = (extra: Partial<LogFields> = {}): LogFields => ({
  title: 'Solaris',
  author: 'Stanisław Lem',
  country: 'Japan',
  authorPick: '',
  rows: [row()],
  month: '',
  year: '',
  startMonth: '',
  goalIds: [],
  ...extra,
});

const read = (extra: Partial<LogFields> = {}) =>
  readLog(fields(extra), names, TODAY);

// a book saved earlier, and the one being saved now
const OLD_ID = 2;
const NEW_ID = 3;

const entry = (draft: BookDraft, id = 1): BookEntry => ({
  id,
  title: draft.title,
  readOn: draft.readOn,
  author: {
    name: draft.author,
    country: { code: draft.authorCountry, name: '' },
  },
  places: draft.places.map((place, i) => ({
    id: i,
    name: place.name,
    lon: 0,
    lat: 0,
    countryCode: place.country,
    bookId: id,
    imagined: place.imagined,
  })),
  goals: draft.goalIds.map((goalId) => ({ goalId })),
});

describe('reading the log form', () => {
  it('asks for a title, an author and the author’s country, and saves nothing until then', () => {
    const empty = read({ title: ' ', author: '', country: '' });

    expect(Object.keys(empty.errors).sort()).toEqual([
      'author',
      'country',
      'title',
    ]);

    expect(empty.draft).toBeNull();
  });

  it('builds the book to save, trimmed, with blank place rows left out', () => {
    const { errors, draft } = read({
      title: '  Solaris ',
      author: ' Stanisław Lem ',
      rows: [row('Kyoto', 'Japan'), row('', '')],
      goalIds: [7],
    });

    expect(errors).toEqual({});

    expect(draft).toEqual({
      title: 'Solaris',
      author: 'Stanisław Lem',
      authorCountry: '392',
      readOn: null,
      places: [{ name: 'Kyoto', country: '392' }],
      goalIds: [7],
    });
  });

  it('reads "City, Country" typed into the place name', () => {
    const { draft } = read({ rows: [row('Paris, France', '')] });

    expect(draft?.places).toEqual([{ name: 'Paris', country: '250' }]);
  });

  it('names a place saved as just its country after the country', () => {
    const { draft } = read({ rows: [row('', 'Italy')] });

    expect(draft?.places).toEqual([{ name: 'Italy', country: '380' }]);
  });

  it('files a place it can’t place under that place’s row', () => {
    const place = row('Atlantis City', 'Atlantis');
    const { errors, draft } = read({ rows: [place] });

    expect(Object.keys(errors)).toEqual([`${PLACE_KEY}${place.key}`]);
    expect(errors[`${PLACE_KEY}${place.key}`]).toContain('Atlantis');
    expect(draft).toBeNull();
  });

  it('keeps an imagined world with no country, and never errs on it', () => {
    const { errors, draft } = read({ rows: [row('  Earthsea ', '', true)] });

    expect(errors).toEqual({});

    expect(draft?.places).toEqual([
      { name: 'Earthsea', country: null, imagined: true },
    ]);
  });

  it('waits for a pick when the author’s country is a state that split', () => {
    expect(read({ country: 'USSR' }).errors.country).toBeTruthy();

    expect(
      read({ country: 'USSR', authorPick: '804' }).draft?.authorCountry
    ).toBe('804');
  });

  it('previews the marks Pin it will make', () => {
    const { marks } = read({
      country: 'Japan',
      rows: [row('Kyoto', 'Japan'), row('Rome', 'Italy')],
    });

    expect(marks).toEqual({
      '392': { author: true, set: true },
      '380': { set: true },
    });
  });

  it('dates a book read in an earlier month to the 1st of it, and leaves an untouched date alone', () => {
    expect(read({ month: '03', year: '2024' }).draft?.readOn).toBe(
      '2024-03-01'
    );

    expect(read().draft?.readOn).toBeNull();
  });
});

describe('the same book twice', () => {
  const lem = read().draft!;

  it('finds a book with the same title and author, whatever the case', () => {
    const shelf = [
      entry({ ...lem, title: 'SOLARIS', author: 'stanisław lem' }),
    ];

    expect(duplicateOf(lem, shelf)?.id).toBe(1);
  });

  it('lets a different book through', () => {
    expect(
      duplicateOf(lem, [entry({ ...lem, title: 'Eden' })])
    ).toBeUndefined();
  });
});

describe('putting a removed book back', () => {
  it('saves the same book again', () => {
    const draft: BookDraft = {
      title: 'Solaris',
      author: 'Stanisław Lem',
      authorCountry: '392',
      readOn: '2024-03-01',
      places: [
        { name: 'Kyoto', country: '392', imagined: false },
        { name: 'Earthsea', country: null, imagined: true },
      ],
      goalIds: [7],
    };

    expect(draftOf(entry(draft))).toEqual(draft);
  });
});

describe('where a new book lands', () => {
  const japanGoal: Goal = {
    id: 1,
    kind: 'countries',
    name: 'Japan and Italy',
    continent: null,
    countryCodes: ['392', '380'],
    target: null,
    reachedOn: null,
  };

  it('says nothing of goals when none is crossed', () => {
    const draft = read({ rows: [row('Kyoto', 'Japan')] }).draft!;

    const landing = landingFor(NEW_ID, draft, {
      books: [],
      goals: [japanGoal],
      names,
    });

    expect(landing.bookId).toBe(NEW_ID);
    expect(landing.reached).toBeNull();
    expect(landing.targets).toContain('392');
  });

  it('names the goal a new book carries over its flag', () => {
    const earlier = entry(
      read({ rows: [row('Rome', 'Italy')], country: 'Italy' }).draft!,
      OLD_ID
    );

    const draft = read({ rows: [row('Kyoto', 'Japan')] }).draft!;

    const landing = landingFor(NEW_ID, draft, {
      books: [earlier],
      goals: [japanGoal],
      names,
    });

    expect(landing.reached).toContain('Japan and Italy');
  });

  it('doesn’t claim a goal already stamped reached', () => {
    const earlier = entry(
      read({ rows: [row('Rome', 'Italy')], country: 'Italy' }).draft!,
      OLD_ID
    );

    const draft = read({ rows: [row('Kyoto', 'Japan')] }).draft!;

    const landing = landingFor(NEW_ID, draft, {
      books: [earlier],
      goals: [{ ...japanGoal, reachedOn: '2026-01-01' }],
      names,
    });

    expect(landing.reached).toBeNull();
  });
});
