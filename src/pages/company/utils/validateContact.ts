import { isEmail } from '../../../auth/forms';
import { type ContactMessage } from '../../../api/contact/contact';
import { m } from '../../../paraglide/messages.js';

export type Errors = Partial<Record<keyof ContactMessage, string>>;

/**
 * Checks the fields of the Contact form: a name, an email address, and a message.
 * @returns An empty object if all fields are correct. If not, the error message for each incorrect field.
 */
export const validate = (values: ContactMessage): Errors => {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = m.auth_name_missing();
  if (!isEmail(values.email)) errors.email = m.contact_email_invalid();
  if (!values.message.trim()) errors.message = m.contact_message_missing();

  return errors;
};
