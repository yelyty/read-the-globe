import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { WarningCircleIcon } from '@phosphor-icons/react';
import CompanyPage from '../CompanyPage';
import Field from '../../../components/Field/Field';
import * as f from '../../../components/Field/Field.css';
import { btnPrimary } from '../../LandingPage/components/LoginDialog/LoginDialog.css';
import { isEmail } from '../../../auth/forms';
import {
  sendContactMessage,
  type ContactMessage,
} from '../../../api/contact/contact';
import * as s from '../CompanyPage.css';
import { m } from '../../../paraglide/messages.js';
import { getLocale } from '../../../paraglide/runtime.js';

type Errors = Partial<Record<keyof ContactMessage, string>>;
const FIELD_ORDER: (keyof ContactMessage)[] = ['name', 'email', 'message'];

const validate = (values: ContactMessage): Errors => {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = m.auth_name_missing();
  if (!isEmail(values.email)) errors.email = m.contact_email_invalid();
  if (!values.message.trim()) errors.message = m.contact_message_missing();

  return errors;
};

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

  return (
    <CompanyPage
      title="Contact"
      description="A question, a bug, a book we should suggest? Write to Read The Globe."
      draft
    >
      <h1>Write to us</h1>
      <p className={s.lede}>
        A question, a bug, a book we should suggest? Send it here, or email{' '}
        <a href="mailto:hello@readtheglobe.app">hello@readtheglobe.app</a>.
      </p>
      {sent ? (
        <p
          className={s.sent}
          role="status"
          tabIndex={-1}
          ref={sentRef}
          lang={getLocale()}
        >
          {m.contact_sent()}
        </p>
      ) : (
        <form
          className={s.form}
          onSubmit={submit}
          noValidate
          lang={getLocale()}
        >
          {formError && (
            <p className={f.formError} role="alert">
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
          <div className={f.field} data-invalid={Boolean(errors.message)}>
            <label htmlFor="c-message" className={f.fieldLabel}>
              {m.contact_message()}
            </label>
            <textarea
              id="c-message"
              className={`${f.input} ${s.textarea}`}
              maxLength={4000}
              value={values.message}
              onChange={update('message')}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'c-message-err' : undefined}
            />
            {errors.message && (
              <div id="c-message-err" className={f.fieldError}>
                {errors.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`${btnPrimary} ${s.send}`}
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
