import { useLayoutEffect, useRef } from 'react';
import type { Marks } from '../../utils/atlasMarks';
import { coverColor } from '../../utils/coverColors';
import * as styles from './HomePage.css';
import { m } from '../../paraglide/messages.js';

export type Tip = {
  code: string;
  /** where it points: the pointer, or the country (or chip) it's about */
  x: number;
  y: number;
  bottom: number;
  /** how it was opened, which says what a second press does */
  by: 'mouse' | 'touch' | 'key';
};

const SHOWN = 4;

type MapTipProps = { tip: Tip; marks: Marks; names: Record<string, string> };

/* Hovering (or tapping, or focusing) a country shows a small card: a marked one's books with cover, title,
   author and why each marks it; an unmarked one's name and what a click does. */
const MapTip = ({ tip, marks, names }: MapTipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const mark = marks[tip.code];
  const name = names[tip.code] ?? '';

  // above the point, or below it when that would go under the sticky header; never off the screen's sides
  useLayoutEffect(() => {
    const el = ref.current;

    if (!el) return;
    const tw = el.offsetWidth;
    const th = el.offsetHeight;
    const floor = (document.querySelector('header')?.offsetHeight ?? 0) + 8;

    el.style.left = `${Math.max(8, Math.min(innerWidth - tw - 8, tip.x - tw / 2))}px`;
    el.style.top = `${tip.y - th - 16 < floor ? Math.min(innerHeight - th - 8, tip.bottom + 16) : tip.y - th - 16}px`;
  });

  if (!mark)
    return (
      <div ref={ref} className={styles.tip} role="tooltip">
        <p className={styles.tipHead}>
          <b>{name}</b>
          <span>{m.tip_no_books()}</span>
        </p>
        <p className={styles.tipFoot}>
          {tip.by === 'touch' ? m.tip_tap_log() : m.tip_click_log()}
        </p>
      </div>
    );

  const books = [...new Set([...mark.set, ...mark.author])];
  const one = books.length === 1;

  const foot = {
    touch: one ? m.tip_tap_one : m.tip_tap_many,
    mouse: one ? m.tip_click_one : m.tip_click_many,
    key: one ? m.tip_key_one : m.tip_key_many,
  }[tip.by]();

  return (
    <div ref={ref} className={styles.tip} role="tooltip">
      <p className={`${styles.tipHead} ${styles.tipHeadBooks}`}>
        <b>{name}</b>
        <span>{m.count_book({ count: books.length })}</span>
      </p>
      <ul className={styles.tipList}>
        {books.slice(0, SHOWN).map((book) => {
          const set = mark.set.includes(book);
          const author = mark.author.includes(book);

          return (
            <li key={book.id}>
              <i
                className={styles.tipCover}
                style={{
                  background: coverColor(
                    book.title + (book.author?.name ?? '')
                  ),
                }}
                aria-hidden="true"
              />
              <span className={styles.tipBook}>
                <span className={styles.tipTitle}>{book.title}</span>
                <span>{book.author?.name}</span>
                <span className={styles.tipWhy}>
                  <i
                    className={
                      set && author
                        ? styles.swatchBoth
                        : set
                          ? styles.swatchSet
                          : styles.swatchAuthor
                    }
                    aria-hidden="true"
                  />
                  {set && author
                    ? m.tip_both()
                    : set
                      ? m.tip_set()
                      : m.tip_author()}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className={`${styles.tipFoot} ${styles.tipFootRule}`}>
        {books.length > SHOWN &&
          `${m.tip_more({ count: books.length - SHOWN })} · `}
        {foot}
      </p>
    </div>
  );
};

export default MapTip;
