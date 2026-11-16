import { PushPinIcon, WarningCircleIcon } from '@phosphor-icons/react';

import Dialog from '../../../../components/Dialog/Dialog';
import Field from '../../../../components/Field/Field';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import { m } from '../../../../paraglide/messages.js';
import * as styles from './LoginDialog.css';
import PasswordStrength from './PasswordStrength';
import { useAuthForm } from './useAuthForm';
import type { AuthMode } from './validate';

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

type LoginDialogProps = {
  /** null keeps the dialog closed */
  mode: AuthMode | null;
  onMode: (mode: AuthMode) => void;
  onClose: () => void;
};

const LoginDialog = ({ mode, onMode, onClose }: LoginDialogProps) => {
  const {
    view,
    values,
    errors,
    example,
    pending,
    formError,
    notice,
    update,
    close,
    submit,
    handleExampleChange,
    handleSwitchAccount,
    handleSwitchReset,
  } = useAuthForm({ mode, onMode, onClose });

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
            <Checkbox checked={example} onChange={handleExampleChange} />
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
