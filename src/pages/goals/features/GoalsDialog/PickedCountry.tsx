import { XIcon } from '@phosphor-icons/react';

import { m } from '../../../../paraglide/messages.js';

type PickedCountryProps = {
  code: string;
  name: string;
  onRemove: (code: string) => void;
};

// a country chosen for the goal, with the way to take it off again
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
