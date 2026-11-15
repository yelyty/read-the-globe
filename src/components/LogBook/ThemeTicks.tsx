import type { Goal } from '../../types';
import { m } from '../../paraglide/messages.js';
import * as styles from './LogBook.css';
import ThemeTick from './ThemeTick';

type ThemeTicksProps = {
  /** the reader's theme goals */
  themes: Goal[];
  /** the ones this book counts toward */
  ticks: number[];
  onChange: (ticks: number[]) => void;
  /** starts unfolded: the book already counts toward one */
  open: boolean;
};

// Counts toward…: a theme goal can't be read off the map, so the reader ticks it
const ThemeTicks = ({ themes, ticks, onChange, open }: ThemeTicksProps) => {
  const handleTick = (themeId: number, checked: boolean) =>
    onChange(
      checked ? [...ticks, themeId] : ticks.filter((id) => id !== themeId)
    );

  return (
    <fieldset className={styles.themes}>
      <legend className={styles.srOnly}>{m.log_themes()}</legend>
      <details open={open}>
        <summary>
          {ticks.length
            ? m.log_counts_toward({
                goals: m.count_theme_goal({ count: ticks.length }),
              })
            : m.log_counts_q()}
        </summary>
        <ul>
          {themes.map((theme) => (
            <ThemeTick
              key={theme.id}
              theme={theme}
              checked={ticks.includes(theme.id)}
              onTick={handleTick}
            />
          ))}
        </ul>
      </details>
    </fieldset>
  );
};

export default ThemeTicks;
