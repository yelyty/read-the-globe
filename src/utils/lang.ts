import {
  extractLocaleFromNavigator,
  getLocale,
  localStorageKey,
  setLocale,
  toLocale,
  type Locale,
} from '../paraglide/runtime.js';
import { getAccountLang, saveAccountLang } from '../api/profile/profile';

// each language in its own name, so a reader stuck in the wrong one can still find theirs
export const LANG_NAMES: Record<Locale, string> = {
  en: 'English',
  cs: 'Čeština',
  uk: 'Українська',
};

/**
 * Saves the language the reader picked: on this device and, if the reader is signed in, on the account,
 * so another device opens in it too. Then the page reloads in the language.
 * If the save on the account fails, the language still changes on this device.
 */
export const pickLang = async (lang: Locale) => {
  await saveAccountLang(lang);
  void setLocale(lang);
};

/**
 * After a sign-in, uses the language of the account on this device too.
 * An account with no language yet saves the language the reader signed in with.
 * The function throws an error if the language of the account cannot be read, so it never overwrites it.
 * @returns True if the page reloads in another language.
 */
export const adoptAccountLang = async (userId: string): Promise<boolean> => {
  const saved = toLocale(await getAccountLang(userId));

  if (!saved) {
    await saveAccountLang(getLocale(), userId);

    return false;
  }

  if (saved === getLocale()) return false;
  void setLocale(saved);

  return true;
};

/**
 * Gets the language the reader wants: the one saved on this device, or else the one the browser prefers.
 * A URL without /cs or /uk is read as English, so the app uses this to send the reader to the right prefix.
 */
export const wantedLocale = () => {
  try {
    const saved = toLocale(localStorage.getItem(localStorageKey));

    if (saved) return saved;
  } catch {
    // storage blocked: fall back to the browser
  }

  return extractLocaleFromNavigator();
};
