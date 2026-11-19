import type { ChangeEvent } from 'react';
import { XIcon } from '@phosphor-icons/react';

import { m } from '../../../paraglide/messages.js';
import Checkbox from '../../../components/Checkbox/Checkbox';
import * as fieldStyles from '../../../components/Field/Field.css';
import Suggest from '../../../components/Suggest/Suggest';
import * as styles from '../LogBook.css';
import type { Row } from '../utils/placeRow';
import ThenNote from './ThenNote';

type PlaceItemProps = {
  placeRow: Row;
  /** what's wrong with its country, if anything */
  error?: string;
  /** the only row, still blank: nothing to remove */
  empty: boolean;
  /** the reader's imagined worlds, offered when the place is marked imagined */
  worlds: string[];
  countries: string[];
  names: Record<string, string>;
  onNameValue: (value: string) => void;
  onCountryValue: (value: string) => void;
  onRemove: () => void;
  onPick: (code: string) => void;
  onChoiceReopen: () => void;
  onImaginedChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Shows one place in the log form: its name, its country (if it is not imagined), and the button to remove it.
 * @param empty - If true, the place is the only row and it is empty.
 * @param worlds - The imagined worlds of the reader, offered when the place is imagined.
 */
const PlaceItem = ({
  placeRow,
  error,
  empty,
  worlds,
  countries,
  names,
  onNameValue,
  onCountryValue,
  onRemove,
  onPick,
  onChoiceReopen,
  onImaginedChange,
}: PlaceItemProps) => (
  <li className={styles.place} data-imagined={placeRow.imagined || undefined}>
    <label className={styles.srOnly} htmlFor={`pr-name-${placeRow.key}`}>
      {m.log_place()}
    </label>
    <Suggest
      id={`pr-name-${placeRow.key}`}
      className={fieldStyles.input}
      autoComplete="off"
      maxLength={80}
      placeholder={placeRow.imagined ? m.log_world_ph() : m.log_city()}
      // an imagined place offers the reader's worlds
      options={placeRow.imagined ? worlds : []}
      value={placeRow.name}
      onValue={onNameValue}
    />
    {!placeRow.imagined && (
      <div data-invalid={Boolean(error)}>
        <label className={styles.srOnly} htmlFor={`pr-country-${placeRow.key}`}>
          {m.log_place_country()}
        </label>
        <Suggest
          id={`pr-country-${placeRow.key}`}
          className={fieldStyles.input}
          autoComplete="off"
          options={countries}
          maxLength={60}
          placeholder={m.log_country_col()}
          value={placeRow.country}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `pr-country-${placeRow.key}-err` : undefined
          }
          onValue={onCountryValue}
        />
        {error && (
          <div
            id={`pr-country-${placeRow.key}-err`}
            className={fieldStyles.fieldError}
          >
            {error}
          </div>
        )}
      </div>
    )}
    <button
      type="button"
      className={styles.close}
      aria-label={m.log_remove_place()}
      hidden={empty}
      onClick={onRemove}
    >
      <XIcon aria-hidden="true" />
    </button>
    {!placeRow.imagined && (
      <ThenNote
        typed={placeRow.country}
        pick={placeRow.pick}
        open={placeRow.open}
        names={names}
        onPick={onPick}
        onChange={onChoiceReopen}
      />
    )}
    {/* an imagined world has no country: ticking it sets the country aside (kept, in case it's unticked) */}
    <label className={styles.imagined}>
      <Checkbox checked={placeRow.imagined} onChange={onImaginedChange} />
      {m.log_imagined()}
    </label>
  </li>
);

export default PlaceItem;
