import { useEffect, useState } from "react";
import type { BookEntry } from "./types";
import { getCountryNames } from "./countryNames";
import { FlagIcon } from "@phosphor-icons/react";

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

function useCountryNames() {
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    getCountryNames().then(setNames);
  }, []);
  return names;
}

function coverColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return COVER_COLORS[Math.abs(h) % COVER_COLORS.length];
}

const Book = ({ title, author, countryCode }: BookProps) => {
  const color = coverColor(title + author);
  const names = useCountryNames();

  return (
    <div className="book-wrapper">
      <div className="book-cover" style={{ backgroundColor: color }} />
      <div className="book-data">
        <p className="book-title">{title}</p>
        <p className="book-author">{author}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FlagIcon size={12} />
          {countryCode && (
            <span style={{ fontSize: "12px" }}>
              {names[countryCode] ?? "Unknown"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
