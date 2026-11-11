// A cover colour per book, picked from the title and author, so a book always wears the same cover.
const COVER_COLORS = [
  '#5C4220',
  '#473322',
  '#6E5B3D',
  '#8A7B4A',
  '#A6843A',
  '#C7A536',
  '#6F7445',
  '#566032',
  '#8B3A33',
  '#7E3030',
  '#6E2533',
  '#5A4A2E',
];

export function coverColor(seed: string): string {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}
