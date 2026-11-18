import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { CheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import { setGoalBooks } from '../../../../api/goals/goals';
import Hint from '../../../../components/Hint/Hint';
import { Button } from '../../../../components/Button/Button';
import { useDirty } from '../../../../hooks/useUnsaved';
import Dialog from '../../../../components/Dialog/Dialog';
import DialogActions from '../../../../components/Dialog/DialogActions';
import DialogText from '../../../../components/Dialog/DialogText';
import { m } from '../../../../paraglide/messages.js';
import { fold } from '../../../../utils/text';
import { withBold } from '../../../../utils/text';
import * as styles from '../../GoalsPage.css';
import { goalName } from '../../utils/catalogue';
import BookPick from './BookPick';

type BooksDialogProps = {
  goal: Goal;
  books: BookEntry[];
  onClose: () => void;
  onSaved: (count: number) => void;
};

/**
 * Shows the books of a theme goal in a dialog: search, tick, and Save.
 * The ticks are kept until Save, so Cancel leaves the goal as it was.
 */
const BooksDialog = ({ goal, books, onClose, onSaved }: BooksDialogProps) => {
  const title = goalName(goal.name);

  const [picked, setPicked] = useState(
    () =>
      new Set(
        books
          .filter((book) =>
            book.goals?.some((goalLink) => goalLink.goalId === goal.id)
          )
          .map((book) => book.id)
      )
  );

  const [query, setQuery] = useState('');
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const dirty = useDirty([...picked].sort());

  const needle = fold(query.trim());

  const shown = books.filter(
    (book) =>
      !needle ||
      fold(`${book.title} ${book.author?.name ?? ''}`).includes(needle)
  );

  const toggle = (id: number) => {
    const next = new Set(picked);

    if (!next.delete(id)) next.add(id);
    setPicked(next);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const problem = await setGoalBooks(goal.id, [...picked]);

    setSaving(false);
    if (problem) return setError(m.goals_books_save_failed());
    onClose();
    onSaved(picked.size);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  return (
    <Dialog
      open
      onClose={onClose}
      title={m.goals_books_title({ goal: title })}
      initialFocus="books-q"
      dirty={dirty}
    >
      <form onSubmit={submit} noValidate>
        {books.length ? (
          <>
            <DialogText>
              {withBold(
                m.goals_books_chosen({
                  picked: picked.size,
                  target: goal.target ?? 0,
                  goal: title,
                })
              )}
            </DialogText>
            <div className={styles.search}>
              <label className={styles.label} htmlFor="books-q">
                {m.goals_books_search()}
              </label>
              <MagnifyingGlassIcon aria-hidden="true" />
              <input
                id="books-q"
                className={styles.input}
                type="search"
                placeholder={m.goals_books_placeholder()}
                autoComplete="off"
                value={query}
                onChange={handleQueryChange}
              />
            </div>
            {shown.length ? (
              <fieldset className={styles.picker}>
                <legend className={styles.srOnly}>
                  {m.goals_books_legend({ goal: title })}
                </legend>
                <ul>
                  {shown.map((book) => (
                    <BookPick
                      key={book.id}
                      book={book}
                      checked={picked.has(book.id)}
                      onToggle={toggle}
                    />
                  ))}
                </ul>
              </fieldset>
            ) : (
              <Hint role="status">
                {m.goals_books_none({ query: query.trim() })}
              </Hint>
            )}
          </>
        ) : (
          <DialogText>{m.goals_books_log_first()}</DialogText>
        )}

        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}

        <DialogActions>
          <Button type="button" variant="text" onClick={onClose}>
            {m.common_cancel()}
          </Button>
          {books.length > 0 && (
            <Button
              type="submit"
              disabled={saving}
              aria-busy={saving || undefined}
            >
              <CheckIcon aria-hidden="true" />
              {saving ? m.log_saving() : m.common_save()}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BooksDialog;
