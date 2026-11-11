import { supabase } from '../../utils/supabase';

export type ContactMessage = { name: string; email: string; message: string };

// insert-only for everyone (contact-messages SQL): the form can send, never read back
export async function sendContactMessage(
  message: ContactMessage
): Promise<string | null> {
  const { error } = await supabase.from('contact_messages').insert(message);
  if (error) console.error(error);
  return error
    ? 'Your message couldn’t be sent. Try again, or email us.'
    : null;
}
