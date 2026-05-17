import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import TextInput from "./components/TextInput";
import saveBook from "./api/saveBook";

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

const AddBook = ({ selectedCountry, onCancel }: AddBookProps) => {
  const [state, formAction] = useFormState(saveBook, {
    success: false,
    error: null,
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const { code, name } = selectedCountry;

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success, onCancel]);

  return (
    <form action={formAction} className="form">
      <label className="label" htmlFor="country">
        Country
      </label>
      <TextInput id="country" type="text" disabled={true} value={name} />
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
