import { describe, expect, it } from 'vitest';
import type { BookEntry } from '../types';
import { atlasMarks } from './atlasMarks';
import { pinMoment } from './pinMoment';

const names = {
  '250': 'France',
  '392': 'Japan',
  '076': 'Brazil',
  '208': 'Denmark',
  '304': 'Greenland',
};

const book = (id: string, author: string, places: string[]): BookEntry => ({
  id,
  title: id,
  author: { name: 'A', country: { name: author, code: author } },
  places: places.map((countryCode, i) => ({
    id: `${id}${i}`,
    name: '',
    lon: 0,
    lat: 0,
    countryCode,
    bookId: id,
  })),
  goals: [],
});

const moment = (shelf: BookEntry[], b: BookEntry) =>
  pinMoment(b, atlasMarks(shelf), atlasMarks([...shelf, b]), names);

describe('pinMoment', () => {
  it('begins the atlas with the first book', () => {
    expect(moment([], book('Kitchen', '392', ['392']))).toEqual({
      targets: ['392'],
      line: 'Your atlas has begun. Japan is new on your atlas.',
      returning: false,
    });
  });

  it('names a new country and the first stop on its continent', () => {
    const m = moment([book('a', '392', ['392'])], book('b', '392', ['076']));

    expect(m.line).toBe(
      'Pinned b. First stop in South America. Brazil is new on your atlas.'
    );

    expect(m.targets).toEqual(['076']);
  });

  it('says when a country gains its other mark', () => {
    const m = moment([book('a', '250', ['392'])], book('b', '392', ['392']));

    expect(m.line).toBe('Pinned b. Japan now has an author from there.');
  });

  it('counts a return visit', () => {
    const m = moment([book('a', '392', ['392'])], book('b', '392', ['392']));

    expect(m).toEqual({
      targets: ['392'],
      line: 'Pinned b. Back in Japan: the second story set there.',
      returning: true,
    });
  });

  it('counts a territory under its country', () => {
    const m = moment([book('a', '392', ['392'])], book('b', '392', ['304']));

    expect(m.line).toBe(
      'Pinned b. First stop in Europe. Denmark is new on your atlas.'
    );
  });
});
