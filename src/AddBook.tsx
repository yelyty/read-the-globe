import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import TextInput from "./components/TextInput";
import saveBook from "./api/saveBook";
import { getCountryNames } from "./countryNames";
import { MapPinSimpleIcon, XIcon } from "@phosphor-icons/react";

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

type GeocodeResult = {
  name: string;
  lon: number;
  lat: number;
};

type Pin = GeocodeResult & { id: string };

// TODO: move to a separate file
async function geocode(query: string): Promise<GeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=1`;
  const res = await fetch(url);
  const results = await res.json();
  if (!results.length) return null;
  const { lat, lon, display_name } = results[0];
  return {
    name: display_name,
    lon: parseFloat(lon),
    lat: parseFloat(lat),
  };
}

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

  const [query, setQuery] = useState("");
  const [pins, setPins] = useState<Pin[]>([]);
  if (code !== prevCode) {
    setPrevCode(code);
    setSelectedCode(code);
  }

  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success, onCancel]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const result = await geocode(query);
      if (!result) {
        setSearchError(`No results for "${query}"`);
      } else {
        setPins((prev) => [...prev, { ...result, id: crypto.randomUUID() }]);
        setQuery(""); // clear the box so they can add the next pin
      }
    } catch {
      setSearchError("Something went wrong while searching.");
    } finally {
      setSearching(false);
    }
  };

  const removePin = (id: string) =>
    setPins((prev) => prev.filter((p) => p.id !== id));

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

      <label className="label" htmlFor="place">
        Places *
      </label>
      <TextInput
        id="place"
        type="text"
        value={query}
        placeholder="e.g. Paris, Normandy…"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
      />
      <button
        type="button"
        className="button"
        onClick={handleSearch}
        disabled={searching}
      >
        {searching ? "Searching…" : "Add pin"}
      </button>

      {pins.length > 0 && (
        <ul className="pins">
          {pins.map((pin) => (
            <li key={pin.id} className="pin" style={{ listStyleType: "none" }}>
              <MapPinSimpleIcon size={32} />
              <span>{pin.name}</span>
              <button
                type="button"
                className="button"
                onClick={() => removePin(pin.id)}
              >
                <XIcon size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <TextInput
        type="hidden"
        name="places"
        value={JSON.stringify(pins.map(({ id, ...rest }) => rest))}
      />
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
