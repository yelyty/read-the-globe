import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowCounterClockwiseIcon,
  BookmarkSimpleIcon,
  CaretDownIcon,
  PushPinIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import type { Goal, NextRead } from '../../../types';
import type { Marks } from '../../../utils/atlasMarks';
import { addNextRead, removeNextRead } from '../../../api/nextReads/nextReads';
import {
  countryStamp,
  loadCountries,
  type Country,
} from '../../PostcardPage/drawPostcard';
import { goalHas, goalName } from '../../GoalsPage/goals';
import { getLocale } from '../../../paraglide/runtime.js';
import { m } from '../../../paraglide/messages.js';
import { useStatus } from '../../../hooks/useStatus';
import * as styles from '../ShelfPage.css';

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
  const [error, setError] = useState('');
  const [said, setSaid] = useState('');
  const status = useStatus();
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Map<string, Country>>();
  const titleRef = useRef<HTMLInputElement>(null);

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
      setError(m.next_err_title());
      titleRef.current?.focus();

      return;
    }

    if (country.trim() && !code) {
      setError(m.next_err_country({ country: country.trim() }));
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

    if (!saved) {
      setError(m.next_save_failed());

      return;
    }

    setItems((list) => [saved, ...list]);
    setTitle('');
    setAuthor('');
    setCountry('');
    setMark('author');
    setError('');
    setSaid(m.next_saved({ title: saved.title }));
    titleRef.current?.focus();
  };

  const remove = async (item: NextRead) => {
    if (!(await removeNextRead(item.id))) {
      status.show({ text: m.next_remove_failed({ title: item.title }) });

      return;
    }

    const at = items.indexOf(item);

    setItems((list) => list.filter((it) => it.id !== item.id));

    status.show({
      text: m.next_removed({ title: item.title }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const back = await addNextRead(item);

          if (!back) {
            status.show({ text: m.next_save_failed() });

            return;
          }

          setItems((list) => [...list.slice(0, at), back, ...list.slice(at)]);
        },
      },
    });

    titleRef.current?.focus();
  };

  return (
    <div>
      <form className={styles.nextForm} onSubmit={submit} noValidate>
        <div>
          <label className={styles.fieldLabel} htmlFor="n-title">
            {m.next_label_title()}
          </label>
          <input
            ref={titleRef}
            id="n-title"
            className={styles.input}
            maxLength={200}
            placeholder={m.next_placeholder_title()}
            value={title}
            aria-invalid={error && !title.trim() ? true : undefined}
            onChange={(changeEvent) => {
              setTitle(changeEvent.target.value);
              setError('');
            }}
          />
        </div>
        <div>
          <label className={styles.fieldLabel} htmlFor="n-author">
            {m.next_label_author()}{' '}
            <span className={styles.optional}>{m.common_optional()}</span>
          </label>
          <input
            id="n-author"
            className={styles.input}
            maxLength={120}
            placeholder={m.next_placeholder_author()}
            value={author}
            onChange={(changeEvent) => setAuthor(changeEvent.target.value)}
          />
        </div>
        <div>
          <label className={styles.fieldLabel} htmlFor="n-country">
            {m.next_label_country()}{' '}
            <span className={styles.optional}>{m.common_optional()}</span>
          </label>
          <input
            id="n-country"
            className={styles.input}
            list="n-countries"
            maxLength={60}
            placeholder={m.next_placeholder_country()}
            autoComplete="off"
            value={country}
            onChange={(changeEvent) => {
              setCountry(changeEvent.target.value);
              setError('');
            }}
          />
          <datalist id="n-countries">
            {sorted.map(([countryCode, countryName]) => (
              <option key={countryCode} value={countryName} />
            ))}
          </datalist>
        </div>
        {code && (
          <div className={styles.nextWide}>
            <label className={styles.fieldLabel} htmlFor="n-mark">
              {m.next_mark_label()}
            </label>
            <span className={styles.pick}>
              <select
                id="n-mark"
                className={styles.select}
                value={mark}
                onChange={(changeEvent) =>
                  setMark(changeEvent.target.value as 'set' | 'author')
                }
              >
                <option value="author">{m.next_mark_author()}</option>
                <option value="set">{m.next_mark_set()}</option>
              </select>
              <CaretDownIcon aria-hidden="true" />
            </span>
          </div>
        )}
        {error && (
          <p className={`${styles.nextWide} ${styles.error}`} role="alert">
            {error}
          </p>
        )}
        <div className={`${styles.nextWide} ${styles.formRow}`}>
          <button type="submit" className={styles.primary} disabled={saving}>
            <BookmarkSimpleIcon aria-hidden="true" />
            {m.next_save()}
          </button>
          <p className={styles.status} role="status">
            {said}
          </p>
        </div>
      </form>

      {failed && <p className={styles.emptyNote}>{m.next_load_failed()}</p>}
      {items.length > 0 ? (
        <ul className={styles.nextList}>
          {items.map((it) => {
            const countryInfo =
              it.countryCode && countries?.get(it.countryCode);

            const stamp = countryInfo ? countryStamp(countryInfo) : null;
            const place = it.countryCode ? (names[it.countryCode] ?? '') : '';

            return (
              <li
                key={it.id}
                id={`next-${it.id}`}
                tabIndex={-1}
                className={styles.nextItem}
              >
                {/* the country it would mark, still pale: it isn't on the atlas until it's read */}
                <span className={styles.nextStamp} aria-hidden="true">
                  {stamp ? (
                    <svg viewBox={stamp.viewBox} focusable="false">
                      <path
                        className={styles.nextShape}
                        d={stamp.d}
                        data-mark={it.mark}
                      />
                    </svg>
                  ) : (
                    <BookmarkSimpleIcon className={styles.nextMark} />
                  )}
                </span>
                <div className={styles.nextBody}>
                  <span className={styles.nextTitle}>{it.title}</span>
                  {it.author && (
                    <span className={styles.nextAuthor}>{it.author}</span>
                  )}
                  {it.countryCode && (
                    <div className={styles.nextMeta}>
                      <span>
                        <i
                          className={
                            it.mark === 'set' ? styles.dotSet : styles.dotAuthor
                          }
                          aria-hidden="true"
                        />
                        {it.mark === 'set'
                          ? m.next_set_in({ country: place })
                          : m.next_author_from({ country: place })}
                      </span>
                      {!marks[it.countryCode] && (
                        <span className={styles.fresh}>
                          {m.next_new_ground({ country: place })}
                        </span>
                      )}
                      {/* the goals this book would move along */}
                      {goals
                        .filter((goal) => goalHas(goal, it.countryCode!))
                        .map((goal) => (
                          <span key={goal.id} className={styles.nextGoal}>
                            {goalName(goal.name)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className={styles.nextActs}>
                  <Link
                    className={styles.linkBtn}
                    to="."
                    search={(prev) => ({ ...prev, log: true, next: it.id })}
                  >
                    <PushPinIcon aria-hidden="true" />
                    {m.next_log_it()}
                  </Link>
                  <button
                    type="button"
                    className={styles.linkBtn}
                    aria-label={m.next_remove_label({ title: it.title })}
                    onClick={() => remove(it)}
                  >
                    <TrashIcon aria-hidden="true" />
                    {m.common_remove()}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        !failed && (
          <div className={styles.nextEmpty}>
            {/* a closed book with a ribbon marking where you'll start, its dotted road running to a pin not yet placed */}
            <svg
              className={styles.sticker}
              viewBox="0 0 120 100"
              aria-hidden="true"
              focusable="false"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className={styles.nsRoad}
                d="M50 74 C 64 80, 76 74, 84 64 C 90 56, 94 50, 98 44"
              />
              <rect
                className={styles.nsBook}
                x="14"
                y="30"
                width="44"
                height="50"
                rx="3"
              />
              <path className={styles.nsSpine} d="M22 30 V 80" />
              <path
                className={styles.nsRibbon}
                d="M44 26 V 92 L 40 88 L 36 92 V 26 Z"
              />
              <path
                className={styles.nsPin}
                d="M101 18c-6 0-10.5 4.6-10.5 10.4 0 7.6 10.5 17.6 10.5 17.6s10.5-10 10.5-17.6C111.5 22.6 107 18 101 18Z"
              />
              <circle className={styles.nsPinEye} cx="101" cy="28.6" r="3.4" />
            </svg>
            <p>{m.next_empty()}</p>
          </div>
        )
      )}
    </div>
  );
};

export default NextToRead;
