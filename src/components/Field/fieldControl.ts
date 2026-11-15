import { createContext, useContext } from 'react';

// what a custom control (Suggest, a textarea) needs to stand in for the field's <input>
export type FieldInputProps = {
  id: string;
  className: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
};

export const FieldControlContext = createContext<FieldInputProps | null>(null);

// the props of the Field this control sits in, or null outside one
export const useFieldControl = () => useContext(FieldControlContext);

// a control's own class after the field's
export const joinClass = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ') || undefined;
