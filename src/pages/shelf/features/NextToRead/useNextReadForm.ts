import {
  useState,
  type ChangeEvent,
  type RefObject,
  type SubmitEvent,
} from 'react';

import type { NextRead } from '../../../../types';
import { useDirty, useLeaveGuard } from '../../../../hooks/useUnsaved';
import { getLocale } from '../../../../paraglide/runtime.js';
import { m } from '../../../../paraglide/messages.js';
import type { useNextReadActions } from './useNextReadActions';

type NextReadForm = {
  items: NextRead[];
  names: Record<string, string>;
  titleRef: RefObject<HTMLInputElement | null>;
  actions: Pick<ReturnType<typeof useNextReadActions>, 'add' | 'showDuplicate'>;
};

/** The Next to read form: title, author, a country typed by name and which mark it would leave; checked,
    saved, and cleared for the next one. Leaving the page with something typed asks first. */
export const useNextReadForm = ({
  items,
  names,
  titleRef,
  actions,
}: NextReadForm) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [country, setCountry] = useState('');
  const [mark, setMark] = useState<'set' | 'author'>('author');
  // `at` names the field the error is about; without it the error is about the whole form
  const [error, setError] = useState<{ text: string; at?: string }>();
  const [said, setSaid] = useState('');
  const [saving, setSaving] = useState(false);

  useLeaveGuard(useDirty([title, author, country]));

  const sorted = Object.entries(names).sort(([, left], [, right]) =>
    left.localeCompare(right, getLocale())
  );

  const countryNames = sorted.map(([, countryName]) => countryName);

  // the code of the country typed, matched by its name in any case
  const code = sorted.find(
    ([, countryName]) =>
      countryName.toLowerCase() === country.trim().toLowerCase()
  )?.[0];

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaid('');
    const trimmed = title.trim();

    if (!trimmed) {
      setError({ text: m.next_err_title(), at: 'n-title' });
      titleRef.current?.focus();

      return;
    }

    if (country.trim() && !code) {
      setError({
        text: m.next_err_country({ country: country.trim() }),
        at: 'n-country',
      });

      document.getElementById('n-country')?.focus();

      return;
    }

    const dup = items.find(
      (it) =>
        it.title.toLowerCase() === trimmed.toLowerCase() &&
        it.countryCode === (code ?? null)
    );

    if (dup) return actions.showDuplicate(dup);

    setSaving(true);

    const saved = await actions.add({
      title: trimmed,
      author: author.trim() || null,
      countryCode: code ?? null,
      mark: code ? mark : null,
    });

    setSaving(false);

    if (saved.problem !== null) {
      setError({ text: saved.problem });

      return;
    }

    setTitle('');
    setAuthor('');
    setCountry('');
    setMark('author');
    setError(undefined);
    setSaid(m.next_saved({ title: saved.data.title }));
    titleRef.current?.focus();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(undefined);
  };

  const handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAuthor(event.target.value);

  const handleCountryValue = (value: string) => {
    setCountry(value);
    setError(undefined);
  };

  // a field's own error, shown under it
  const errorAt = (at: string) => (error?.at === at ? error.text : undefined);

  return {
    title,
    author,
    country,
    mark,
    setMark,
    code,
    countryNames,
    error,
    errorAt,
    said,
    saving,
    submit,
    handleTitleChange,
    handleAuthorChange,
    handleCountryValue,
  };
};
