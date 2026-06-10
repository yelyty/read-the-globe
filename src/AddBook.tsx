import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import TextInput from "./components/TextInput";
import saveBook from "./api/saveBook";
import { getCountryNames } from "./countryNames";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="button submit">
      Save
    </button>
  );
};

type AddBookProps = {
  selectedCountry: {
    code: string;
    name: string;
  };
  onCancel: () => void;
};
export type SaveBookState = {
  success: boolean;
  error: string | null;
};

function useCountryNames() {
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    getCountryNames().then(setNames);
  }, []);
  return names;
}

const AddBook = ({ selectedCountry, onCancel }: AddBookProps) => {
  const [state, formAction] = useFormState(saveBook, {
    success: false,
    error: null,
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const { code } = selectedCountry;

  const countryNames = useCountryNames();

  const [selectedCode, setSelectedCode] = useState(code);
  const [prevCode, setPrevCode] = useState(code);

  if (code !== prevCode) {
    setPrevCode(code);
    setSelectedCode(code);
  }

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success, onCancel]);

  return (
    <form action={formAction} className="form">
      <label className="label" htmlFor="countryCode">
        Country
      </label>
      <select
        id="countryCode"
        name="countryCode"
        className="select"
        value={selectedCode}
        onChange={(e) => setSelectedCode(e.target.value)}
      >
        {Object.entries(countryNames)
          .sort(([, a], [, b]) => a.localeCompare(b))
          .map(([countryCode, countryName]) => (
            <option key={countryCode} value={countryCode}>
              {countryName}
            </option>
          ))}
      </select>
      <label className="label" htmlFor="title">
        Title *
      </label>
      <TextInput
        id="title"
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="label" htmlFor="author">
        Author *
      </label>
      <TextInput
        id="author"
        name="author"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <TextInput type="hidden" name="countryCode" value={code} />
      <div className="actions">
        <button type="button" className="button" onClick={onCancel}>
          Cancel
        </button>
        <SubmitButton />
      </div>
      {state?.error && <p>{state.error}</p>}
      {/* Todo: add toast */}
      {/* {state?.success && <p>Saved!</p>} */}
    </form>
  );
};

export default AddBook;
