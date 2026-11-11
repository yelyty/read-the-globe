import { SunIcon, MoonStarsIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';
import * as s from './ThemeButton.css';

const THEME_KEY = 'rtg-theme';

// index.html reads the saved choice back before paint; this only flips it and saves it
const ThemeButton = () => {
  const dark = useTheme() === 'dark';

  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#1C1811' : '#FFFFFD');
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // private mode: the choice lasts for this page only
    }
  };

  return (
    <button
      type="button"
      className={s.themeBtn}
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to day reading' : 'Switch to night reading'}
    >
      {dark ? (
        <SunIcon aria-hidden="true" />
      ) : (
        <MoonStarsIcon aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeButton;
