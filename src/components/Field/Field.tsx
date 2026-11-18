import { useState, type ComponentProps, type ReactNode } from 'react';

import { m } from '../../paraglide/messages.js';
import * as styles from './Field.css';
import { FieldControlContext, type FieldInputProps } from './fieldControl';

type FieldProps = Omit<
  ComponentProps<'input'>,
  'id' | 'className' | 'children'
> & {
  id: string;
  label: ReactNode;
  /** shown under the input once the form has been submitted */
  error?: string;
  /** adds a Show/Hide toggle */
  password?: boolean;
  /** the smaller field of an inline form: 40px tall, no space under it */
  compact?: boolean;
  /** for the wrapper, e.g. a grid column */
  className?: string;
  /** another control in place of the <input> (Suggest, FieldTextarea): it reads the field's id and aria
      props from context; the input props above are then unused */
  control?: ReactNode;
  /** rendered between the input and the error, e.g. a strength meter */
  children?: ReactNode;
  /** rendered last, under the error, e.g. a Hint or the picks so far */
  below?: ReactNode;
};

/**
 * Shows a form field: a label, an input, and an error under the input.
 * @param error - The error to show under the input.
 * @param password - If true, the field has a Show/Hide button for the password.
 * @param compact - If true, the field is smaller, for an inline form.
 * @param control - A different control in place of the input, for example Suggest or FieldTextarea.
 * @param below - Content under the error, for example a Hint.
 */
const Field = ({
  id,
  label,
  error,
  password = false,
  compact = false,
  className,
  control,
  children,
  below,
  ...inputProps
}: FieldProps) => {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-err`;

  const describedBy =
    [error ? errorId : null, inputProps['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined;

  const inputClass = [
    styles.input,
    compact && styles.inputCompact,
    password && styles.inputPassword,
  ]
    .filter(Boolean)
    .join(' ');

  const controlProps: FieldInputProps = {
    id,
    className: inputClass,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  };

  const input = control ? (
    <FieldControlContext value={controlProps}>{control}</FieldControlContext>
  ) : (
    <input
      {...inputProps}
      {...controlProps}
      type={password ? (visible ? 'text' : 'password') : inputProps.type}
    />
  );

  const handleToggleVisible = () => setVisible((shown) => !shown);

  const fieldClass = [styles.field, compact && styles.fieldCompact, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClass} data-invalid={Boolean(error)}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
      </label>
      {password ? (
        <div className={styles.pwWrap}>
          {input}
          <button
            type="button"
            className={styles.pwToggle}
            aria-controls={id}
            onClick={handleToggleVisible}
          >
            {visible ? m.field_hide() : m.field_show()}
          </button>
        </div>
      ) : (
        input
      )}
      {children}
      {error && (
        <div id={errorId} className={styles.fieldError}>
          {error}
        </div>
      )}
      {below}
    </div>
  );
};

export default Field;
