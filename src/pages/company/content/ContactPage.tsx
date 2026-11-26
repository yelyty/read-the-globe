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
import PublicLayout from '../../../layout/PublicLayout/PublicLayout';
import * as styles from '../../../layout/PublicLayout/PublicLayout.css';
import { btnPrimary } from '../../landing/features/LoginDialog/LoginDialog.css';
import { validate } from '../utils/validateContact';

const FIELD_ORDER: (keyof ContactMessage)[] = ['name', 'email', 'message'];

const GITHUB_ISSUES = 'https://github.com/yelyty/read-the-globe/issues';
const BUG_REPORT_URL = `${GITHUB_ISSUES}/new?labels=bug`;
const FEATURE_REQUEST_URL = `${GITHUB_ISSUES}/new?labels=enhancement`;

/**
 * Shows the Contact page, with a form to send a message. The form checks the fields when it is sent.
 */
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
    <PublicLayout
      title="Contact"
      description="A question, a bug, a book we should suggest? Write to Read The Globe."
      draft
    >
      <h1>Write to us</h1>
      <p className={styles.lede}>
        A question, a bug, a book we should suggest? Send it with the form
        below, or open an issue on GitHub.
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
            required
            label={m.contact_name()}
            autoComplete="name"
            maxLength={80}
            value={values.name}
            onChange={update('name')}
            error={errors.name}
          />
          <Field
            id="c-email"
            required
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
            required
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
      <h2>Bugs and ideas on GitHub</h2>
      <p>
        Read The Globe is built in the open. If you have a GitHub account, you
        can open an issue there and follow along as it gets fixed or built.
      </p>
      <ul>
        <li>
          <a href={BUG_REPORT_URL}>Report a bug</a>: what you did, what you
          expected, and what happened instead.
        </li>
        <li>
          <a href={FEATURE_REQUEST_URL}>Suggest a feature</a>: what you’d like
          to do and why it would help.
        </li>
        <li>
          <a href={GITHUB_ISSUES}>Browse open issues</a> to see what’s already
          reported or planned.
        </li>
      </ul>
    </PublicLayout>
  );
};

export default ContactPage;
