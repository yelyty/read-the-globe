import { describe, expect, it } from 'vitest';

import type { Goal } from '../../../types';
import { goalCardName } from './drawGoalCard';

const goal = (name: string): Goal => ({
  id: 1,
  kind: 'theme',
  name,
  continent: null,
  countryCodes: null,
  target: 5,
  reachedOn: null,
});

describe('goalCardName', () => {
  it("makes a file name from the goal's name", () => {
    expect(goalCardName(goal('The Silk Road'))).toBe(
      'read-the-globe-the-silk-road-postcard.png'
    );
  });

  it('joins words and digits across punctuation with single dashes', () => {
    expect(goalCardName(goal('Books, poems & plays: 2026!'))).toBe(
      'read-the-globe-books-poems-plays-2026-postcard.png'
    );
  });

  it('trims dashes at either end', () => {
    expect(goalCardName(goal('  …Arctic…  '))).toBe(
      'read-the-globe-arctic-postcard.png'
    );
  });
});
