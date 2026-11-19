import { describe, expect, it } from 'vitest';

import { COVER_COLORS, coverBinding } from './coverColors';

const luminance = (hex: string) => {
  const channel = (at: number) => {
    const value = parseInt(hex.slice(at, at + 2), 16) / 255;

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};

const contrast = (one: string, two: string) => {
  const [light, dark] = [luminance(one), luminance(two)].sort(
    (first, second) => second - first
  );

  return (light + 0.05) / (dark + 0.05);
};

describe('the cover cloths', () => {
  it.each(COVER_COLORS)(
    '%s keeps its outline on the day and night page',
    (color) => {
      expect(contrast(color, '#FFFFFD')).toBeGreaterThanOrEqual(3);
      expect(contrast(color, '#1C1811')).toBeGreaterThanOrEqual(3);
    }
  );
});

describe('coverBinding', () => {
  it('binds a book the same way every time', () => {
    expect(coverBinding('Kokoro')).toEqual(coverBinding('Kokoro'));
  });

  it('varies the binding across a shelf', () => {
    const shelf = Array.from({ length: 40 }, (_unused, i) =>
      coverBinding(`Book ${i}`)
    );

    expect(new Set(shelf.map((book) => book.spine)).size).toBe(2);
    expect(new Set(shelf.map((book) => book.color)).size).toBeGreaterThan(5);
  });
});
