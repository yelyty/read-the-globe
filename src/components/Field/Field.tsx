import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as s from "./Field.css";

type FieldProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "id" | "className" | "children"
> & {
  id: string;
  label: string;
  /** shown under the input once the form has been submitted */
  error?: string;
  /** adds a Show/Hide toggle */
  password?: boolean;
  /** rendered between the input and the error, e.g. a strength meter */
  children?: ReactNode;
};

const Field = ({
  id,
  label,
  error,
  password = false,
  children,
  ...inputProps
}: FieldProps) => {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-err`;
  const describedBy =
    [error ? errorId : null, inputProps["aria-describedby"]]
      .filter(Boolean)
      .join(" ") || undefined;

  const input = (
    <input
      {...inputProps}
      id={id}
      className={password ? `${s.input} ${s.inputPassword}` : s.input}
      type={password ? (visible ? "text" : "password") : inputProps.type}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
    />
  );

  return (
    <div className={s.field} data-invalid={Boolean(error)}>
      <label htmlFor={id} className={s.fieldLabel}>
        {label}
      </label>
      {password ? (
        <div className={s.pwWrap}>
          {input}
          <button
            type="button"
            className={s.pwToggle}
            aria-controls={id}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      ) : (
        input
      )}
      {children}
      {error && (
        <div id={errorId} className={s.fieldError}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Field;
