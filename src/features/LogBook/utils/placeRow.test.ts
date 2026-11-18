import { describe, expect, it } from 'vitest';

import { row, startRows } from './placeRow';

const NAMES: Record<string, string> = { '250': 'France', '392': 'Japan' };
const name = (code?: string | null) => (code ? (NAMES[code] ?? '') : '');

describe('row', () => {
  it('starts empty, real, with no pick and closed', () => {
    expect(row()).toMatchObject({
      name: '',
      country: '',
      imagined: false,
      pick: '',
      open: false,
    });
  });

  it('keeps what it’s given', () => {
    expect(row('Narnia', '', true)).toMatchObject({
      name: 'Narnia',
      imagined: true,
    });
  });

  it('gives every row its own key', () => {
    const keys = [row(), row(), row()].map((each) => each.key);

    expect(new Set(keys).size).toBe(3);
  });
});

describe('startRows', () => {
  it('shows an edited book’s places beside their countries', () => {
    const rows = startRows(
      [{ name: 'Paris', countryCode: '250' }],
      { country: '' },
      name
    );

    expect(rows).toMatchObject([
      { name: 'Paris', country: 'France', imagined: false },
    ]);
  });

  it('shows a place saved as just its country as an empty name', () => {
    const rows = startRows(
      [{ name: 'Japan', countryCode: '392' }],
      { country: '' },
      name
    );

    expect(rows).toMatchObject([{ name: '', country: 'Japan' }]);
  });

  it('shows an imagined place as its world, with no country', () => {
    const rows = startRows(
      [{ name: 'Narnia', countryCode: null, imagined: true }],
      { country: 'France' },
      name
    );

    expect(rows).toMatchObject([
      { name: 'Narnia', country: '', imagined: true },
    ]);
  });

  it('starts a new book from the country Log a book was opened on', () => {
    expect(startRows([], { country: 'Japan' }, name)).toMatchObject([
      { name: '', country: 'Japan', imagined: false },
    ]);
  });

  it('starts a new book from the world Log a book was opened on', () => {
    expect(
      startRows([], { world: 'Earthsea', country: 'Japan' }, name)
    ).toMatchObject([{ name: 'Earthsea', country: '', imagined: true }]);
  });
});
