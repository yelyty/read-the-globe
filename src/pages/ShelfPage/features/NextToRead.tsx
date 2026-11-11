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
import * as s from '../ShelfPage.css';

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

  const sorted = Object.entries(names).sort(([, a], [, b]) =>
    a.localeCompare(b, getLocale())
  );

  const codeFor = (typed: string) =>
    sorted.find(([, n]) => n.toLowerCase() === typed.trim().toLowerCase())?.[0];

  const code = codeFor(country);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaid('');
    const t = title.trim();

    if (!t) {
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
        it.title.toLowerCase() === t.toLowerCase() &&
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
      title: t,
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
      <form className={s.nextForm} onSubmit={submit} noValidate>
        <div>
          <label className={s.fieldLabel} htmlFor="n-title">
            {m.next_label_title()}
          </label>
          <input
            ref={titleRef}
            id="n-title"
            className={s.input}
            maxLength={200}
            placeholder={m.next_placeholder_title()}
            value={title}
            aria-invalid={error && !title.trim() ? true : undefined}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
          />
        </div>
        <div>
          <label className={s.fieldLabel} htmlFor="n-author">
            {m.next_label_author()}{' '}
            <span className={s.optional}>{m.common_optional()}</span>
          </label>
          <input
            id="n-author"
            className={s.input}
            maxLength={120}
            placeholder={m.next_placeholder_author()}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label className={s.fieldLabel} htmlFor="n-country">
            {m.next_label_country()}{' '}
            <span className={s.optional}>{m.common_optional()}</span>
          </label>
          <input
            id="n-country"
            className={s.input}
            list="n-countries"
            maxLength={60}
            placeholder={m.next_placeholder_country()}
            autoComplete="off"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setError('');
            }}
          />
          <datalist id="n-countries">
            {sorted.map(([c, n]) => (
              <option key={c} value={n} />
            ))}
          </datalist>
        </div>
        {code && (
          <div className={s.nextWide}>
            <label className={s.fieldLabel} htmlFor="n-mark">
              {m.next_mark_label()}
            </label>
            <span className={s.pick}>
              <select
                id="n-mark"
                className={s.select}
                value={mark}
                onChange={(e) => setMark(e.target.value as 'set' | 'author')}
              >
                <option value="author">{m.next_mark_author()}</option>
                <option value="set">{m.next_mark_set()}</option>
              </select>
              <CaretDownIcon aria-hidden="true" />
            </span>
          </div>
        )}
        {error && (
          <p className={`${s.nextWide} ${s.error}`} role="alert">
            {error}
          </p>
        )}
        <div className={`${s.nextWide} ${s.formRow}`}>
          <button type="submit" className={s.primary} disabled={saving}>
            <BookmarkSimpleIcon aria-hidden="true" />
            {m.next_save()}
          </button>
          <p className={s.status} role="status">
            {said}
          </p>
        </div>
      </form>

      {failed && <p className={s.emptyNote}>{m.next_load_failed()}</p>}
      {items.length > 0 ? (
        <ul className={s.nextList}>
          {items.map((it) => {
            const c = it.countryCode && countries?.get(it.countryCode);
            const stamp = c ? countryStamp(c) : null;
            const place = it.countryCode ? (names[it.countryCode] ?? '') : '';

            return (
              <li
                key={it.id}
                id={`next-${it.id}`}
                tabIndex={-1}
                className={s.nextItem}
              >
                {/* the country it would mark, still pale: it isn't on the atlas until it's read */}
                <span className={s.nextStamp} aria-hidden="true">
                  {stamp ? (
                    <svg viewBox={stamp.viewBox} focusable="false">
                      <path
                        className={s.nextShape}
                        d={stamp.d}
                        data-mark={it.mark}
                      />
                    </svg>
                  ) : (
                    <BookmarkSimpleIcon className={s.nextMark} />
                  )}
                </span>
                <div className={s.nextBody}>
                  <span className={s.nextTitle}>{it.title}</span>
                  {it.author && (
                    <span className={s.nextAuthor}>{it.author}</span>
                  )}
                  {it.countryCode && (
                    <div className={s.nextMeta}>
                      <span>
                        <i
                          className={it.mark === 'set' ? s.dotSet : s.dotAuthor}
                          aria-hidden="true"
                        />
                        {it.mark === 'set'
                          ? m.next_set_in({ country: place })
                          : m.next_author_from({ country: place })}
                      </span>
                      {!marks[it.countryCode] && (
                        <span className={s.fresh}>
                          {m.next_new_ground({ country: place })}
                        </span>
                      )}
                      {/* the goals this book would move along */}
                      {goals
                        .filter((g) => goalHas(g, it.countryCode!))
                        .map((g) => (
                          <span key={g.id} className={s.nextGoal}>
                            {goalName(g.name)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className={s.nextActs}>
                  <Link
                    className={s.linkBtn}
                    to="."
                    search={(prev) => ({ ...prev, log: true, next: it.id })}
                  >
                    <PushPinIcon aria-hidden="true" />
                    {m.next_log_it()}
                  </Link>
                  <button
                    type="button"
                    className={s.linkBtn}
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
          <div className={s.nextEmpty}>
            {/* a closed book with a ribbon marking where you'll start, its dotted road running to a pin not yet placed */}
            <svg
              className={s.sticker}
              viewBox="0 0 120 100"
              aria-hidden="true"
              focusable="false"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className={s.nsRoad}
                d="M50 74 C 64 80, 76 74, 84 64 C 90 56, 94 50, 98 44"
              />
              <rect
                className={s.nsBook}
                x="14"
                y="30"
                width="44"
                height="50"
                rx="3"
              />
              <path className={s.nsSpine} d="M22 30 V 80" />
              <path
                className={s.nsRibbon}
                d="M44 26 V 92 L 40 88 L 36 92 V 26 Z"
              />
              <path
                className={s.nsPin}
                d="M101 18c-6 0-10.5 4.6-10.5 10.4 0 7.6 10.5 17.6 10.5 17.6s10.5-10 10.5-17.6C111.5 22.6 107 18 101 18Z"
              />
              <circle className={s.nsPinEye} cx="101" cy="28.6" r="3.4" />
            </svg>
            <p>{m.next_empty()}</p>
          </div>
        )
      )}
    </div>
  );
};

export default NextToRead;
