import { useState } from 'react';

import { sendPasswordReset, signIn, signUp } from '../../../../auth/session';
import { m } from '../../../../paraglide/messages.js';
import type { AuthMode, Values } from './validate';

/** Sends the form to the account service: a reset link, a log in, or a sign up, and says how it went. A session,
    if there is one afterwards, takes the reader to /app from the page. */
export const useAuthSubmit = () => {
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const clearMessages = () => {
    setFormError(null);
    setNotice(null);
  };

  const send = async (view: AuthMode, values: Values, example: boolean) => {
    setPending(true);
    clearMessages();
    const email = values.email.trim();

    if (view === 'reset') {
      const problem = await sendPasswordReset(email);

      if (problem) setFormError(problem);
      else setNotice(m.auth_reset_sent({ email }));
    } else if (view === 'login') {
      const problem = await signIn(email, values.password);

      if (problem)
        setFormError(
          problem === 'wrong-credentials'
            ? m.auth_wrong_credentials()
            : m.common_try_again()
        );
    } else {
      const { problem, confirmEmail } = await signUp({
        email,
        password: values.password,
        name: values.name.trim(),
        example,
      });

      if (problem)
        setFormError(
          problem === 'email-taken'
            ? m.auth_email_taken()
            : m.common_try_again()
        );
      else if (confirmEmail) setNotice(m.auth_confirm_email({ email }));
    }

    setPending(false);
  };

  return { pending, formError, notice, clearMessages, send };
};
