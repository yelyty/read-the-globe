import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { PlusIcon } from '@phosphor-icons/react';

import { splitStates } from '../../utils/countryFrom';
import { m } from '../../paraglide/messages.js';
import * as fieldStyles from '../../components/Field/Field.css';
import Button from '../../components/Button/Button';
import Hint from '../../components/Hint/Hint';
import MarkDot from '../../components/MarkDot/MarkDot';
import * as styles from './LogBook.css';
import PlaceItem from './PlaceItem';
import { PLACE_KEY, splitPlace } from './bookLog';
import { row, type Row } from './placeRow';

const MAX_PLACES = 20;

type PlacesFieldProps = {
  rows: Row[];
  setRows: Dispatch<SetStateAction<Row[]>>;
  /** the form's errors, by field key */
  errors: Record<string, string>;
  /** a field was touched: its error goes */
  onFix: (key: string) => void;
  /** the reader's imagined worlds, offered when a place is marked imagined */
  worlds: string[];
  /** every country name, sorted */
  countries: string[];
  names: Record<string, string>;
};

/**
 * Shows the Set in field: the places the story visits, one row for each place, up to 20.
 * @param onFix - Called with the key of a row, to clear its error when it changes.
 */
const PlacesField = ({
  rows,
  setRows,
  errors,
  onFix,
  worlds,
  countries,
  names,
}: PlacesFieldProps) => {
  const name = (code?: string | null) => (code ? (names[code] ?? '') : '');
  const fixRow = (placeRow: Row) => onFix(`${PLACE_KEY}${placeRow.key}`);

  const setRow = (key: number, change: Partial<Row>) =>
    setRows((rs) =>
      rs.map((placeRow) =>
        placeRow.key === key ? { ...placeRow, ...change } : placeRow
      )
    );

  /* ---------- handlers ---------- */
  // a place's name: a real place named after its country fills the country in, if it's still empty
  const handleNameValue = (placeRow: Row) => (value: string) => {
    const sp = !placeRow.imagined && splitPlace(value, names);

    setRow(placeRow.key, {
      name: value,
      ...(sp && !placeRow.country && { country: name(sp.code) }),
    });
  };

  const handleCountryValue = (placeRow: Row) => (value: string) => {
    setRow(placeRow.key, {
      country: value,
      open: false,
      ...(!splitStates(value) && { pick: '' }),
    });

    fixRow(placeRow);
  };

  // the last place is emptied rather than removed, so there's always a row to type in
  const handleRemove = (placeRow: Row) => () => {
    fixRow(placeRow);

    setRows((rs) =>
      rs.length === 1
        ? [row()]
        : rs.filter((other) => other.key !== placeRow.key)
    );

    document.querySelector<HTMLInputElement>(`.${styles.place} input`)?.focus();
  };

  const handlePick = (placeRow: Row) => (code: string) => {
    setRow(placeRow.key, { pick: code, open: false });
    fixRow(placeRow);
  };

  const handleChoiceReopen = (placeRow: Row) => () =>
    setRow(placeRow.key, { open: true });

  const handleImaginedChange =
    (placeRow: Row) => (event: ChangeEvent<HTMLInputElement>) => {
      setRow(placeRow.key, { imagined: event.target.checked });
      fixRow(placeRow);
    };

  const handleAdd = () => {
    const newRow = row();

    setRows((rs) => [...rs, newRow]);

    requestAnimationFrame(() =>
      document.getElementById(`pr-name-${newRow.key}`)?.focus()
    );
  };

  /* ---------- lists ---------- */

  return (
    <fieldset className={styles.set}>
      <legend className={fieldStyles.fieldLabel}>
        <MarkDot kind="set" className={styles.labelDot} />
        {m.log_places()}
      </legend>
      <Hint>{m.log_city_hint()}</Hint>
      <div className={styles.placesHead} aria-hidden="true">
        <span>{m.log_city()}</span>
        <span>{m.log_country_col()}</span>
      </div>
      <ul className={styles.places}>
        {rows.map((placeRow) => (
          <PlaceItem
            key={placeRow.key}
            placeRow={placeRow}
            error={errors[`${PLACE_KEY}${placeRow.key}`]}
            empty={rows.length === 1 && !placeRow.name && !placeRow.country}
            worlds={worlds}
            countries={countries}
            names={names}
            onNameValue={handleNameValue(placeRow)}
            onCountryValue={handleCountryValue(placeRow)}
            onRemove={handleRemove(placeRow)}
            onPick={handlePick(placeRow)}
            onChoiceReopen={handleChoiceReopen(placeRow)}
            onImaginedChange={handleImaginedChange(placeRow)}
          />
        ))}
      </ul>
      {rows.length < MAX_PLACES && (
        <Button type="button" variant="link" onClick={handleAdd}>
          <PlusIcon aria-hidden="true" />
          {m.log_add_place()}
        </Button>
      )}
    </fieldset>
  );
};

export default PlacesField;
