import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react';

import { useAuthSubmit } from './useAuthSubmit';
import { type AuthMode, type Values, validate } from './validate';

const FIELD_ORDER: (keyof Values)[] = ['name', 'email', 'password'];

type AuthForm = {
  /** null keeps the dialog closed */
  mode: AuthMode | null;
  onMode: (mode: AuthMode) => void;
  onClose: () => void;
};

/** The sign up / log in / reset form: its fields, checked once it's been submitted, and moving between the three. */
export function useAuthForm({ mode, onMode, onClose }: AuthForm) {
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    password: '',
  });

  const [example, setExample] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { pending, formError, notice, clearMessages, send } = useAuthSubmit();

  // the first field takes focus as the dialog opens, and again when it switches between sign up, log in and reset
  useEffect(() => {
    if (mode)
      document
        .getElementById(mode === 'signup' ? 'au-name' : 'au-email')
        ?.focus();
  }, [mode]);

  const view = mode ?? 'login';
  const errors = submitted ? validate(view, values) : {};

  const reset = () => {
    setSubmitted(false);
    clearMessages();
  };

  const switchTo = (next: AuthMode) => {
    reset();
    onMode(next);
  };

  const close = () => {
    reset();
    onClose();
  };

  const update =
    (key: keyof Values) => (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  // the first field with an error takes focus; with none, the form goes
  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(view, values);
    const firstInvalid = FIELD_ORDER.find((key) => found[key]);

    if (firstInvalid) {
      document.getElementById(`au-${firstInvalid}`)?.focus();

      return;
    }

    await send(view, values, example);
  };

  const handleExampleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setExample(event.target.checked);

  // sign up ⇄ log in, and log in ⇄ reset the password
  const handleSwitchAccount = () =>
    switchTo(view === 'signup' ? 'login' : 'signup');

  const handleSwitchReset = () =>
    switchTo(view === 'login' ? 'reset' : 'login');

  return {
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
  };
}
