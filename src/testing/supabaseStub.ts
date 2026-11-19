/* Supabase stood in for the data modules' tests. Every call is written down in `calls` as [step, ...its arguments],
   and each one answers with `answers[target]` (a table, an rpc or an auth method by name), else `answer`.
   Use it with: vi.mock('<path>/utils/supabase', () => import('<path>/testing/supabaseStub')) */

type Answer = {
  data: unknown;
  error: { message: string; code?: string } | null;
};

export const stub = {
  answer: { data: null, error: null } as Answer,
  answers: {} as Record<string, Answer>,
  calls: [] as unknown[][],
  /** answers given one per request, in order, before `answers` and `answer`: a paged read's pages */
  pages: {} as Record<string, Answer[]>,
  /** what auth.getSession() finds: the signed-in reader's session, or null */
  session: null as { user: { id: string } } | null,
};

/**
 * Resets the stub: every call answers with no data and no error, and no calls are written down.
 */
export const resetStub = () => {
  stub.answer = { data: null, error: null };
  stub.answers = {};
  stub.calls = [];
  stub.pages = {};
  stub.session = null;
};

/**
 * Makes calls answer with data.
 * @param target - A table, an rpc, or an auth method, for example 'auth.signUp'. Without it, every call answers.
 */
export const succeed = (data: unknown, target?: string) => {
  const answer = { data, error: null };

  if (target) stub.answers[target] = answer;
  else stub.answer = answer;
};

/**
 * Makes the next requests to a target answer with these pages of data, one page per request.
 * @param target - A table, for example 'books'.
 */
export const succeedPages = (pages: unknown[][], target: string) => {
  stub.pages[target] = pages.map((data) => ({ data, error: null }));
};

/**
 * Makes calls answer with an error.
 * @param code - The error code, for example '23505'.
 * @param target - A table, an rpc, or an auth method. Without it, every call answers.
 */
export const fail = (code?: string, target?: string, message = 'down') => {
  const answer = { data: null, error: { message, code } };

  if (target) stub.answers[target] = answer;
  else stub.answer = answer;
};

/**
 * Gets the arguments of each call of one step, for example every .eq().
 */
export const callsOf = (step: string) =>
  stub.calls.filter(([name]) => name === step).map(([, ...args]) => args);

const answerFor = (target: string) =>
  Promise.resolve(
    stub.pages[target]?.shift() ?? stub.answers[target] ?? stub.answer
  );

const STEPS = [
  'select',
  'insert',
  'update',
  'delete',
  'eq',
  'order',
  'range',
  'returns',
];

// a query on a table: each step is written down and leads on; awaiting it, or .single(), answers
const chain = (table: string) => {
  const link: Record<string, unknown> = {};

  for (const step of STEPS)
    link[step] = (...args: unknown[]) => {
      stub.calls.push([step, ...args]);

      return link;
    };

  for (const step of ['single', 'maybeSingle'])
    link[step] = () => {
      stub.calls.push([step]);

      return answerFor(table);
    };

  link.then = (
    done: (value: Answer) => unknown,
    failed?: (reason: unknown) => unknown
  ) => answerFor(table).then(done, failed);

  return link;
};

const authCall =
  (method: string) =>
  (...args: unknown[]) => {
    stub.calls.push([`auth.${method}`, ...args]);

    return answerFor(`auth.${method}`);
  };

export const supabase = {
  from: (table: string) => {
    stub.calls.push(['from', table]);

    return chain(table);
  },
  rpc: (name: string, args?: unknown) => {
    stub.calls.push(['rpc', name, args]);

    return answerFor(name);
  },
  auth: {
    signInWithPassword: authCall('signInWithPassword'),
    signUp: authCall('signUp'),
    signOut: authCall('signOut'),
    updateUser: authCall('updateUser'),
    resetPasswordForEmail: authCall('resetPasswordForEmail'),
    getSession: () => Promise.resolve({ data: { session: stub.session } }),
  },
};
