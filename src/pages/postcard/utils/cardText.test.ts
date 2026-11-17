import { afterEach, describe, expect, it, vi } from 'vitest';

import type { BookEntry, Goal } from '../../../types';
import { cardFileName, cardLabel, cardShare, cardTitle } from './cardText';
import type { yearSum } from './yearSum';

const goal = (kind: Goal['kind'], name: string): Goal => ({
  id: 1,
  kind,
  name,
  continent: null,
  countryCodes: null,
  target: 5,
  reachedOn: '2026-05-01',
});

const yearSummary = {
  books: [{}, {}] as BookEntry[],
  codes: ['250', '392'],
  continents: 2,
  line: '2026: 2 countries, 2 continents',
} satisfies ReturnType<typeof yearSum>;

const stats = { order: [], countries: 4, continents: 2, books: 5 };

describe('cardTitle', () => {
  it("uses the reader's first name when there is one", () => {
    expect(cardTitle('Ada', null)).toBe('Ada’s Reading Atlas');
    expect(cardTitle('Ada', '2026')).toBe('Ada’s 2026');
  });

  it('says "My" without a first name', () => {
    expect(cardTitle('', null)).toBe('My Reading Atlas');
    expect(cardTitle('', '2026')).toBe('My 2026');
  });
});

describe('cardLabel', () => {
  it("reads a theme goal's progress in books", () => {
    expect(
      cardLabel({
        goal: goal('theme', 'Island stories'),
        progress: { done: 5, total: 5, all: [], reached: [] },
        yearSummary: null,
        kind: 'authors',
        stats,
      })
    ).toBe(
      'A postcard: Greetings from Island stories. 5 of 5 books, postmarked Goal reached.'
    );
  });

  it("reads a place goal's progress in countries", () => {
    expect(
      cardLabel({
        goal: goal('countries', 'Island nations'),
        progress: { done: 1, total: 1, all: ['388'], reached: ['388'] },
        yearSummary: null,
        kind: 'authors',
        stats,
      })
    ).toContain('Greetings from Island nations. 1 of 1 country,');
  });

  it("reads a year's line and its number of books", () => {
    expect(
      cardLabel({
        goal: null,
        progress: null,
        yearSummary,
        kind: 'authors',
        stats,
      })
    ).toBe(
      'Your year-end postcard. 2026: 2 countries, 2 continents 2 books, with a stamp for each country.'
    );
  });

  it("reads the atlas card's kind and numbers", () => {
    expect(
      cardLabel({
        goal: null,
        progress: null,
        yearSummary: null,
        kind: 'settings',
        stats,
      })
    ).toBe(
      'Your postcard: where your books are set. 4 of 195 countries, 5 books, 2 continents, with a stamp for each country.'
    );
  });

  it('reads a goal without its progress as the atlas card', () => {
    expect(
      cardLabel({
        goal: goal('theme', 'Island stories'),
        progress: null,
        yearSummary: null,
        kind: 'authors',
        stats,
      })
    ).toMatch(/^Your postcard: where your authors are from\./);
  });
});

describe('cardFileName', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("names a goal's card after the goal", () => {
    expect(cardFileName(goal('theme', 'Island stories'), '2026')).toBe(
      'read-the-globe-island-stories-postcard.png'
    );
  });

  it("names a year's card after the year", () => {
    expect(cardFileName(null, '2025')).toBe('read-the-globe-2025-postcard.png');
  });

  it("dates the atlas card with today's day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-17T12:00:00Z'));

    expect(cardFileName(null, null)).toBe(
      'read-the-globe-postcard-2026-11-17.png'
    );
  });
});

describe('cardShare', () => {
  it('shares a reached goal', () => {
    expect(
      cardShare({
        goal: goal('theme', 'Island stories'),
        yearSummary,
        kind: 'authors',
        stats,
      })
    ).toEqual({
      title: 'Goal reached: Island stories',
      text: 'I reached Island stories on my reading atlas.',
    });
  });

  it("shares a year's line", () => {
    expect(
      cardShare({ goal: null, yearSummary, kind: 'authors', stats })
    ).toEqual({
      title: 'My reading atlas',
      text: 'My 2026: 2 countries, 2 continents',
    });
  });

  it("shares the atlas card's count of countries, in the kind's words", () => {
    expect(
      cardShare({ goal: null, yearSummary: null, kind: 'authors', stats }).text
    ).toBe('Authors from 4 of 195 countries so far, on my reading atlas.');

    expect(
      cardShare({ goal: null, yearSummary: null, kind: 'settings', stats }).text
    ).toBe('Stories set in 4 of 195 countries so far, on my reading atlas.');
  });
});
