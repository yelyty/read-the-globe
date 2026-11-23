import { createContext, useContext } from 'react';

// what a custom control (Suggest, a textarea) needs to stand in for the field's <input>
export type FieldInputProps = {
  id: string;
  className: string;
  'aria-invalid': true | undefined;
  'aria-required': true | undefined;
  'aria-describedby': string | undefined;
};

export const FieldControlContext = createContext<FieldInputProps | null>(null);

/**
 * Gets the props of the Field that a custom control is in, or null outside a Field.
 */
export const useFieldControl = () => useContext(FieldControlContext);

/**
 * Joins class names with spaces, and skips the empty ones. If all are empty, the result is undefined.
 */
export const joinClass = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ') || undefined;
