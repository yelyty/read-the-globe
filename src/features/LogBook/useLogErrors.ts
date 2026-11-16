import { useState } from 'react';

/** The log form's errors: one per field, a line for the whole form, and the duplicate the reader was warned about. */
export function useLogErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  // the id of the book this one looks like; a second Pin with it set saves anyway
  const [dupOk, setDupOk] = useState('');

  // an error goes as soon as its field is touched
  const fix = (key: string) => {
    if (!errors[key]) return;
    const rest = { ...errors };

    delete rest[key];
    setErrors(rest);
    if (!Object.keys(rest).length) setFormError('');
  };

  // a changed title or author is no longer the duplicate warned about
  const forgetDup = () => {
    if (!dupOk) return;
    setDupOk('');
    setFormError('');
  };

  return {
    errors,
    setErrors,
    formError,
    setFormError,
    dupOk,
    setDupOk,
    fix,
    forgetDup,
  };
}
