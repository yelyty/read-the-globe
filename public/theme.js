// one theme switch: data-theme is set before paint, from the saved choice (ThemeButton saves "light" or "dark")
// or else the system setting, and follows the system until the reader picks
(() => {
  const root = document.documentElement;
  const dark = matchMedia('(prefers-color-scheme: dark)');

  const saved = () => {
    try {
      return localStorage.getItem('rtg-theme');
    } catch {
      return null;
    }
  };

  const set = () => {
    const picked = saved();

    const theme =
      picked === 'light' || picked === 'dark'
        ? picked
        : dark.matches
          ? 'dark'
          : 'light';

    root.dataset.theme = theme;

    document.querySelector('meta[name="theme-color"]').content =
      theme === 'dark' ? '#1C1811' : '#FFFFFD';
  };

  set();

  dark.addEventListener('change', () => {
    if (!saved()) set();
  });
})();
