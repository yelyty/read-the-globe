import type { ChangeEvent } from 'react';

import type { Goal } from '../../types';
import Checkbox from '../Checkbox/Checkbox';

type ThemeTickProps = {
  theme: Goal;
  checked: boolean;
  onTick: (themeId: number, checked: boolean) => void;
};

// one theme goal the book can count toward
const ThemeTick = ({ theme, checked, onTick }: ThemeTickProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onTick(theme.id, event.target.checked);

  return (
    <li>
      <label>
        <Checkbox checked={checked} onChange={handleChange} />
        {theme.name}
      </label>
    </li>
  );
};

export default ThemeTick;
