import { BooksIcon } from "@phosphor-icons/react";
import Book from "./Book";
import type { BookEntry } from "./types";

type ReadBooksSectionProps = {
  books: BookEntry[];
};

const ReadBooksSection = ({ books }: ReadBooksSectionProps) => {
  return (
    <div className="read-books-wrapper">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <BooksIcon size={32} />
        <h3>Books</h3>
      </div>
      <div className="book-list">
        {books.map((book) => (
          <Book
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author?.name}
            countryCode={book.author?.country?.code}
          />
        ))}
      </div>
    </div>
  );
};

export default ReadBooksSection;
