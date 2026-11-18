import type { BookEntry, Goal, NextRead } from '../../../types';
import { type Landing } from '../../../hooks/useLanding';
import { m } from '../../../paraglide/messages.js';
import Field from '../../../components/Field/Field';
import Dialog from '../../../components/Dialog/Dialog';
import * as styles from '../LogBook.css';
import { useLogErrors } from '../hooks/useLogErrors';
import { useLogFields } from '../hooks/useLogFields';
import { useSaveBook } from '../hooks/useSaveBook';
import AuthorCountryField from './AuthorCountryField';
import LogActions from './LogActions';
import LogPreview from './LogPreview';
import PlacesField from './PlacesField';
import ReadWhen from './ReadWhen';
import ThemeTicks from './ThemeTicks';

type LogFormProps = {
  book?: BookEntry;
  nextItem?: NextRead;
  /** a country to start with as a place */
  setIn?: string;
  /** an imagined world to start with as a place */
  world?: string;
  names: Record<string, string>;
  books: BookEntry[];
  goals: Goal[];
  /** the reader's imagined worlds, offered when a place is marked imagined */
  worlds: string[];
  onClose: () => void;
  onDone: (message: string, landing?: Landing) => void;
  onRemoved: (book: BookEntry) => void;
};

/**
 * Shows the form of Log a book: the title, the author, the places, when it was read, and the goals.
 * @param book - The book to edit. Without it, the form adds a new book.
 * @param nextItem - The next read to log, if the form was opened from the Shelf.
 * @param setIn - A country to start with as a place.
 * @param world - An imagined world to start with as a place.
 * @param onDone - Called after the book is saved, with the message to show and the pins to fly to the map.
 * @param onRemoved - Called after the book is removed.
 */
const LogForm = ({
  book,
  nextItem,
  setIn,
  world,
  names,
  books,
  goals,
  worlds,
  onClose,
  onDone,
  onRemoved,
}: LogFormProps) => {
  const errorState = useLogErrors();
  const { errors, formError, fix, forgetDup } = errorState;

  const {
    countries,
    themes,
    sub,
    dirty,
    log,
    title,
    author,
    country,
    authorPick,
    authorOpen,
    rows,
    setRows,
    month,
    setMonth,
    year,
    setYear,
    ticks,
    setTicks,
    ticksOpen,
    handleTitleChange,
    handleAuthorChange,
    handleCountryValue,
    handleAuthorPick,
    handleAuthorChoiceReopen,
  } = useLogFields({
    book,
    nextItem,
    setIn,
    world,
    names,
    books,
    goals,
    fix,
    forgetDup,
  });

  const { saving, submit, remove, label } = useSaveBook({
    book,
    nextItem,
    books,
    goals,
    names,
    log,
    title,
    errors: errorState,
    onDone,
    onRemoved,
  });

  const imagined = log.places.filter((place) => place.imagined);

  return (
    <Dialog
      open
      onClose={onClose}
      variant="sheet"
      className={styles.sheet}
      data-editing={Boolean(book)}
      title={book ? m.log_editing() : m.log_a_book()}
      sub={
        <>
          {book && <p className={styles.editing}>{book.title}</p>}
          {sub && <p className={styles.sub}>{sub}</p>}
        </>
      }
      initialFocus="f-title"
      dirty={dirty}
      backdropClose={false}
    >
      <LogPreview marks={log.marks} imagined={imagined} names={names} />

      <form onSubmit={submit} noValidate>
        <Field
          id="f-title"
          label={m.log_title()}
          autoComplete="off"
          maxLength={200}
          placeholder={m.log_title_ph()}
          value={title}
          error={errors.title}
          onChange={handleTitleChange}
        />

        <Field
          id="f-author"
          label={m.log_author()}
          autoComplete="off"
          maxLength={120}
          placeholder={m.log_author_ph()}
          value={author}
          error={errors.author}
          onChange={handleAuthorChange}
        />

        <AuthorCountryField
          value={country}
          error={errors.country}
          countries={countries}
          names={names}
          pick={authorPick}
          pickOpen={authorOpen}
          onValue={handleCountryValue}
          onPick={handleAuthorPick}
          onPickReopen={handleAuthorChoiceReopen}
        />

        <PlacesField
          rows={rows}
          setRows={setRows}
          errors={errors}
          onFix={fix}
          worlds={worlds}
          countries={countries}
          names={names}
        />

        <ReadWhen
          month={month}
          year={year}
          onMonth={setMonth}
          onYear={setYear}
        />

        {themes.length > 0 && (
          <ThemeTicks
            themes={themes}
            ticks={ticks}
            onChange={setTicks}
            open={ticksOpen}
          />
        )}

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <LogActions
          editing={Boolean(book)}
          saving={saving}
          label={label}
          onRemove={remove}
          onClose={onClose}
        />
      </form>
    </Dialog>
  );
};

export default LogForm;
