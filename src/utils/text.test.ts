import { isValidElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { byName, fold, lower, withBold } from './text';

describe('fold', () => {
  it('drops accents and case', () => {
    expect(fold('Élise Čapek')).toBe('elise capek');
  });

  it('leaves plain text lower-cased', () => {
    expect(fold('Kokoro')).toBe('kokoro');
  });
});

describe('lower', () => {
  it('lower-cases in the reader’s language', () => {
    expect(lower('ÜBER Ä')).toBe('über ä');
  });
});

describe('withBold', () => {
  it('turns the **marked** parts into <b>, and keeps the rest as text', () => {
    const parts = withBold('Read **3** books in **Japan**');

    expect(parts).toHaveLength(5);
    expect(parts[0]).toBe('Read ');
    expect(parts[2]).toBe(' books in ');
    expect(parts[4]).toBe('');

    const bold = parts[1] as ReactElement<{ children: string }>;

    expect(isValidElement(bold)).toBe(true);
    expect(bold.type).toBe('b');
    expect(bold.props.children).toBe('3');

    expect(
      (parts[3] as ReactElement<{ children: string }>).props.children
    ).toBe('Japan');
  });

  it('gives back text with no marks as it is', () => {
    expect(withBold('Nothing bold')).toEqual(['Nothing bold']);
  });

  it('keys each bold part by where it sits', () => {
    const parts = withBold('**a** and **b**');

    expect((parts[1] as ReactElement).key).toBe('1');
    expect((parts[3] as ReactElement).key).toBe('3');
  });
});

describe('byName', () => {
  const NAMES: Record<string, string> = {
    '578': 'Norway',
    '208': 'Denmark',
    '352': 'Iceland',
  };

  it('names the countries in alphabetical order', () => {
    expect(byName(['578', '208', '352'], (code) => NAMES[code])).toBe(
      'Denmark, Iceland, Norway'
    );
  });

  it('says nothing for no countries', () => {
    expect(byName([], (code) => NAMES[code])).toBe('');
  });
});
