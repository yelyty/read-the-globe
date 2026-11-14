import { useLayoutEffect, useRef } from 'react';

import type { Marks } from '../../utils/atlasMarks';
import type { BookEntry } from '../../types';
import { m } from '../../paraglide/messages.js';
import * as styles from './HomePage.css';
import TipBook from './TipBook';

// space kept between the tip and the screen's edges or the header
const EDGE_GAP = 8;
// space between the tip and the point it's about
const POINT_GAP = 16;

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

    const floor =
      (document.querySelector('header')?.offsetHeight ?? 0) + EDGE_GAP;

    el.style.left = `${Math.max(EDGE_GAP, Math.min(innerWidth - tw - EDGE_GAP, tip.x - tw / 2))}px`;
    el.style.top = `${tip.y - th - POINT_GAP < floor ? Math.min(innerHeight - th - EDGE_GAP, tip.bottom + POINT_GAP) : tip.y - th - POINT_GAP}px`;
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

  const renderBook = (book: BookEntry) => (
    <TipBook
      key={book.id}
      book={book}
      set={mark.set.includes(book)}
      author={mark.author.includes(book)}
    />
  );

  return (
    <div ref={ref} className={styles.tip} role="tooltip">
      <p className={`${styles.tipHead} ${styles.tipHeadBooks}`}>
        <b>{name}</b>
        <span>{m.count_book({ count: books.length })}</span>
      </p>
      <ul className={styles.tipList}>
        {books.slice(0, SHOWN).map(renderBook)}
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
