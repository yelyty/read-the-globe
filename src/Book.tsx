import { FlagIcon } from "@phosphor-icons/react";
import { useCountryNames } from "./hooks/useCountryNames";
import { coverColor } from "./utils/coverColors";

interface BookProps {
  id: string;
  title: string;
  author?: string;
  countryCode?: string;
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
