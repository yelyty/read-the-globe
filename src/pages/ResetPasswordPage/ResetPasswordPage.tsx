import { useState, type SubmitEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { PushPinIcon, WarningCircleIcon } from '@phosphor-icons/react';
import CompanyPage from '../CompanyPage/CompanyPage';
import Field from '../../components/Field/Field';
import PasswordStrength from '../LandingPage/components/LoginDialog/PasswordStrength';
import { btnPrimary } from '../LandingPage/components/LoginDialog/LoginDialog.css';
import { formError, formNotice } from '../../components/Field/Field.css';
import { useAuth } from '../../auth/auth-context';
import { changePassword } from '../../auth/session';
import { newPasswordProblem } from '../../auth/forms';
import * as s from '../CompanyPage/CompanyPage.css';
import { m } from '../../paraglide/messages.js';

// Where the "Forgot your password?" email lands: Supabase signs the reader in from the link, then they pick a new one.
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

  return (
    <CompanyPage
      title={m.reset_title()}
      description={m.reset_description()}
      translated
    >
      <h1>{m.reset_title()}</h1>
      {!isAuthenticated ? (
        <p className={s.lede}>{m.reset_expired()}</p>
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
        <form className={s.form} onSubmit={submit} noValidate>
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
            onChange={(event) => setPassword(event.target.value)}
            error={error}
          >
            <PasswordStrength id="rp-strength" password={password} />
          </Field>
          <button
            type="submit"
            className={`${btnPrimary} ${s.send}`}
            disabled={pending}
          >
            {pending ? m.auth_pending() : m.reset_save()}
          </button>
        </form>
      )}
    </CompanyPage>
  );
};

export default ResetPasswordPage;
