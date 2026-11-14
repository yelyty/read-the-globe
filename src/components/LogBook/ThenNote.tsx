import { useRef } from 'react';

import { countryFrom, splitStates, tidy } from '../../utils/countryFrom';
import { m } from '../../paraglide/messages.js';
import * as styles from './LogBook.css';
import Bold, { BOLD } from './Bold';

type ThenNoteProps = {
  typed: string;
  pick: string;
  /** the choice unfolded again by Change */
  open: boolean;
  author?: boolean;
  names: Record<string, string>;
  onPick: (code: string) => void;
  onChange: () => void;
};

// Under a country field: what an old or dependent name counts as, and for a state that split, a choice of today's countries
const ThenNote = ({
  typed,
  pick,
  open,
  author,
  names,
  onPick,
  onChange,
}: ThenNoteProps) => {
  const note = useRef<HTMLDivElement>(null);

  // after a pick, focus goes to Change; after Change, to the chosen pill
  const focusIn = (selector: string) =>
    requestAnimationFrame(() =>
      note.current?.querySelector<HTMLElement>(selector)?.focus()
    );

  const name = tidy(typed);
  const states = splitStates(typed);
  const match = countryFrom(typed, names, pick);

  // after Change the chosen pill takes focus; after a pick, Change does
  const handleChange = () => {
    onChange();
    focusIn('[aria-pressed="true"], button');
  };

  const handlePick = (code: string) => () => {
    onPick(code);
    focusIn('button');
  };

  const renderPick = (code: string) => (
    <button
      key={code}
      type="button"
      aria-pressed={pick === code}
      onClick={handlePick(code)}
    >
      {names[code]}
    </button>
  );

  let content = null;

  if (states && match && !open)
    content = (
      <p>
        <Bold
          text={m.log_then_counted({ name, country: BOLD })}
          bold={names[match.code]}
        />{' '}
        <button
          type="button"
          className={styles.thenChange}
          onClick={handleChange}
        >
          {m.common_change()}
        </button>
      </p>
    );
  else if (states)
    content = (
      <>
        <p>
          {m.log_then_today({
            name,
            countries: m.count_country({ count: states.length }),
          })}{' '}
          {author ? m.log_then_author() : m.log_then_place()}
        </p>
        <div className={styles.thenPicks}>{states.map(renderPick)}</div>
      </>
    );
  else if (match?.then)
    content = <p>{m.log_then_as({ country: names[match.code] })}</p>;
  else if (match?.as && match.under)
    content = (
      <p>
        {match.code === match.under
          ? m.log_then_under({ country: names[match.under] })
          : m.log_then_under_fill({
              country: names[match.under],
              area: match.as,
            })}
      </p>
    );

  return (
    <div
      ref={note}
      className={styles.thenNote}
      aria-live="polite"
      hidden={!content}
    >
      {content}
    </div>
  );
};

export default ThenNote;
