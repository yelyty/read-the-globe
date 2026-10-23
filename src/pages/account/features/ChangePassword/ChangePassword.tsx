import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { LockKeyIcon } from '@phosphor-icons/react';
import { changePassword } from '../../../../auth/session';

import Block from '../../components/Block';
import Field from '../../../../components/Field/Field';
import Hint from '../../../../components/Hint/Hint';
import { Button } from '../../../../components/Button/Button';

import * as s from '../../AccountPage.css';
import { validate, type Errors } from './validate';

const ChangePassword = ({ email }: { email: string }) => {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    const found = validate(first, second);
    setErrors(found);
    if (found.first || found.second) {
      document.getElementById(found.first ? 'ac-pass1' : 'ac-pass2')?.focus();
      return;
    }
    setSaving(true);
    const problem = await changePassword(first);
    setSaving(false);
    if (problem) {
      setErrors({ first: problem });
      return;
    }
    setFirst('');
    setSecond('');
    setStatus('Password changed.');
  };

  const onNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirst(event.target.value);
    setErrors({});
  };

  const onRepeatNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecond(event.target.value);
    setErrors({});
  };

  return (
    <Block title="Change password">
      <form className={s.form} onSubmit={submit} noValidate>
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={email}
          readOnly
          hidden
        />
        <Field
          id="ac-pass1"
          label="New password"
          password
          autoComplete="new-password"
          minLength={8}
          aria-describedby="ac-pass1-hint"
          value={first}
          error={errors.first}
          onChange={onNewPasswordChange}
        >
          <Hint id="ac-pass1-hint">At least 8 characters.</Hint>
        </Field>
        <Field
          id="ac-pass2"
          label="Repeat new password"
          password
          autoComplete="new-password"
          value={second}
          error={errors.second}
          onChange={onRepeatNewPasswordChange}
        />
        <div className={s.row}>
          <Button type="submit" disabled={saving}>
            <LockKeyIcon aria-hidden="true" />
            Change password
          </Button>
          <p className={s.status} role="status">
            {status}
          </p>
        </div>
      </form>
    </Block>
  );
};

export default ChangePassword;
