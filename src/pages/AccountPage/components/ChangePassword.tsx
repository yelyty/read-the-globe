import { useState, type SubmitEvent } from "react";
import { LockKeyIcon } from "@phosphor-icons/react";
import Block from "./Block";
import Field from "../../../components/Field/Field";
import { changePassword } from "../../../auth/session";
import * as s from "../AccountPage.css";

type Errors = { first?: string; second?: string };

const validate = (first: string, second: string): Errors => {
  if (first.length < 8)
    return {
      first: first
        ? "Your new password needs at least 8 characters."
        : "Type a new password.",
    };
  if (second !== first)
    return {
      second: second
        ? "The two passwords don’t match. Type the same one twice."
        : "Repeat the new password to confirm it.",
    };
  return {};
};

// a new password, typed twice
const ChangePassword = ({ email }: { email: string }) => {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    const found = validate(first, second);
    setErrors(found);
    if (found.first || found.second) {
      document.getElementById(found.first ? "ac-pass1" : "ac-pass2")?.focus();
      return;
    }
    setSaving(true);
    const problem = await changePassword(first);
    setSaving(false);
    if (problem) {
      setErrors({ first: problem });
      return;
    }
    setFirst("");
    setSecond("");
    setStatus("Password changed.");
  };

  return (
    <Block title="Change password">
      <form className={s.form} onSubmit={submit} noValidate>
        {/* lets a password manager file the new password under the right account */}
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
          onChange={(event) => {
            setFirst(event.target.value);
            setErrors({});
          }}
        >
          <p className={s.hint} id="ac-pass1-hint">
            At least 8 characters.
          </p>
        </Field>
        <Field
          id="ac-pass2"
          label="Repeat new password"
          password
          autoComplete="new-password"
          value={second}
          error={errors.second}
          onChange={(event) => {
            setSecond(event.target.value);
            setErrors({});
          }}
        />
        <div className={s.row}>
          <button type="submit" className={s.primary} disabled={saving}>
            <LockKeyIcon aria-hidden="true" />
            Change password
          </button>
          <p className={s.status} role="status">
            {status}
          </p>
        </div>
      </form>
    </Block>
  );
};

export default ChangePassword;
