import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { CheckIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import type { BookEntry, Goal } from '../../types';
import { setGoalBooks } from '../../api/goals/goals';
import * as accountStyles from '../account/features/DeleteAccount/DeleteAccount.css';
import * as styles from './GoalsPage.css';
import Hint from '../../components/Hint/Hint';
import { Button } from '../../components/Button/Button';
import { goalName, withBold } from './goals';
import { m } from '../../paraglide/messages.js';

type BooksDialogProps = {
  goal: Goal;
  books: BookEntry[];
  onClose: () => void;
  onSaved: (count: number) => void;
};

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// A theme goal's books: search, tick, Save. Ticks are held until Save, so Cancel leaves the goal as it was.
const BooksDialog = ({ goal, books, onClose, onSaved }: BooksDialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
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

  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById('books-q')?.focus();
  }, []);

  const needle = fold(query.trim());

  const shown = books.filter(
    (book) =>
      !needle ||
      fold(`${book.title} ${book.author?.name ?? ''}`).includes(needle)
  );

  const toggle = (id: string) => {
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
    dialog.current?.close();
    onSaved(picked.size);
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={accountStyles.dialog}
        aria-labelledby="books-dialog-title"
        onClose={onClose}
        onClick={(event) =>
          event.target === event.currentTarget && dialog.current?.close()
        }
      >
        <form onSubmit={submit} noValidate>
          <div className={accountStyles.dialogHead}>
            <h2 className={accountStyles.dialogTitle} id="books-dialog-title">
              {m.goals_books_title({ goal: title })}
            </h2>
            <button
              type="button"
              className={accountStyles.close}
              aria-label={m.common_close()}
              onClick={() => dialog.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </div>

          {books.length ? (
            <>
              <p className={accountStyles.dialogText}>
                {withBold(
                  m.goals_books_chosen({
                    picked: picked.size,
                    target: goal.target ?? 0,
                    goal: title,
                  })
                )}
              </p>
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
                  onChange={(changeEvent) => setQuery(changeEvent.target.value)}
                />
              </div>
              {shown.length ? (
                <fieldset className={styles.picker}>
                  <legend className={styles.srOnly}>
                    {m.goals_books_legend({ goal: title })}
                  </legend>
                  <ul>
                    {shown.map((book) => (
                      <li key={book.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={picked.has(book.id)}
                            onChange={() => toggle(book.id)}
                          />
                          <span className={styles.pickTitle}>{book.title}</span>
                          <span className={styles.pickAuthor}>
                            {book.author?.name}
                          </span>
                        </label>
                      </li>
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
            <p className={accountStyles.dialogText}>
              {m.goals_books_log_first()}
            </p>
          )}

          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}

          <div className={accountStyles.dialogActions}>
            <Button
              type="button"
              variant="text"
              onClick={() => dialog.current?.close()}
            >
              {m.common_cancel()}
            </Button>
            {books.length > 0 && (
              <Button type="submit" disabled={saving}>
                <CheckIcon aria-hidden="true" />
                {m.common_save()}
              </Button>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
};

export default BooksDialog;
