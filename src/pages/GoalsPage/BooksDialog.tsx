import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { CheckIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import type { BookEntry, Goal } from '../../types';
import { setGoalBooks } from '../../api/goals/goals';
import * as a from '../account/AccountPage.css';
import * as s from './GoalsPage.css';

type BooksDialogProps = {
  goal: Goal;
  books: BookEntry[];
  onClose: () => void;
  onSaved: (count: number) => void;
};

const fold = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// A theme goal's books: search, tick, Save. Ticks are held until Save, so Cancel leaves the goal as it was.
const BooksDialog = ({ goal, books, onClose, onSaved }: BooksDialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [picked, setPicked] = useState(
    () =>
      new Set(
        books
          .filter((b) => b.goals?.some((g) => g.goalId === goal.id))
          .map((b) => b.id)
      )
  );
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById('books-q')?.focus();
  }, []);

  const q = fold(query.trim());
  const shown = books.filter(
    (b) => !q || fold(`${b.title} ${b.author?.name ?? ''}`).includes(q)
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
    if (problem) return setError('Your books couldn’t be saved. Try again.');
    dialog.current?.close();
    onSaved(picked.size);
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={a.dialog}
        aria-labelledby="books-dialog-title"
        onClose={onClose}
        onClick={(event) =>
          event.target === event.currentTarget && dialog.current?.close()
        }
      >
        <form onSubmit={submit} noValidate>
          <div className={a.dialogHead}>
            <h2 className={a.dialogTitle} id="books-dialog-title">
              Books for {goal.name}
            </h2>
            <button
              type="button"
              className={a.close}
              aria-label="Close"
              onClick={() => dialog.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </div>

          {books.length ? (
            <>
              <p className={a.dialogText}>
                <b>
                  {picked.size} of {goal.target}
                </b>{' '}
                chosen. Tick the books that count toward {goal.name}.
              </p>
              <div className={s.search}>
                <label className={s.label} htmlFor="books-q">
                  Search your books
                </label>
                <MagnifyingGlassIcon aria-hidden="true" />
                <input
                  id="books-q"
                  className={s.input}
                  type="search"
                  placeholder="Title or author"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {shown.length ? (
                <fieldset className={s.picker}>
                  <legend className={s.srOnly}>
                    Books that count toward {goal.name}
                  </legend>
                  <ul>
                    {shown.map((b) => (
                      <li key={b.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={picked.has(b.id)}
                            onChange={() => toggle(b.id)}
                          />
                          <span className={s.pickTitle}>{b.title}</span>
                          <span className={s.pickAuthor}>{b.author?.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              ) : (
                <p className={s.hint} role="status">
                  No books match “{query.trim()}”.
                </p>
              )}
            </>
          ) : (
            <p className={a.dialogText}>
              Log a book first; it will show up here to tick.
            </p>
          )}

          {error && (
            <p className={s.formError} role="alert">
              {error}
            </p>
          )}

          <div className={a.dialogActions}>
            <button
              type="button"
              className={a.linkBtn}
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </button>
            {books.length > 0 && (
              <button type="submit" className={a.primary} disabled={saving}>
                <CheckIcon aria-hidden="true" />
                Save
              </button>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
};

export default BooksDialog;
