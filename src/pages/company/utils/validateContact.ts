import { isEmail } from '../../../auth/forms';
import { type ContactMessage } from '../../../api/contact/contact';
import { m } from '../../../paraglide/messages.js';

export type Errors = Partial<Record<keyof ContactMessage, string>>;

export const validate = (values: ContactMessage): Errors => {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = m.auth_name_missing();
  if (!isEmail(values.email)) errors.email = m.contact_email_invalid();
  if (!values.message.trim()) errors.message = m.contact_message_missing();

  return errors;
};
