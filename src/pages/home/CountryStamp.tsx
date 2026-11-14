import type { FocusEvent } from 'react';
import { Link } from '@tanstack/react-router';

import type { Mark } from '../../utils/atlasMarks';
import CountryShape from './CountryShape';
import { describe } from './describeMark';
import * as styles from './HomePage.css';

type CountryStampProps = {
  code: string;
  name: string;
  mark: Mark;
  /** reached from the keyboard: the map shows its tip for the country; null when focus goes */
  onFocusCountry?: (code: string, el: Element | null) => void;
};

// one country of the atlas as a stamp: its shape, name and marks, linking to its books on the Shelf
const CountryStamp = ({
  code,
  name,
  mark,
  onFocusCountry,
}: CountryStampProps) => {
  // a click focuses it too; only the keyboard's focus shows the tip
  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.matches(':focus-visible'))
      onFocusCountry?.(code, event.currentTarget);
  };

  const handleBlur = () => onFocusCountry?.(code, null);

  return (
    <li>
      <Link
        className={styles.ccStamp}
        to="/app/shelf"
        search={{ country: code }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <span className={styles.ccShape}>
          <CountryShape code={code} mark={mark} width={128} height={80} />
        </span>
        <span className={styles.ccName}>{name}</span>
        <span className={styles.ccWhat}>{describe(mark)}</span>
      </Link>
    </li>
  );
};

export default CountryStamp;
