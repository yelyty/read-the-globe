import { useState, useEffect, useCallback } from "react";

import WorldMap from "./WorldMap";
import ProgressBar from "./ProgressBar";
import AddBook from "./AddBook";
import Dialog, { DialogContent, DialogTitle } from "./components/Dialog";
import toCountryData from "./helpers/toCountryData";
import type { BookEntry } from "./types";

import "./App.css";
import getBooks from "./api/getBooks";

type SelectedCountry = {
  code: string;
  name: string;
};

export default function App() {
  const [books, setBooks] = useState<BookEntry[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry>({
    code: "",
    name: "",
  });

  useEffect(() => {
    const loadBooks = async () => {
      const books = await getBooks();
      if (books) {
        setBooks(books);
      }
    };

    loadBooks();
  }, []);

  const countryData = toCountryData(books);

  const onCountryClick = useCallback((countryCode: string, name: string) => {
    setOpenDialog(true);
    setSelectedCountry({
      code: countryCode,
      name,
    });
  }, []);

  return (
    <>
      <div>
        <ProgressBar countriesCount={books.length} />
        <WorldMap countryData={countryData} onCountryClick={onCountryClick} />
      </div>
      <Dialog isOpen={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>What have you read?</DialogTitle>
        <DialogContent>
          <AddBook selectedCountry={selectedCountry} />
        </DialogContent>
      </Dialog>
    </>
  );
}
