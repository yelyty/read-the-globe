import {
  getLocale,
  setLocale,
  toLocale,
  type Locale,
} from '../paraglide/runtime.js';
import { supabase } from './supabase';

// each language in its own name, so a reader stuck in the wrong one can still find theirs
export const LANG_NAMES: Record<Locale, string> = {
  en: 'English',
  cs: 'Čeština',
  uk: 'Українська',
};

/* The reader's pick: saved on this device (rtg-lang) and, when signed in, on the account, so another device opens in it.
   ponytail: setLocale reloads the page under the new prefix; fine for a pick made once */
export async function pickLang(lang: Locale) {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (id) await supabase.from('profiles').update({ lang }).eq('id', id);
  void setLocale(lang);
}

/* After signing in: the account's language wins on this device too. An account that has none yet takes the one
   it was signed in with. Returns true when the page is reloading into another language. */
export async function adoptAccountLang(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('lang')
    .eq('id', userId)
    .maybeSingle<{ lang: string | null }>();
  const saved = toLocale(data?.lang);
  if (!saved) {
    await supabase
      .from('profiles')
      .update({ lang: getLocale() })
      .eq('id', userId);
    return false;
  }
  if (saved === getLocale()) return false;
  void setLocale(saved);
  return true;
}
