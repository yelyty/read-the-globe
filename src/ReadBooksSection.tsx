import Book from "./Book";
import type { BookEntry } from "./types";

type ReadBooksSectionProps = {
  books: BookEntry[];
};

const ReadBooksSection = ({ books }: ReadBooksSectionProps) => {
  return (
    <div className="read-books-wrapper">
      <div className="book-list">
        {books.map((book) => (
          <Book
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
          />
        ))}
      </div>
    </div>
  );
};

export default ReadBooksSection;
