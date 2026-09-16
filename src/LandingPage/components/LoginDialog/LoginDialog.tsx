import { useEffect, useRef, useState, type FormEvent } from "react";
import { WarningCircleIcon, XIcon } from "@phosphor-icons/react";

import * as s from "./LoginDialog.css";
import Field from "../../../components/Field/Field";
import { supabase } from "../../../utils/supabase";

const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

type Errors = { email?: string; password?: string };

const validate = (email: string, password: string): Errors => ({
  email: isEmail(email) ? undefined : "Enter a valid email address.",
  password: password ? undefined : "Enter your password.",
});

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
};

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.getElementById("li-email")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const errors = submitted ? validate(email, password) : {};

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(email, password);
    if (found.email || found.password) {
      document
        .getElementById(found.email ? "li-email" : "li-password")
        ?.focus();
      return;
    }

    setPending(true);
    setFormError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setFormError(
          error.code === "invalid_credentials"
            ? "That email and password don’t match."
            : "Something went wrong. Please try again.",
        );
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={s.dialog}
      aria-labelledby="li-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className={s.dialogForm} onSubmit={submit} noValidate>
        <div className={s.dialogHead}>
          <div>
            <h2 className={s.dialogTitle} id="li-title">
              Welcome back
            </h2>
            <p className={s.dialogSub}>Pick up where your map left off.</p>
          </div>
          <button
            type="button"
            className={s.closeBtn}
            onClick={onClose}
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

        <Field
          id="li-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <Field
          id="li-password"
          label="Password"
          password
          name="current-password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <button
          type="submit"
          className={`${s.btnPrimary} ${s.btnBlock}`}
          disabled={pending}
        >
          {pending ? "One moment…" : "Log in"}
        </button>
        <p className={s.altAction}>
          New here?{" "}
          <a href="#start" className={s.altLink} onClick={onClose}>
            Create an account
          </a>
        </p>
      </form>
    </dialog>
  );
};

export default LoginDialog;
