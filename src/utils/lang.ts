import {
  extractLocaleFromNavigator,
  getLocale,
  localStorageKey,
  setLocale,
  toLocale,
  type Locale,
} from '../paraglide/runtime.js';
import { getAccountLang, saveAccountLang } from '../api/Profile/accountLang';

// each language in its own name, so a reader stuck in the wrong one can still find theirs
export const LANG_NAMES: Record<Locale, string> = {
  en: 'English',
  cs: 'Čeština',
  uk: 'Українська',
};

/* The reader's pick: saved on this device (rtg-lang) and, when signed in, on the account, so another device opens in it.
   Saving on the account is best-effort: the pick still holds on this device if it fails.
   ponytail: setLocale reloads the page under the new prefix; fine for a pick made once */
export async function pickLang(lang: Locale) {
  await saveAccountLang(lang);
  void setLocale(lang);
}

/* After signing in: the account's language wins on this device too. An account that has none yet takes the one
   it was signed in with. Returns true when the page is reloading into another language; throws when the account's
   language can't be read, so a failed read never overwrites it. */
export async function adoptAccountLang(userId: string): Promise<boolean> {
  const saved = toLocale(await getAccountLang(userId));

  if (!saved) {
    await saveAccountLang(getLocale(), userId);

    return false;
  }

  if (saved === getLocale()) return false;
  void setLocale(saved);

  return true;
}

// A URL without /cs or /uk reads as English, so Paraglide never looks further. Send a reader who
// picked another language, or whose browser prefers one, to its prefix. A prefix in a link always wins.
export const wantedLocale = () => {
  try {
    const saved = toLocale(localStorage.getItem(localStorageKey));

    if (saved) return saved;
  } catch {
    // storage blocked: fall back to the browser
  }

  return extractLocaleFromNavigator();
};
