import { createContext, useContext } from 'react';
import type { PinMoment } from '../utils/pinMoment';

/* A book just pinned, on its way to Home"s map: Log a book sets it, Home flies the pins and clears it.
   reached: the goal line to say a beat after the pins land, if this book carried a goal over its flag. */
export type Landing = PinMoment & { bookId: string; reached: string | null };

export const LandingContext = createContext<
  [Landing | null, (landing: Landing | null) => void] | null
>(null);

export function useLanding() {
  const landing = useContext(LandingContext);
  if (!landing) throw new Error('useLanding must be used within AppLayout');
  return landing;
}
