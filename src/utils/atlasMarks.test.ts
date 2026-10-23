import { describe, expect, it } from "vitest";
import type { BookEntry } from "../types";
import { atlasMarks, atlasStats } from "./atlasMarks";

const book = (
  id: string,
  author: string | null,
  places: string[],
): BookEntry => ({
  id,
  title: id,
  author: author
    ? { name: "A", country: { name: author, code: author } }
    : null,
  places: places.map((countryCode, i) => ({
    id: `${id}${i}`,
    name: "",
    lon: 0,
    lat: 0,
    countryCode,
    bookId: id,
  })),
  goals: [],
});

describe("atlasMarks", () => {
  it("marks set-in and author countries separately", () => {
    const marks = atlasMarks([book("b1", "250", ["392"])]);
    expect(marks["392"].set.map((b) => b.id)).toEqual(["b1"]);
    expect(marks["392"].author).toEqual([]);
    expect(marks["250"].author.map((b) => b.id)).toEqual(["b1"]);
  });

  it("counts a book once per country even with several places there", () => {
    const marks = atlasMarks([book("b1", null, ["392", "392"])]);
    expect(marks["392"].set).toHaveLength(1);
  });

  it("a country can be both set-in and author", () => {
    const marks = atlasMarks([book("b1", "392", ["392"])]);
    expect(marks["392"].set).toHaveLength(1);
    expect(marks["392"].author).toHaveLength(1);
  });
});

describe("atlasStats", () => {
  it("counts books, countries, set, authors and continents", () => {
    const books = [
      book("b1", "250", ["392"]),
      book("b2", null, ["392", "076"]),
    ];
    expect(atlasStats(books, atlasMarks(books))).toEqual({
      books: 2,
      countries: 3,
      set: 2,
      authors: 1,
      continents: 3,
    });
  });
});
