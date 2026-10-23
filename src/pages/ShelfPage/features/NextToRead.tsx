import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookmarkSimpleIcon,
  CaretDownIcon,
  PushPinIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Goal, NextRead } from "../../../types";
import type { Marks } from "../../../utils/atlasMarks";
import { addNextRead, removeNextRead } from "../../../api/nextReads/nextReads";
import {
  countryStamp,
  loadCountries,
  type Country,
} from "../../PostcardPage/drawPostcard";
import { goalHas } from "../../GoalsPage/goals";
import * as s from "../ShelfPage.css";

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
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState("");
  const [mark, setMark] = useState<"set" | "author">("author");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Map<string, Country>>();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  const sorted = Object.entries(names).sort(([, a], [, b]) =>
    a.localeCompare(b),
  );

  const codeFor = (typed: string) =>
    sorted.find(([, n]) => n.toLowerCase() === typed.trim().toLowerCase())?.[0];
  const code = codeFor(country);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    const t = title.trim();
    if (!t) {
      setError("Add a title, or an idea like “a novel set in Chile”.");
      titleRef.current?.focus();
      return;
    }
    if (country.trim() && !code) {
      setError(
        `No country called “${country.trim()}”. Pick one from the list, or leave it empty.`,
      );
      document.getElementById("n-country")?.focus();
      return;
    }
    const dup = items.find(
      (it) =>
        it.title.toLowerCase() === t.toLowerCase() &&
        it.countryCode === (code ?? null),
    );
    if (dup) {
      setError(`“${dup.title}” is already on Next to read.`);
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
      setError("That couldn’t be saved. Try again.");
      return;
    }
    setItems((list) => [saved, ...list]);
    setTitle("");
    setAuthor("");
    setCountry("");
    setMark("author");
    setError("");
    setStatus(`Saved ${saved.title} to Next to read.`);
    titleRef.current?.focus();
  };

  const remove = async (item: NextRead) => {
    if (!(await removeNextRead(item.id))) {
      setStatus(`“${item.title}” couldn’t be removed. Try again.`);
      return;
    }
    setItems((list) => list.filter((it) => it.id !== item.id));
    setStatus(`Removed ${item.title} from Next to read.`);
    titleRef.current?.focus();
  };

  return (
    <div>
      <form className={s.nextForm} onSubmit={submit} noValidate>
        <div>
          <label className={s.fieldLabel} htmlFor="n-title">
            A book, or an idea
          </label>
          <input
            ref={titleRef}
            id="n-title"
            className={s.input}
            maxLength={200}
            placeholder="Kitchen, or “a novel set in Chile”"
            value={title}
            aria-invalid={error && !title.trim() ? true : undefined}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
          />
        </div>
        <div>
          <label className={s.fieldLabel} htmlFor="n-author">
            Author <span className={s.optional}>optional</span>
          </label>
          <input
            id="n-author"
            className={s.input}
            maxLength={120}
            placeholder="Who wrote it?"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label className={s.fieldLabel} htmlFor="n-country">
            Country <span className={s.optional}>optional</span>
          </label>
          <input
            id="n-country"
            className={s.input}
            list="n-countries"
            maxLength={60}
            placeholder="Chile"
            autoComplete="off"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setError("");
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
              That country is
            </label>
            <span className={s.pick}>
              <select
                id="n-mark"
                className={s.select}
                value={mark}
                onChange={(e) => setMark(e.target.value as "set" | "author")}
              >
                <option value="author">where the author is from</option>
                <option value="set">where the story is set</option>
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
            Save for later
          </button>
          <p className={s.status} role="status">
            {status}
          </p>
        </div>
      </form>

      {failed && (
        <p className={s.emptyNote}>
          Your Next to read list couldn’t load. Reload the page to try again.
        </p>
      )}
      {items.length > 0 ? (
        <ul className={s.nextList}>
          {items.map((it) => {
            const c = it.countryCode && countries?.get(it.countryCode);
            const stamp = c ? countryStamp(c) : null;
            const place = it.countryCode ? (names[it.countryCode] ?? "") : "";
            return (
              <li key={it.id} className={s.nextItem}>
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
                          className={it.mark === "set" ? s.dotSet : s.dotAuthor}
                          aria-hidden="true"
                        />
                        {it.mark === "set"
                          ? `Set in ${place}`
                          : `Author from ${place}`}
                      </span>
                      {!marks[it.countryCode] && (
                        <span className={s.fresh}>
                          New ground: it adds {place} to your atlas
                        </span>
                      )}
                      {/* the goals this book would move along */}
                      {goals
                        .filter((g) => goalHas(g, it.countryCode!))
                        .map((g) => (
                          <span key={g.id} className={s.nextGoal}>
                            {g.name}
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
                    Log it
                  </Link>
                  <button
                    type="button"
                    className={s.linkBtn}
                    aria-label={`Remove ${it.title} from Next to read`}
                    onClick={() => remove(it)}
                  >
                    <TrashIcon aria-hidden="true" />
                    Remove
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
            <p>Nothing saved yet. Add a book you mean to read.</p>
          </div>
        )
      )}
    </div>
  );
};

export default NextToRead;
