import { m } from '../../../paraglide/messages.js';
import Field from '../../../components/Field/Field';
import Hint from '../../../components/Hint/Hint';
import MarkDot from '../../../components/MarkDot/MarkDot';
import Suggest from '../../../components/Suggest/Suggest';
import * as styles from '../LogBook.css';
import ThenNote from './ThenNote';

type AuthorCountryFieldProps = {
  value: string;
  error?: string;
  /** every country name, sorted */
  countries: string[];
  names: Record<string, string>;
  /** today's country chosen for a state that split, by code */
  pick: string;
  /** that choice unfolded again by Change */
  pickOpen: boolean;
  onValue: (value: string) => void;
  onPick: (code: string) => void;
  onPickReopen: () => void;
};

/**
 * Shows the Author from field: the country of the author.
 * Under the field, a note tells what an old or split name counts as, and for a split state, the reader picks today's country.
 * @param pick - The country picked for a state that split.
 * @param pickOpen - If true, the choice of countries shows again after Change.
 */
const AuthorCountryField = ({
  value,
  error,
  countries,
  names,
  pick,
  pickOpen,
  onValue,
  onPick,
  onPickReopen,
}: AuthorCountryFieldProps) => {
  const countryControl = (
    <Suggest
      autoComplete="off"
      options={countries}
      maxLength={60}
      placeholder={m.log_country_ph()}
      value={value}
      onValue={onValue}
    />
  );

  return (
    <Field
      id="f-country"
      label={
        <>
          <MarkDot kind="author" className={styles.labelDot} />
          {m.log_country()}
        </>
      }
      error={error}
      aria-describedby="f-country-note"
      control={countryControl}
      below={<Hint id="f-country-note">{m.log_country_hint()}</Hint>}
    >
      <ThenNote
        typed={value}
        pick={pick}
        open={pickOpen}
        author
        names={names}
        onPick={onPick}
        onChange={onPickReopen}
      />
    </Field>
  );
};

export default AuthorCountryField;
