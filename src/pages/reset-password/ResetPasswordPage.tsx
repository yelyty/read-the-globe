import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { PushPinIcon, WarningCircleIcon } from '@phosphor-icons/react';

import Field from '../../components/Field/Field';
import { formError, formNotice } from '../../components/Field/Field.css';
import { useAuth } from '../../auth/auth-context';
import { changePassword } from '../../auth/session';
import { newPasswordProblem } from '../../auth/forms';
import { m } from '../../paraglide/messages.js';
import PublicLayout from '../../layout/PublicLayout/PublicLayout';
import * as styles from '../../layout/PublicLayout/PublicLayout.css';
import PasswordStrength from '../landing/features/LoginDialog/PasswordStrength';
import { btnPrimary } from '../landing/features/LoginDialog/LoginDialog.css';

/**
 * Shows the page that the reset password email links to. Supabase signs the reader in from the link, and then the reader picks a new password.
 */
const ResetPasswordPage = () => {
  const { isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const error = submitted
    ? (newPasswordProblem(password) ?? undefined)
    : undefined;

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (newPasswordProblem(password)) {
      document.getElementById('rp-password')?.focus();

      return;
    }

    setPending(true);
    const failed = await changePassword(password);

    setPending(false);
    setProblem(failed);
    setDone(!failed);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  return (
    <PublicLayout
      title={m.reset_title()}
      description={m.reset_description()}
      translated
    >
      <h1>{m.reset_title()}</h1>
      {!isAuthenticated ? (
        <p className={styles.lede}>{m.reset_expired()}</p>
      ) : done ? (
        <>
          <p className={formNotice} role="status">
            {m.reset_done()}
          </p>
          <Link to="/app" className={btnPrimary}>
            <PushPinIcon weight="fill" aria-hidden="true" />
            {m.reset_open_atlas()}
          </Link>
        </>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          {problem && (
            <p className={formError} role="alert">
              <WarningCircleIcon aria-hidden="true" />
              <span>{problem}</span>
            </p>
          )}
          <Field
            id="rp-password"
            label={m.reset_new_password()}
            password
            name="new-password"
            autoComplete="new-password"
            placeholder={m.auth_password_new_placeholder()}
            aria-describedby="rp-strength"
            value={password}
            onChange={handlePasswordChange}
            error={error}
          >
            <PasswordStrength id="rp-strength" password={password} />
          </Field>
          <button
            type="submit"
            className={`${btnPrimary} ${styles.send}`}
            disabled={pending}
          >
            {pending ? m.auth_pending() : m.reset_save()}
          </button>
        </form>
      )}
    </PublicLayout>
  );
};

export default ResetPasswordPage;
