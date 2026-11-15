import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import type { Problem } from '../outcome';

export type ContactMessage = { name: string; email: string; message: string };

export async function sendContactMessage(
  message: ContactMessage
): Promise<Problem> {
  const { error } = await supabase.from('contact_messages').insert(message);

  if (error) console.error(error);

  return error ? m.contact_failed() : null;
}
