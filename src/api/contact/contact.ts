import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import type { Problem } from '../outcome';

export type ContactMessage = { name: string; email: string; message: string };

/**
 * Sends a message from the Contact page.
 * @returns Null if the message was sent. If not, a message that it could not be sent.
 */
export async function sendContactMessage(
  message: ContactMessage
): Promise<Problem> {
  const { error } = await supabase.from('contact_messages').insert(message);

  if (error) console.error(error);

  return error ? m.contact_failed() : null;
}
