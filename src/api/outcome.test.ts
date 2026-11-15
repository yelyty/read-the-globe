import { beforeEach, describe, expect, it, vi } from 'vitest';

import { m } from '../paraglide/messages.js';

// Supabase stood in: each call answers with whatever the test sets in `answer`
const answer: {
  data: unknown;
  error: { message: string; code?: string } | null;
} = {
  data: null,
  error: null,
};

vi.mock('../utils/supabase', () => {
  const chain = () => {
    const link: Record<string, unknown> = {};

    for (const step of ['from', 'insert', 'select', 'delete', 'eq', 'update'])
      link[step] = () => link;
    link.single = () => Promise.resolve(answer);

    link.then = (done: (value: unknown) => unknown) =>
      Promise.resolve(answer).then(done);

    return link;
  };

  return {
    supabase: {
      from: () => chain(),
      rpc: () => Promise.resolve(answer),
      auth: { resetPasswordForEmail: () => Promise.resolve(answer) },
    },
  };
});

const { saveBook } = await import('./books/books');
const { addNextRead, removeNextRead } = await import('./nextReads/nextReads');
const { importBooks } = await import('./data/data');
const { sendPasswordReset } = await import('../auth/session');

const fail = (code?: string) => {
  answer.data = null;
  answer.error = { message: 'down', code };
};

const succeed = (data: unknown) => {
  answer.data = data;
  answer.error = null;
};

const draft = {
  title: 'Solaris',
  author: 'Lem',
  authorCountry: '616',
  readOn: null,
  places: [],
  goalIds: [],
};

const item = {
  id: 'n1',
  title: 'Eden',
  author: null,
  countryCode: null,
  mark: null,
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  // the reset link points back at the app
  vi.stubGlobal('window', {
    location: { origin: 'https://app.test', href: 'https://app.test/' },
  });
});

describe('a change that makes something', () => {
  it('comes back with what it made', async () => {
    succeed('book-1');
    expect(await saveBook(draft)).toEqual({ problem: null, data: 'book-1' });

    succeed(item);
    expect(await addNextRead(item)).toEqual({ problem: null, data: item });

    succeed({ added: 2, duplicates: 1 });

    expect(await importBooks([{ title: 'x' } as never])).toEqual({
      problem: null,
      data: { added: 2, duplicates: 1 },
    });
  });

  it('or with what went wrong, in the reader’s words', async () => {
    fail();
    expect(await saveBook(draft)).toEqual({ problem: m.book_save_failed() });
    expect(await addNextRead(item)).toEqual({ problem: m.next_save_failed() });

    expect(await importBooks([{ title: 'x' } as never])).toEqual({
      problem: m.data_import_failed(),
    });
  });

  it('makes nothing from nothing, without asking', async () => {
    fail();

    expect(await importBooks([])).toEqual({
      problem: null,
      data: { added: 0, duplicates: 0 },
    });
  });
});

describe('a change', () => {
  it('comes back with null when it went through', async () => {
    succeed(null);
    expect(await removeNextRead(item)).toBeNull();
    expect(await sendPasswordReset('a@b.c')).toBeNull();
  });

  it('or with what went wrong, naming what it was about', async () => {
    fail();

    expect(await removeNextRead(item)).toBe(
      m.next_remove_failed({ title: 'Eden' })
    );

    expect(await sendPasswordReset('a@b.c')).toBe(m.common_try_again());
  });

  it('answers a reset for an unknown email as if it were sent, so no one learns who has an account', async () => {
    fail('user_not_found');
    expect(await sendPasswordReset('nobody@b.c')).toBeNull();
  });
});
