import { useState, useEffect, useCallback } from "react";
import { supabase } from "./utils/supabase";
import WorldMap from "./WorldMap";
import type { BookEntry, CountryData } from "./types";
import ProgressBar from "./ProgressBar";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "./Dialog";

import "./App.css";

function toCountryData(entries: BookEntry[]): CountryData {
  return entries.reduce<CountryData>((acc, entry) => {
    if (!entry.countryCode) {
      return acc;
    }

    acc[entry.countryCode] = entry;

    return acc;
  }, {});
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    async function getBooks() {
      const { data: books } = await supabase.from("books").select();

      if (books) {
        setBooks(books);
      }
    }

    getBooks();
  }, []);

  const countryData = toCountryData(books);

  const onCountryClick = useCallback((countryCode: string, name: string) => {
    setOpenDialog(true);
    setSelectedCountry(name);
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
          <p>{selectedCountry}</p>
        </DialogContent>
        <DialogActions>
          <button type="submit">Save</button>
        </DialogActions>
      </Dialog>
    </>
  );
}
