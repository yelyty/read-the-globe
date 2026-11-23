import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { CheckIcon } from '@phosphor-icons/react';

import Field from '../../../../components/Field/Field';
import { updateDisplayName, type Reader } from '../../../../auth/session';
import Hint from '../../../../components/Hint/Hint';
import Button from '../../../../components/Button/Button';
import { m } from '../../../../paraglide/messages.js';
import StatusLine from '../../../../components/StatusLine/StatusLine';
import * as styles from '../../AccountPage.css';
import AccountSection from '../../components/AccountSection';

type UserDetailsProps = {
  user: Reader;
};

/**
 * Shows the Details section, where the reader can change the display name.
 * If the name is empty, the form shows an error. After a save, a status line shows the result.
 */
const UserDetails = ({ user }: UserDetailsProps) => {
  const [name, setName] = useState(user.signUpName ?? '');
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');

    if (!name.trim()) {
      setError(m.account_name_missing());
      document.getElementById('ac-name')?.focus();

      return;
    }

    setSaving(true);

    const problem = await updateDisplayName(name.trim());

    setSaving(false);
    setError(problem ?? undefined);
    if (problem) document.getElementById('ac-name')?.focus();
    else setStatus(m.account_saved());
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError(undefined);
    setStatus('');
  };

  return (
    <AccountSection title={m.account_details_title()}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <Field
          id="ac-name"
          required
          label={m.account_name_label()}
          autoComplete="name"
          maxLength={80}
          value={name}
          error={error}
          onChange={onNameChange}
        />
        <Field
          readOnly
          id="ac-email"
          label={m.account_email_label()}
          type="email"
          aria-describedby="ac-email-hint"
          value={user.email ?? ''}
        >
          <Hint id="ac-email-hint">{m.account_email_hint()}</Hint>
        </Field>
        <div className={styles.row}>
          <Button
            type="submit"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            <CheckIcon aria-hidden="true" />
            {saving ? m.log_saving() : m.common_save()}
          </Button>
          <StatusLine>{status}</StatusLine>
        </div>
      </form>
    </AccountSection>
  );
};

export default UserDetails;
