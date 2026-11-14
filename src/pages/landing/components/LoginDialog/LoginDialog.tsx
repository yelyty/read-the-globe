import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { PushPinIcon, WarningCircleIcon } from '@phosphor-icons/react';

import Dialog from '../../../../components/Dialog/Dialog';
import Field from '../../../../components/Field/Field';
import { sendPasswordReset, signIn, signUp } from '../../../../auth/session';
import { m } from '../../../../paraglide/messages.js';
import * as styles from './LoginDialog.css';
import PasswordStrength from './PasswordStrength';
import { type AuthMode, type Values, validate } from './validate';

const COPY = {
  signup: {
    title: m.landing_start,
    sub: m.auth_signup_sub,
    go: m.auth_signup_go,
  },
  login: {
    title: m.auth_login_title,
    sub: m.auth_login_sub,
    go: m.landing_log_in,
  },
  reset: {
    title: m.auth_reset_title,
    sub: m.auth_reset_sub,
    go: m.auth_reset_go,
  },
};

const FIELD_ORDER: (keyof Values)[] = ['name', 'email', 'password'];

type LoginDialogProps = {
  /** null keeps the dialog closed */
  mode: AuthMode | null;
  onMode: (mode: AuthMode) => void;
  onClose: () => void;
};

const LoginDialog = ({ mode, onMode, onClose }: LoginDialogProps) => {
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    password: '',
  });

  const [example, setExample] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // the first field takes focus as the dialog opens, and again when it switches between sign up, log in and reset
  useEffect(() => {
    if (mode)
      document
        .getElementById(mode === 'signup' ? 'au-name' : 'au-email')
        ?.focus();
  }, [mode]);

  const view = mode ?? 'login';
  const errors = submitted ? validate(view, values) : {};

  const clearMessages = () => {
    setSubmitted(false);
    setFormError(null);
    setNotice(null);
  };

  const switchTo = (next: AuthMode) => {
    clearMessages();
    onMode(next);
  };

  const close = () => {
    clearMessages();
    onClose();
  };

  const update =
    (key: keyof Values) => (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(view, values);
    const firstInvalid = FIELD_ORDER.find((key) => found[key]);

    if (firstInvalid) {
      document.getElementById(`au-${firstInvalid}`)?.focus();

      return;
    }

    setPending(true);
    setFormError(null);
    setNotice(null);
    const email = values.email.trim();

    if (view === 'reset') {
      if (await sendPasswordReset(email))
        setNotice(m.auth_reset_sent({ email }));
      else setFormError(m.common_try_again());
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

    // a session, if there is one now, takes the reader to /app from the page
    setPending(false);
  };

  const handleExampleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setExample(event.target.checked);

  // sign up ⇄ log in, and log in ⇄ reset the password
  const handleSwitchAccount = () =>
    switchTo(view === 'signup' ? 'login' : 'signup');

  const handleSwitchReset = () =>
    switchTo(view === 'login' ? 'reset' : 'login');

  return (
    <Dialog
      open={mode !== null}
      onClose={close}
      variant="hero"
      title={COPY[view].title()}
      sub={<p className={styles.dialogSub}>{COPY[view].sub()}</p>}
    >
      <form onSubmit={submit} noValidate>
        {formError && (
          <p className={styles.formError} role="alert">
            <WarningCircleIcon aria-hidden="true" />
            <span>{formError}</span>
          </p>
        )}
        {notice && (
          <p className={styles.formNotice} role="status">
            {notice}
          </p>
        )}

        {view === 'signup' && (
          <Field
            id="au-name"
            label={m.auth_name_label()}
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder={m.auth_name_placeholder()}
            required
            value={values.name}
            onChange={update('name')}
            error={errors.name}
          />
        )}
        <Field
          id="au-email"
          label={m.auth_email_label()}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={values.email}
          onChange={update('email')}
          error={errors.email}
        />
        {view !== 'reset' && (
          <Field
            id="au-password"
            label={m.auth_password_label()}
            password
            name={view === 'signup' ? 'new-password' : 'current-password'}
            autoComplete={
              view === 'signup' ? 'new-password' : 'current-password'
            }
            placeholder={
              view === 'signup'
                ? m.auth_password_new_placeholder()
                : m.auth_password_placeholder()
            }
            required
            aria-describedby={view === 'signup' ? 'au-strength' : undefined}
            value={values.password}
            onChange={update('password')}
            error={errors.password}
          >
            {view === 'signup' && (
              <PasswordStrength id="au-strength" password={values.password} />
            )}
          </Field>
        )}
        {view === 'signup' && (
          <label className={styles.example}>
            <input
              type="checkbox"
              checked={example}
              onChange={handleExampleChange}
            />
            {m.auth_example()}
            <span className={styles.exampleHint}>{m.auth_example_hint()}</span>
          </label>
        )}

        <button
          type="submit"
          className={`${styles.btnPrimary} ${styles.btnBlock}`}
          disabled={pending}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          {pending ? m.auth_pending() : COPY[view].go()}
        </button>
        <div className={styles.links}>
          <p className={styles.altAction}>
            {view === 'signup' ? m.auth_have_account() : m.auth_new_here()}{' '}
            <button
              type="button"
              className={styles.altLink}
              onClick={handleSwitchAccount}
            >
              {view === 'signup' ? m.landing_log_in() : m.auth_create_account()}
            </button>
          </p>
          {view !== 'signup' && (
            <p className={styles.altAction}>
              <button
                type="button"
                className={styles.altLink}
                onClick={handleSwitchReset}
              >
                {view === 'login' ? m.auth_forgot() : m.auth_back_to_login()}
              </button>
            </p>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
