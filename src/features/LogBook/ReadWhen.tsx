import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import * as fieldStyles from '../../components/Field/Field.css';
import Hint from '../../components/Hint/Hint';
import Select from '../../components/Select/Select';
import * as styles from './LogBook.css';

const MONTHS_IN_YEAR = 12;
// any year serves: only its month names are read
const SAMPLE_YEAR = 2000;
// the year menu reaches this many years back
const YEARS_BACK = 80;

const MONTHS = Array.from({ length: MONTHS_IN_YEAR }, (_unused, i) =>
  new Intl.DateTimeFormat(getLocale(), { month: 'long' }).format(
    new Date(SAMPLE_YEAR, i, 1)
  )
);

const YEARS = Array.from({ length: YEARS_BACK }, (_unused, i) =>
  String(new Date().getFullYear() - i)
);

type ReadWhenProps = {
  /** "01"–"12", or "" for none */
  month: string;
  year: string;
  onMonth: (month: string) => void;
  onYear: (year: string) => void;
};

/**
 * Shows the When field: the month and the year the book was read. Both are optional.
 */
const ReadWhen = ({ month, year, onMonth, onYear }: ReadWhenProps) => {
  // the month and year menus: "Month" / "Year" first, for a book read some time
  const monthOptions = [
    { value: '', label: m.log_month() },
    ...MONTHS.map((monthName, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: monthName,
    })),
  ];

  const yearOptions = [
    { value: '', label: m.log_year() },
    ...YEARS.map((yearOption) => ({ value: yearOption, label: yearOption })),
  ];

  return (
    <fieldset className={styles.set} aria-describedby="f-month-hint">
      <legend className={fieldStyles.fieldLabel}>{m.log_when()}</legend>
      <div className={styles.month}>
        <Select
          id="f-mon"
          label={m.log_month()}
          className={styles.monthPick}
          value={month}
          onChange={onMonth}
          options={monthOptions}
        />
        <Select
          id="f-year"
          label={m.log_year()}
          className={styles.yearPick}
          value={year}
          onChange={onYear}
          options={yearOptions}
        />
      </div>
      <Hint id="f-month-hint">{m.log_month_hint()}</Hint>
    </fieldset>
  );
};

export default ReadWhen;
