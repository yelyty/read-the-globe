import { describe, expect, it } from 'vitest';

import type { BookEntry, Place } from '../types';
import { idFor } from '../testing/idFor';
import { sameWorld, worldsOf } from './worlds';

const place = (name: string, imagined = true): Place => ({
  id: 0,
  name,
  lon: 0,
  lat: 0,
  countryCode: imagined ? null : '250',
  bookId: 0,
  imagined,
});

const book = (title: string, places: Place[] | undefined): BookEntry => ({
  id: idFor(title),
  title,
  author: null,
  places: places as Place[],
  goals: [],
});

describe('worldsOf', () => {
  it('groups the books’ imagined places by name, whatever the case and spacing', () => {
    const hobbit = book('The Hobbit', [place('Middle-earth')]);
    const rings = book('The Lord of the Rings', [place(' middle-EARTH ')]);

    const [world] = worldsOf([hobbit, rings], []);

    expect(world.name).toBe('Middle-earth');
    expect(world.books).toEqual([hobbit, rings]);
  });

  it('counts a book once, however often it goes to a world', () => {
    const odyssey = book('Odyssey', [place('Ithaca'), place('ithaca')]);

    expect(worldsOf([odyssey], [])[0].books).toEqual([odyssey]);
  });

  it('skips real places, nameless places and books with no places', () => {
    const books = [
      book('Paris', [place('Paris', false)]),
      book('Blank', [place('   ')]),
      book('None', undefined),
    ];

    expect(worldsOf(books, [])).toEqual([]);
  });

  it('pins a saved world to the books that already go there', () => {
    const narnia = book('Narnia', [place('Narnia')]);
    const saved = { id: 'w1', name: 'NARNIA' };

    expect(worldsOf([narnia], [saved])).toEqual([
      { name: 'Narnia', books: [narnia], saved },
    ]);
  });

  it('lists a saved world no book has gone to yet', () => {
    const saved = { id: 'w2', name: 'Earthsea' };

    expect(worldsOf([], [saved])).toEqual([
      { name: 'Earthsea', books: [], saved },
    ]);
  });

  it('puts the worlds with most books first, then by name', () => {
    const books = [
      book('a', [place('Oz')]),
      book('b', [place('Narnia')]),
      book('c', [place('Narnia')]),
      book('d', [place('Gondor')]),
    ];

    expect(worldsOf(books, []).map((world) => world.name)).toEqual([
      'Narnia',
      'Gondor',
      'Oz',
    ]);
  });
});

describe('sameWorld', () => {
  it('matches names whatever the case and spacing', () => {
    expect(sameWorld(' Narnia', 'narnia ')).toBe(true);
  });

  it('tells different worlds apart', () => {
    expect(sameWorld('Narnia', 'Oz')).toBe(false);
  });
});
