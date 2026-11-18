import { XIcon } from '@phosphor-icons/react';

import { m } from '../../../../paraglide/messages.js';

type PickedCountryProps = {
  code: string;
  name: string;
  onRemove: (code: string) => void;
};

/**
 * Shows a country picked for a goal, with a button to remove it.
 */
const PickedCountry = ({ code, name, onRemove }: PickedCountryProps) => {
  const handleClick = () => onRemove(code);

  return (
    <li>
      {name}
      <button
        type="button"
        aria-label={m.goals_remove_country({ country: name })}
        onClick={handleClick}
      >
        <XIcon aria-hidden="true" />
      </button>
    </li>
  );
};

export default PickedCountry;
