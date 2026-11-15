// a stamp's hatch is drawn for a 128px stamp: two 3px stripes, olive and rust, repeating every 6px
const STAMP_PX = 128;
const HATCH_PERIOD = 6;

export const hatchSize = (stampWidth: number) =>
  (stampWidth / STAMP_PX) * HATCH_PERIOD;
