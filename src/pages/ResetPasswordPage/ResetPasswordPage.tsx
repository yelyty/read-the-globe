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
      title="Choose a new password"
      description="Choose a new password for your Read The Globe atlas."
    >
      <h1>Choose a new password</h1>
      {!isAuthenticated ? (
        <p className={s.lede}>
          This link has expired or was already used. Ask for a new one: Log in,
          then “Forgot your password?”.
        </p>
      ) : done ? (
        <>
          <p className={formNotice} role="status">
            Your password is changed.
          </p>
          <Link to="/app" className={btnPrimary}>
            <PushPinIcon weight="fill" aria-hidden="true" />
            Open your atlas
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
            label="New password"
            password
            name="new-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
            {pending ? 'One moment…' : 'Save the new password'}
          </button>
        </form>
      )}
    </CompanyPage>
  );
};

export default ResetPasswordPage;
