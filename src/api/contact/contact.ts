import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';

export type ContactMessage = { name: string; email: string; message: string };

// insert-only for everyone (contact-messages SQL): the form can send, never read back
export async function sendContactMessage(
  message: ContactMessage
): Promise<string | null> {
  const { error } = await supabase.from('contact_messages').insert(message);

  if (error) console.error(error);

  return error ? m.contact_failed() : null;
}
