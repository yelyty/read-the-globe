import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { MapPinIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useReveal } from "../../../hooks/useReveal";
import Field from "../../../components/Field/Field";
import { supabase } from "../../../utils/supabase";
import AtlasPlate from "./AtlasPlate";
import * as s from "./SignUp.css";
import { reveal } from "../Goals/Goals.css";

// TODO: move to utils
const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

const passwordStrength = (password: string): 0 | 1 | 2 | 3 | 4 => {
  if (password.length < 8) return 0;
  let score = 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
};

type Values = { name: string; email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;

const FIELD_ORDER: (keyof Values)[] = ["name", "email", "password"];

const validate = (values: Values): Errors => {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Tell us what to call you.";
  if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
  if (values.password.length < 8)
    errors.password = "Use at least 8 characters.";
  return errors;
};

type StartSectionProps = {
  onLogIn: () => void;
};

const StartSection = ({ onLogIn }: StartSectionProps) => {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cardRef, cardRevealed] = useReveal<HTMLFormElement>();

  const errors = submitted ? validate(values) : {};
  const strength = passwordStrength(values.password);

  const update =
    (key: keyof Values) => (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    const firstInvalid = FIELD_ORDER.find((key) => found[key]);
    if (firstInvalid) {
      document.getElementById(`su-${firstInvalid}`)?.focus();
      return;
    }

    setPending(true);
    setFormError(null);
    setNotice(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: { data: { display_name: values.name.trim() } },
      });
      if (error) {
        const taken =
          error.code === "user_already_exists" || error.code === "email_exists";
        setFormError(
          taken
            ? "That email already has an atlas. Try logging in instead."
            : "Something went wrong. Please try again.",
        );
      } else if (!data.session) {
        setNotice("Check your inbox. We sent a link to confirm your email.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section id="start" className={s.start}>
      <div className={s.startAtlas} aria-hidden="true">
        <AtlasPlate landClassName={s.startLand} />
      </div>

      <div className={s.startGrid}>
        <h2 className={s.startTitle} id="su-title">
          Pin the last book you loved.
        </h2>
        <p className={s.startSub}>
          Log it, list where it takes you, and watch the first country fill in.
        </p>

        <form
          ref={cardRef}
          className={`${s.signupCard} ${reveal}`}
          data-revealed={cardRevealed}
          aria-labelledby="su-title"
          onSubmit={submit}
          noValidate
        >
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

          <Field
            id="su-name"
            label="Display name"
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder="What should we call you…"
            required
            value={values.name}
            onChange={update("name")}
            error={errors.name}
          />
          <Field
            id="su-email"
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
            id="su-password"
            label="Password"
            password
            name="new-password"
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            required
            aria-describedby="su-strength"
            value={values.password}
            onChange={update("password")}
            error={errors.password}
          >
            <div id="su-strength" aria-live="polite">
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
          </Field>

          <button
            type="submit"
            className={`${s.btnPrimary} ${s.btnBlock}`}
            disabled={pending}
          >
            <MapPinIcon weight="fill" aria-hidden="true" />
            {pending ? "One moment…" : "Create your atlas"}
          </button>
          <p className={s.signupNote}>Free to begin, and no card needed.</p>
          <p className={s.altAction}>
            Already charting?{" "}
            <button type="button" className={s.altLink} onClick={onLogIn}>
              Log in
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default StartSection;
