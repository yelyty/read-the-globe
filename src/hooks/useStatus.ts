import { createContext, useContext, type ReactNode } from 'react';

export type Status = {
  text: string;
  /** Undo, See it…: pressing it hides the line, then runs */
  action?: { label: string; icon: ReactNode; run: () => void | Promise<void> };
};

export const StatusContext = createContext<((status: Status) => void) | null>(
  null
);

export function useStatus() {
  const show = useContext(StatusContext);
  if (!show) throw new Error('useStatus must be used within StatusBar');
  return { show };
}
