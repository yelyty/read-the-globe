import { useState, useEffect, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { supabase } from "./utils/supabase";
import WorldMap from "./WorldMap";
import ProgressBar from "./ProgressBar";
import Dialog, { DialogContent, DialogTitle } from "./components/Dialog";
import toCountryData from "./helpers/toCountryData";

import "./App.css";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      Save
    </button>
  );
}

async function saveAction(_: any, formData: FormData) {
  const countryCode = formData.get("countryCode") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;

  const { error } = await supabase.from("books").insert({
    title,
    author,
    countryCode,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [state, formAction] = useFormState(saveAction, {
    success: false,
    error: null,
  });

  // Todo: store both in the same state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

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
    setSelectedCountryCode(countryCode);
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
          <form action={formAction}>
            <input name="country" value={selectedCountry} />
            <input type="text" name="title" />
            <input type="text" name="author" />
            <input
              type="hidden"
              name="countryCode"
              value={selectedCountryCode}
            />

            <SubmitButton />

            {state?.error && <p>{state.error}</p>}
            {state?.success && <p>Saved!</p>}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
