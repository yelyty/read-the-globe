import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { PushPinIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";

import * as s from "./LoginDialog.css";
import Field from "../../../../components/Field/Field";
import { signIn, signUp } from "../../../../auth/session";
import {
  isEmail,
  passwordStrength,
  STRENGTH_LABELS,
} from "../../../../auth/forms";

export type AuthMode = "signup" | "login";

const COPY = {
  signup: {
    title: "Start your atlas",
    sub: "Free, and no card. Your first book takes a minute.",
    go: "Create your atlas",
  },
  login: {
    title: "Welcome back",
    sub: "Your atlas is where you left it.",
    go: "Log in",
  },
};

type Values = { name: string; email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;

const FIELD_ORDER: (keyof Values)[] = ["name", "email", "password"];

const validate = (mode: AuthMode, values: Values): Errors => {
  const errors: Errors = {};
  if (mode === "signup" && !values.name.trim())
    errors.name = "Tell us what to call you.";
  if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
  if (mode === "signup" && values.password.length < 8)
    errors.password = "Use at least 8 characters.";
  if (mode === "login" && !values.password)
    errors.password = "Enter your password.";
  return errors;
};

type LoginDialogProps = {
  /** null keeps the dialog closed */
  mode: AuthMode | null;
  onMode: (mode: AuthMode) => void;
  onClose: () => void;
};

const LoginDialog = ({ mode, onMode, onClose }: LoginDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mode && !dialog.open) dialog.showModal();
    if (!mode && dialog.open) dialog.close();
    if (mode)
      document
        .getElementById(mode === "signup" ? "au-name" : "au-email")
        ?.focus();
  }, [mode]);

  const view = mode ?? "login";
  const errors = submitted ? validate(view, values) : {};
  const strength = passwordStrength(values.password);

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
    if (view === "login") {
      const problem = await signIn(email, values.password);
      if (problem)
        setFormError(
          problem === "wrong-credentials"
            ? "That email and password don't match."
            : "Something went wrong. Try again.",
        );
    } else {
      const { problem, confirmEmail } = await signUp({
        email,
        password: values.password,
        name: values.name.trim(),
      });
      if (problem)
        setFormError(
          problem === "email-taken"
            ? "That email already has an atlas. Try logging in instead."
            : "Something went wrong. Try again.",
        );
      else if (confirmEmail)
        setNotice(
          `Check your inbox: we sent a link to ${email} to confirm it.`,
        );
    }
    // a session, if there is one now, takes the reader to /app from the page
    setPending(false);
  };

  return (
    <dialog
      ref={dialogRef}
      className={s.dialog}
      aria-labelledby="au-title"
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <form className={s.dialogForm} onSubmit={submit} noValidate>
        <div className={s.dialogHead}>
          <div>
            <h2 className={s.dialogTitle} id="au-title">
              {COPY[view].title}
            </h2>
            <p className={s.dialogSub}>{COPY[view].sub}</p>
          </div>
          <button
            type="button"
            className={s.closeBtn}
            onClick={close}
            aria-label="Close"
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>

        {formError && (
          <p className={s.formError} role="alert">
            <WarningCircleIcon aria-hidden="true" />
            <span>{formError}</span>
          </p>
        )}
        {notice && (
          <p className={s.formNotice} role="status">
            {notice}
          </p>
        )}

        {view === "signup" && (
          <Field
            id="au-name"
            label="Display name"
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder="What should we call you?"
            required
            value={values.name}
            onChange={update("name")}
            error={errors.name}
          />
        )}
        <Field
          id="au-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={values.email}
          onChange={update("email")}
          error={errors.email}
        />
        <Field
          id="au-password"
          label="Password"
          password
          name={view === "signup" ? "new-password" : "current-password"}
          autoComplete={view === "signup" ? "new-password" : "current-password"}
          placeholder={
            view === "signup" ? "At least 8 characters" : "Your password"
          }
          required
          aria-describedby={view === "signup" ? "au-strength" : undefined}
          value={values.password}
          onChange={update("password")}
          error={errors.password}
        >
          {view === "signup" && (
            <div id="au-strength" aria-live="polite">
              {values.password && (
                <div className={s.strength}>
                  <div className={s.strengthBar} aria-hidden="true">
                    <div
                      className={s.strengthFill[strength]}
                      style={{
                        transform: `scaleX(${Math.max(0.04, strength / 4)})`,
                      }}
                    />
                  </div>
                  <span className={s.strengthLabel}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              )}
            </div>
          )}
        </Field>

        <button
          type="submit"
          className={`${s.btnPrimary} ${s.btnBlock}`}
          disabled={pending}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          {pending ? "One moment…" : COPY[view].go}
        </button>
        <p className={s.altAction}>
          {view === "signup" ? "Already reading with us? " : "New here? "}
          <button
            type="button"
            className={s.altLink}
            onClick={() => switchTo(view === "signup" ? "login" : "signup")}
          >
            {view === "signup" ? "Log in" : "Create an account"}
          </button>
        </p>
      </form>
    </dialog>
  );
};

export default LoginDialog;
