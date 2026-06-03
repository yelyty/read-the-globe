import type { BookEntry } from "./types";

type BookProps = BookEntry;

const COVER_COLORS = [
  "#5C4220",
  "#473322",
  "#6E5B3D",
  "#8A7B4A",
  "#A6843A",
  "#C7A536",
  "#6F7445",
  "#566032",
  "#8B3A33",
  "#7E3030",
  "#6E2533",
  "#5A4A2E",
];

function coverColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return COVER_COLORS[Math.abs(h) % COVER_COLORS.length];
}

const Book = ({ title, author }: BookProps) => {
  const color = coverColor(title + author);

  return (
    <div className="book-wrapper">
      <div className="book-cover" style={{ backgroundColor: color }} />
      <div className="book-data">
        <p className="book-title">{title}</p>
        <p className="book-author">{author}</p>
      </div>
    </div>
  );
};

export default Book;
