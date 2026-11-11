import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { CheckIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import type { BookEntry, Goal } from '../../types';
import { setGoalBooks } from '../../api/goals/goals';
import * as a from '../account/features/DeleteAccount/DeleteAccount.css';
import * as s from './GoalsPage.css';
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

const fold = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// A theme goal's books: search, tick, Save. Ticks are held until Save, so Cancel leaves the goal as it was.
const BooksDialog = ({ goal, books, onClose, onSaved }: BooksDialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = goalName(goal.name);
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
    if (problem) return setError(m.goals_books_save_failed());
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
              {m.goals_books_title({ goal: title })}
            </h2>
            <button
              type="button"
              className={a.close}
              aria-label={m.common_close()}
              onClick={() => dialog.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </div>

          {books.length ? (
            <>
              <p className={a.dialogText}>
                {withBold(
                  m.goals_books_chosen({
                    picked: picked.size,
                    target: goal.target ?? 0,
                    goal: title,
                  })
                )}
              </p>
              <div className={s.search}>
                <label className={s.label} htmlFor="books-q">
                  {m.goals_books_search()}
                </label>
                <MagnifyingGlassIcon aria-hidden="true" />
                <input
                  id="books-q"
                  className={s.input}
                  type="search"
                  placeholder={m.goals_books_placeholder()}
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {shown.length ? (
                <fieldset className={s.picker}>
                  <legend className={s.srOnly}>
                    {m.goals_books_legend({ goal: title })}
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
                <Hint role="status">
                  {m.goals_books_none({ query: query.trim() })}
                </Hint>
              )}
            </>
          ) : (
            <p className={a.dialogText}>{m.goals_books_log_first()}</p>
          )}

          {error && (
            <p className={s.formError} role="alert">
              {error}
            </p>
          )}

          <div className={a.dialogActions}>
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
