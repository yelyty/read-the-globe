import { describe, expect, it } from 'vitest';

import { m } from '../../../paraglide/messages.js';
import { validate } from './validateContact';

const message = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hello',
};

describe('validate', () => {
  it('passes a filled-in message', () => {
    expect(validate(message)).toEqual({});
  });

  it('asks for every field that is missing', () => {
    expect(validate({ name: ' ', email: '', message: '\n' })).toEqual({
      name: m.auth_name_missing(),
      email: m.contact_email_invalid(),
      message: m.contact_message_missing(),
    });
  });

  it('turns down an address that isn’t one', () => {
    expect(validate({ ...message, email: 'ada@' })).toEqual({
      email: m.contact_email_invalid(),
    });
  });
});
