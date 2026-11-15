/* How the data modules answer, so a caller learns it once:
   - a load returns what it read, or throws, and the route shows its error view;
   - a change returns a Problem: what went wrong, in the reader's words, or null when it went through;
   - a change that makes something (a saved book's id, a new next read) returns Made: it, or the Problem.
   Exceptions, on purpose: the Shelf's next reads and the Postcard's profile load quietly to empty, so one part of a
   page can fail without the whole page; signing in and up answer with a code the form turns into a field's message. */

/** what went wrong with a change, in the reader's words; null when it went through */
export type Problem = string | null;

/** a change that makes something: what it made, or what went wrong */
export type Made<T> =
  { problem: null; data: T } | { problem: string; data?: undefined };

export const made = <T>(data: T): Made<T> => ({ problem: null, data });

export const failed = (problem: string): Made<never> => ({ problem });
