import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { CheckIcon } from '@phosphor-icons/react';

import Field from '../../../components/Field/Field';
import { updateDisplayName, type Reader } from '../../../auth/session';
import * as s from '../AccountPage.css';

import Block from '../components/Block';
import Hint from '../../../components/Hint/Hint';
import { Button } from '../../../components/Button/Button';

type UserDetailsProps = {
  user: Reader;
};

const UserDetails = ({ user }: UserDetailsProps) => {
  const [name, setName] = useState(user.signUpName ?? '');
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');

    if (!name.trim()) {
      setError('Add a name to show on your atlas.');
      document.getElementById('ac-name')?.focus();
      return;
    }
    setSaving(true);

    const problem = await updateDisplayName(name.trim());
    setSaving(false);
    setError(problem ?? undefined);
    if (!problem) setStatus('Saved.');
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError(undefined);
    setStatus('');
  };

  return (
    <Block title="Your details">
      <form className={s.form} onSubmit={submit} noValidate>
        <Field
          id="ac-name"
          label="Display name"
          autoComplete="name"
          maxLength={80}
          value={name}
          error={error}
          onChange={onNameChange}
        />
        <Field
          readOnly
          id="ac-email"
          label="Email"
          type="email"
          aria-describedby="ac-email-hint"
          value={user.email ?? ''}
        >
          <Hint id="ac-email-hint">
            The address you sign in with. It can’t be changed here.
          </Hint>
        </Field>
        <div className={s.row}>
          <Button type="submit" disabled={saving}>
            <CheckIcon aria-hidden="true" />
            Save
          </Button>
          <p className={s.status} role="status">
            {status}
          </p>
        </div>
      </form>
    </Block>
  );
};

export default UserDetails;
