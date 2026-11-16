import { useState, type SubmitEvent } from 'react';

import type { BookEntry, Goal, NextRead } from '../../types';
import { deleteBook, saveBook } from '../../api/books/books';
import { removeNextRead } from '../../api/nextReads/nextReads';
import type { Landing } from '../../hooks/useLanding';
import { formatMonth } from '../../utils/formatDate';
import { readDate } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import {
  duplicateOf,
  errorSummary,
  landingFor,
  type LogReading,
} from './bookLog';
import type { useLogErrors } from './useLogErrors';

type SaveBook = {
  book?: BookEntry;
  nextItem?: NextRead;
  books: BookEntry[];
  goals: Goal[];
  names: Record<string, string>;
  /** the form read into a book (useLogFields) */
  log: LogReading;
  title: string;
  errors: ReturnType<typeof useLogErrors>;
  onDone: (message: string, landing?: Landing) => void;
  onRemoved: (book: BookEntry) => void;
};

/** Pinning the book (or saving the edit), and removing it: the form's submit, its Remove, and the button's words. */
export function useSaveBook({
  book,
  nextItem,
  books,
  goals,
  names,
  log,
  title,
  errors: { setErrors, setFormError, dupOk, setDupOk },
  onDone,
  onRemoved,
}: SaveBook) {
  const [saving, setSaving] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const errs = log.errors;

    setErrors(errs);

    if (Object.keys(errs).length || !log.draft) {
      const summary = errorSummary(errs);

      setFormError(summary.text);
      if (summary.focusId) document.getElementById(summary.focusId)?.focus();

      return;
    }

    const draft = log.draft;
    // the same book twice is usually a slip: say so once, then let a second Pin it through
    const dup = !book && duplicateOf(draft, books);

    if (dup && dupOk !== dup.id) {
      setDupOk(dup.id);
      setFormError(m.log_dup({ month: formatMonth(readDate(dup)) }));

      return;
    }

    setSaving(true);
    const saved = await saveBook(draft, book?.id);

    if (saved.problem !== null) {
      setSaving(false);
      setFormError(saved.problem);

      return;
    }

    const id = saved.data;

    // logged from Next to read: it leaves that list (quietly: the book itself is saved)
    if (!book && nextItem) await removeNextRead(nextItem);

    onDone(
      book
        ? m.log_saved({ title: title.trim() })
        : m.log_pinned({ title: title.trim() }),
      book ? undefined : landingFor(id, draft, { books, goals, names })
    );
  };

  const remove = async () => {
    if (!book) return;
    setSaving(true);
    const error = await deleteBook(book.id);

    if (error) {
      setSaving(false);
      setFormError(error);

      return;
    }

    onRemoved(book);
  };

  const label = saving
    ? book
      ? m.log_saving()
      : m.log_pinning()
    : book
      ? m.log_save_changes()
      : dupOk !== null
        ? m.log_pin_again()
        : m.log_pin_it();

  return { saving, submit, remove, label };
}
