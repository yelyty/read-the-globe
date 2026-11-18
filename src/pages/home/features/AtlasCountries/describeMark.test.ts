import { describe, expect, it } from 'vitest';

import type { BookEntry } from '../../../../types';
import { m } from '../../../../paraglide/messages.js';
import { describe as describeMark } from './describeMark';

const book = { id: 1 } as BookEntry;

const set = (count: number) =>
  m.home_n_set({ stories: m.count_story({ count }) });

const from = (count: number) =>
  m.home_n_from({ authors: m.count_author({ count }) });

describe('describeMark', () => {
  it('says how many stories are set in a country', () => {
    expect(describeMark({ set: [book, book], author: [] })).toBe(set(2));
  });

  it('says how many authors come from it', () => {
    expect(describeMark({ set: [], author: [book] })).toBe(from(1));
  });

  it('says both, stories first', () => {
    expect(describeMark({ set: [book], author: [book, book, book] })).toBe(
      `${set(1)}, ${from(3)}`
    );
  });

  it('says nothing about an unmarked country', () => {
    expect(describeMark({ set: [], author: [] })).toBe('');
  });
});
