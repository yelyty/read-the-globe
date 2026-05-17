import { useState, useEffect, useCallback } from "react";

import WorldMap from "./WorldMap";
import ProgressBar from "./ProgressBar";
import AddBook from "./AddBook";
import Dialog, { DialogContent, DialogTitle } from "./components/Dialog";
import getBooks from "./api/getBooks";
import toCountryData from "./helpers/toCountryData";
import type { BookEntry } from "./types";

import "./App.css";

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
  }, [openDialog]);

  const countryData = toCountryData(books);

  const onCountryClick = useCallback((countryCode: string, name: string) => {
    setOpenDialog(true);
    setSelectedCountry({
      code: countryCode,
      name,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  return (
    <>
      <div className="wrapper">
        <ProgressBar countriesCount={books.length} />
        <WorldMap countryData={countryData} onCountryClick={onCountryClick} />
      </div>
      <Dialog isOpen={openDialog} onClose={closeDialog}>
        <DialogTitle>What have you read?</DialogTitle>
        <DialogContent>
          <AddBook selectedCountry={selectedCountry} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
