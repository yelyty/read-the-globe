import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { WarningCircleIcon } from '@phosphor-icons/react';

import Field from '../../../components/Field/Field';
import FieldTextarea from '../../../components/Field/FieldTextarea';
import * as fieldStyles from '../../../components/Field/Field.css';
import {
  sendContactMessage,
  type ContactMessage,
} from '../../../api/contact/contact';
import { m } from '../../../paraglide/messages.js';
import { getLocale } from '../../../paraglide/runtime.js';
import { useDirty, useLeaveGuard } from '../../../hooks/useUnsaved';
import { btnPrimary } from '../../landing/features/LoginDialog/LoginDialog.css';
import CompanyPage from '../CompanyPage';
import * as styles from '../CompanyPage.css';
import { validate } from '../utils/validateContact';

const FIELD_ORDER: (keyof ContactMessage)[] = ['name', 'email', 'message'];

const ContactPage = () => {
  const [values, setValues] = useState<ContactMessage>({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const errors = submitted ? validate(values) : {};
  const dirty = useDirty(values);

  // a sent message is safe; one still being written isn't
  useLeaveGuard(dirty && !sent);

  const update =
    (key: keyof ContactMessage) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((key) => validate(values)[key]);

    if (firstInvalid) {
      document.getElementById(`c-${firstInvalid}`)?.focus();

      return;
    }

    setPending(true);

    const problem = await sendContactMessage({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });

    setPending(false);
    setFormError(problem);

    if (!problem) {
      setSent(true);
      requestAnimationFrame(() => sentRef.current?.focus());
    }
  };

  const handleMessageChange = update('message');

  const messageControl = (
    <FieldTextarea
      className={styles.textarea}
      maxLength={4000}
      value={values.message}
      onChange={handleMessageChange}
    />
  );

  return (
    <CompanyPage
      title="Contact"
      description="A question, a bug, a book we should suggest? Write to Read The Globe."
      draft
    >
      <h1>Write to us</h1>
      <p className={styles.lede}>
        A question, a bug, a book we should suggest? Send it here, or email{' '}
        <a href="mailto:hello@readtheglobe.app">hello@readtheglobe.app</a>.
      </p>
      {sent ? (
        <p
          className={styles.sent}
          role="status"
          tabIndex={-1}
          ref={sentRef}
          lang={getLocale()}
        >
          {m.contact_sent()}
        </p>
      ) : (
        <form
          className={styles.form}
          onSubmit={submit}
          noValidate
          lang={getLocale()}
        >
          {formError && (
            <p className={fieldStyles.formError} role="alert">
              <WarningCircleIcon aria-hidden="true" />
              <span>{formError}</span>
            </p>
          )}
          <Field
            id="c-name"
            label={m.contact_name()}
            autoComplete="name"
            maxLength={80}
            value={values.name}
            onChange={update('name')}
            error={errors.name}
          />
          <Field
            id="c-email"
            label={m.auth_email_label()}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            error={errors.email}
          />
          <Field
            id="c-message"
            label={m.contact_message()}
            error={errors.message}
            control={messageControl}
          />
          <button
            type="submit"
            className={`${btnPrimary} ${styles.send}`}
            disabled={pending}
          >
            {pending ? m.auth_pending() : m.contact_send()}
          </button>
        </form>
      )}
    </CompanyPage>
  );
};

export default ContactPage;
