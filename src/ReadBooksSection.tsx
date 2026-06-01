import type { BookEntry } from "./types";

type ReadBooksSectionProps = {
  books: BookEntry[];
};

const ReadBooksSection = ({ books }: ReadBooksSectionProps) => {
  return (
    <div className="read-books-wrapper">
      <span className="section-title">Read books</span>
      {books.map((book) => (
        <div>{book.title}</div>
      ))}
    </div>
  );
};

export default ReadBooksSection;
