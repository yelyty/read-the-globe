import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { BookmarkSimpleIcon } from '@phosphor-icons/react';

import type { Goal, NextRead } from '../../../../types';
import type { Marks } from '../../../../utils/atlasMarks';
import {
  addNextRead,
  removeNextRead,
} from '../../../../api/nextReads/nextReads';
import { getLocale } from '../../../../paraglide/runtime.js';
import { m } from '../../../../paraglide/messages.js';
import { useStatus } from '../../../../hooks/useStatus';
import { useUndo } from '../../../../hooks/useUndo';
import { useDirty, useLeaveGuard } from '../../../../hooks/useUnsaved';
import Select from '../../../../components/Select/Select';
import Suggest from '../../../../components/Suggest/Suggest';
import Field from '../../../../components/Field/Field';
import { Button } from '../../../../components/Button/Button';
import EmptyState from '../../../../components/EmptyState/EmptyState';
import RibbonSticker from '../../../../components/Sticker/RibbonSticker';
import StatusLine from '../../../../components/StatusLine/StatusLine';
import { loadCountries, type Country } from '../../../../utils/countryStamps';
import * as styles from '../../ShelfPage.css';
import NextItem from './NextItem';

type NextToReadProps = {
  items: NextRead[];
  setItems: (update: (items: NextRead[]) => NextRead[]) => void;
  failed: boolean;
  names: Record<string, string>;
  marks: Marks;
  goals: Goal[];
};

const NextToRead = ({
  items,
  setItems,
  failed,
  names,
  marks,
  goals,
}: NextToReadProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [country, setCountry] = useState('');
  const [mark, setMark] = useState<'set' | 'author'>('author');
  // `at` names the field the error is about; without it the error is about the whole form
  const [error, setError] = useState<{ text: string; at?: string }>();
  const [said, setSaid] = useState('');
  const status = useStatus();
  const offerUndo = useUndo();
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Map<string, Country>>();
  const titleRef = useRef<HTMLInputElement>(null);

  useLeaveGuard(useDirty([title, author, country]));

  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  const sorted = Object.entries(names).sort(([, left], [, right]) =>
    left.localeCompare(right, getLocale())
  );

  const codeFor = (typed: string) =>
    sorted.find(
      ([, countryName]) =>
        countryName.toLowerCase() === typed.trim().toLowerCase()
    )?.[0];

  const code = codeFor(country);

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

    if (dup) {
      status.show({
        text: m.next_dup({ title: dup.title }),
        action: {
          label: m.next_see_it(),
          icon: <BookmarkSimpleIcon aria-hidden="true" />,
          run: () => {
            const row = document.getElementById(`next-${dup.id}`);

            row?.scrollIntoView({ block: 'center' });
            row?.focus({ preventScroll: true });
          },
        },
      });

      return;
    }

    setSaving(true);

    const saved = await addNextRead({
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

    setItems((list) => [saved.data, ...list]);
    setTitle('');
    setAuthor('');
    setCountry('');
    setMark('author');
    setError(undefined);
    setSaid(m.next_saved({ title: saved.data.title }));
    titleRef.current?.focus();
  };

  const remove = async (item: NextRead) => {
    const problem = await removeNextRead(item);

    if (problem) {
      status.show({ text: problem });

      return;
    }

    const at = items.indexOf(item);

    setItems((list) => list.filter((it) => it.id !== item.id));

    // the list is this card's own: Undo puts the item back where it was, without reloading the Shelf
    offerUndo({
      said: m.next_removed({ title: item.title }),
      undo: async () => {
        const back = await addNextRead(item);

        if (back.problem !== null) return back.problem;

        setItems((list) => [
          ...list.slice(0, at),
          back.data,
          ...list.slice(at),
        ]);

        return null;
      },
      refresh: false,
    });

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

  const countryNames = sorted.map(([, countryName]) => countryName);

  const countryControl = (
    <Suggest
      options={countryNames}
      maxLength={60}
      placeholder={m.next_placeholder_country()}
      autoComplete="off"
      value={country}
      onValue={handleCountryValue}
    />
  );

  /* ---------- lists ---------- */

  return (
    <div>
      <form className={styles.nextForm} onSubmit={submit} noValidate>
        <Field
          ref={titleRef}
          id="n-title"
          compact
          label={m.next_label_title()}
          maxLength={200}
          placeholder={m.next_placeholder_title()}
          value={title}
          error={errorAt('n-title')}
          onChange={handleTitleChange}
        />
        <Field
          id="n-author"
          compact
          label={
            <>
              {m.next_label_author()}{' '}
              <span className={styles.optional}>{m.common_optional()}</span>
            </>
          }
          maxLength={120}
          placeholder={m.next_placeholder_author()}
          value={author}
          onChange={handleAuthorChange}
        />
        <Field
          id="n-country"
          compact
          label={
            <>
              {m.next_label_country()}{' '}
              <span className={styles.optional}>{m.common_optional()}</span>
            </>
          }
          error={errorAt('n-country')}
          control={countryControl}
        />
        {code && (
          <div className={styles.nextWide}>
            <label
              className={styles.fieldLabel}
              htmlFor="n-mark"
              id="n-mark-label"
            >
              {m.next_mark_label()}
            </label>
            <Select<'set' | 'author'>
              id="n-mark"
              labelId="n-mark-label"
              variant="pill"
              value={mark}
              onChange={setMark}
              options={[
                { value: 'author', label: m.next_mark_author() },
                { value: 'set', label: m.next_mark_set() },
              ]}
            />
          </div>
        )}
        {error && !error.at && (
          <p className={`${styles.nextWide} ${styles.error}`} role="alert">
            {error.text}
          </p>
        )}
        <div className={`${styles.nextWide} ${styles.formRow}`}>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            <BookmarkSimpleIcon aria-hidden="true" />
            {saving ? m.log_saving() : m.next_save()}
          </Button>
          <StatusLine>{said}</StatusLine>
        </div>
      </form>

      {failed && <p className={styles.emptyNote}>{m.next_load_failed()}</p>}
      {items.length > 0 ? (
        <ul className={styles.nextList}>
          {items.map((item) => (
            <NextItem
              key={item.id}
              item={item}
              countries={countries}
              names={names}
              marks={marks}
              goals={goals}
              onRemove={remove}
            />
          ))}
        </ul>
      ) : (
        !failed && (
          <EmptyState
            className={styles.nextEmpty}
            art={<RibbonSticker />}
            text={m.next_empty()}
          />
        )
      )}
    </div>
  );
};

export default NextToRead;
