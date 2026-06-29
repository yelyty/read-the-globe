import { useState, useEffect, useCallback } from "react";
import AddBook from "./AddBook";
import getBooks from "./api/getBooks";
import getPlaces from "./api/getPlaces";
import { seedCountries } from "./api/saveBook";
import Dialog, { DialogTitle, DialogContent } from "./components/Dialog";
import Header from "./Header";
import toCountryData from "./helpers/toCountryData";
import ProgressBar from "./ProgressBar";
import ReadBooksSection from "./ReadBooksSection";
import type { BookEntry, Place } from "./types";
import WorldMap from "./WorldMap";

import "./App.css";

type SelectedCountry = {
  code: string;
  name: string;
};

const Dashboard = () => {
  const [books, setBooks] = useState<BookEntry[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddPlaceDialog, setOpenAddPlaceDialog] = useState(false);
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

    const loadPlaces = async () => {
      const places = await getPlaces();
      if (places) {
        setPlaces(places);
      }
    };

    loadBooks();
    loadPlaces();
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
    seedCountries();
  }, []);

  const uniqueCountries = [
    ...new Set(books.map((b) => b.author?.country?.code).filter(Boolean)),
  ];

  return (
    <>
      <div className="wrapper">
        <Header onAddBookClick={() => setOpenDialog(true)} authorized />
        <div className="progress-wrapper">
          <h3>My reading journey</h3>
          <ProgressBar countriesCount={uniqueCountries.length} />
        </div>

        <WorldMap
          countryData={countryData}
          onCountryClick={onCountryClick}
          places={places}
        />
        <ReadBooksSection books={books} />
      </div>

      <Dialog isOpen={openDialog} onClose={closeDialog}>
        <DialogTitle>What have you read?</DialogTitle>
        <DialogContent>
          <AddBook selectedCountry={selectedCountry} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>

      <Dialog
        isOpen={openAddPlaceDialog}
        onClose={() => setOpenAddPlaceDialog(false)}
      >
        <DialogTitle>Where the book was set?</DialogTitle>
        <DialogContent>
          <AddBook selectedCountry={selectedCountry} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
