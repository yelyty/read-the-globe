/* A book's cover, picked from its title and author, so a book always wears the same one: its cloth colour and
   a few binding details, varied so a shelf of them reads as different books from one bindery. */

// cloths from the atlas's own palette, each at least 3:1 against both the day and the night page
export const COVER_COLORS = [
  '#6F7A3B', // olive
  '#7A8C6E', // sage
  '#A6843A', // ochre
  '#8C6A45', // umber
  '#A3553B', // rust
  '#A24F49', // oxblood
  '#5E7686', // slate
  '#9C8F72', // linen
];

export type CoverBinding = {
  color: string;
  /** a darker leather strip down the spine, or just the crease */
  spine: boolean;
};

// the string hash Java uses: hash * 31 + char, written as a shift
const HASH_SHIFT = 5;
const SPINE_EVERY = 3;

const hashOf = (seed: string): number => {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << HASH_SHIFT) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

/**
 * Gets the look of a book cover from a seed, for example the title and the author: a color and a spine.
 * The same seed always gives the same cover. Each detail uses its own part of the hash, so they change independently.
 */
export const coverBinding = (seed: string): CoverBinding => {
  const hash = hashOf(seed);
  const rest = Math.floor(hash / COVER_COLORS.length);

  return {
    color: COVER_COLORS[hash % COVER_COLORS.length],
    spine: rest % SPINE_EVERY === 0,
  };
};
