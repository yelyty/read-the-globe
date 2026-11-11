import { describe, expect, it } from 'vitest';
import { countryFrom, splitStates } from './countryFrom';
import { worldsOf } from './worlds';

const names = {
  '643': 'Russia',
  '804': 'Ukraine',
  '208': 'Denmark',
  '304': 'Greenland',
  '144': 'Sri Lanka',
  '840': 'United States of America',
};

describe('countryFrom', () => {
  it("finds the map's own names, in any case", () => {
    expect(countryFrom(' denmark ', names)).toEqual({ code: '208' });
  });

  it('knows everyday names', () => {
    expect(countryFrom('USA', names)).toEqual({ code: '840' });
  });

  it('counts an old name as the country there today', () => {
    expect(countryFrom('Ceylon', names)).toEqual({
      code: '144',
      then: 'Ceylon',
    });
  });

  it('waits for a pick when a state split', () => {
    expect(splitStates('the Soviet Union')).toHaveLength(15);
    expect(countryFrom('USSR', names)).toBeNull();

    expect(countryFrom('USSR', names, '804')).toEqual({
      code: '804',
      then: 'USSR',
    });

    expect(splitStates('Ceylon')).toBeNull();
  });

  it("keeps a territory's own shape, counted under its country", () => {
    expect(countryFrom('Greenland', names)).toEqual({
      code: '304',
      as: 'Greenland',
      under: '208',
    });

    expect(countryFrom('Faroe Islands', names)).toEqual({
      code: '208',
      as: 'Faroe Islands',
      under: '208',
    });
  });
});

describe('worldsOf', () => {
  const place = (name: string, imagined: boolean) => ({
    id: name,
    name,
    lon: 0,
    lat: 0,
    bookId: 'b',
    imagined,
  });

  it('groups imagined places by name, then saved worlds with no books', () => {
    const books = [
      {
        id: '1',
        title: '1',
        author: null,
        goals: [],
        places: [place('Earthsea', true), place('Paris', false)],
      },
      {
        id: '2',
        title: '2',
        author: null,
        goals: [],
        places: [place('earthsea ', true)],
      },
    ];

    const rows = worldsOf(books, [
      { id: 'w', name: 'Narnia' },
      { id: 'x', name: 'EARTHSEA' },
    ]);

    expect(
      rows.map((row) => [row.name, row.books.length, row.saved?.id])
    ).toEqual([
      ['Earthsea', 2, 'x'],
      ['Narnia', 0, 'w'],
    ]);
  });
});
