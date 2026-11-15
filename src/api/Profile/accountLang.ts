import { supabase } from '../../utils/supabase';
import type { Problem } from '../outcome';

/** the language saved on the account, or null when it has none yet; throws when it can't be read */
export async function getAccountLang(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('lang')
    .eq('id', userId)
    .maybeSingle<{ lang: string | null }>();

  if (error) throw error;

  return data?.lang ?? null;
}

/** saves the language on the account: the one given, or the signed-in reader's; signed out, nothing to save */
export async function saveAccountLang(
  lang: string,
  userId?: string
): Promise<Problem> {
  const id = userId ?? (await supabase.auth.getSession()).data.session?.user.id;

  if (!id) return null;

  const { error } = await supabase
    .from('profiles')
    .update({ lang })
    .eq('id', id);

  return error?.message ?? null;
}
