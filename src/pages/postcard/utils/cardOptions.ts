import type { SavedPostcard } from '../../../api/profile/profile';
import { m } from '../../../paraglide/messages.js';
import { COLORS, KINDS, PAPERS, type Options } from './drawPostcard';

// which card: the atlas's (both null), a year's, or a reached goal's
export type CardOptions = Options & {
  goal: number | null;
  year: string | null;
};

const DEFAULTS: CardOptions = {
  kind: 'authors',
  count: 0,
  frame: 'perforated',
  color: null,
  paper: 'paper',
  goal: null,
  year: null,
};

// how many countries a card lists: the top few, the top more, or all of them (0)
const TOP_FEW = 3;
const TOP_MORE = 6;

// the reader's saved set-up, field by field
const oneOf = <T>(values: readonly T[], value: unknown, fallback: T) =>
  values.find((item) => item === value) ?? fallback;

const keys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[];

/**
 * Reads the saved set-up of the card.
 * Each field that has an unknown value or an old value gets the default value.
 * @param saved - The set-up from the profile of the reader, or null.
 */
export const readOptions = (saved: SavedPostcard): CardOptions => ({
  kind: oneOf(keys(KINDS), saved?.kind, DEFAULTS.kind),
  count: oneOf(COUNTS, saved?.count, DEFAULTS.count),
  frame: oneOf(
    ['perforated', 'framed', 'plain'] as const,
    saved?.frame,
    DEFAULTS.frame
  ),
  color: oneOf(keys(COLORS), saved?.color, null),
  paper: oneOf(keys(PAPERS), saved?.paper, DEFAULTS.paper),
  goal: typeof saved?.goal === 'number' ? saved.goal : null,
  year: typeof saved?.year === 'string' ? saved.year : null,
});

/**
 * Gets the label for the number of stamps: "Top 3", "Top 6", or "All" for 0.
 */
export const countLabel = (count: number) =>
  count ? m.postcard_top({ n: count }) : m.postcard_all();

export const COUNTS = [TOP_FEW, TOP_MORE, 0] as const;

export const FRAMES = {
  perforated: m.postcard_frame_perforated,
  framed: m.postcard_frame_framed,
  plain: m.postcard_frame_plain,
} as const;

export type ColorKey = keyof typeof COLORS;

// the choices in the order they're offered
export const KIND_KEYS = keys(KINDS);
export const PAPER_KEYS = keys(PAPERS);
export const FRAME_KEYS = keys(FRAMES);
export const COLOR_KEYS = keys(COLORS);
