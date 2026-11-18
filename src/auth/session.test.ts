import type { User } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { callsOf, fail, resetStub, succeed } from '../testing/supabaseStub';
import { m } from '../paraglide/messages.js';

const adoptAccountLang = vi.hoisted(() => vi.fn(() => Promise.resolve(true)));

vi.mock('../utils/supabase', () => import('../testing/supabaseStub'));
vi.mock('../utils/lang', () => ({ adoptAccountLang }));

const session = await import('./session');

const user = (extra: Partial<User> = {}) =>
  ({
    id: 'u1',
    email: 'ada@example.com',
    user_metadata: {},
    created_at: '2026-01-01T00:00:00Z',
    ...extra,
  }) as User;

beforeEach(() => {
  resetStub();
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});

  // the messages read the page's address once a window exists, so it needs a whole one
  vi.stubGlobal('window', {
    location: { origin: 'https://app.test', href: 'https://app.test/' },
  });
});

describe('toReader', () => {
  it('keeps what the app needs from a Supabase user', () => {
    expect(
      session.toReader(user({ user_metadata: { display_name: 'Ada' } }))
    ).toEqual({
      id: 'u1',
      email: 'ada@example.com',
      signUpName: 'Ada',
      createdAt: '2026-01-01T00:00:00Z',
    });
  });

  it('has no email or name when the user has none', () => {
    expect(
      session.toReader(
        user({ email: undefined, user_metadata: { display_name: 7 } })
      )
    ).toMatchObject({ email: null, signUpName: null });
  });
});

describe('signIn', () => {
  it('signs in and takes up the account’s language', async () => {
    succeed({ user: { id: 'u1' } }, 'auth.signInWithPassword');

    expect(await session.signIn('ada@example.com', 'secret')).toBeNull();

    expect(callsOf('auth.signInWithPassword')).toEqual([
      [{ email: 'ada@example.com', password: 'secret' }],
    ]);

    expect(adoptAccountLang).toHaveBeenCalledWith('u1');
  });

  it('signs in even when the language can’t be read', async () => {
    succeed({ user: { id: 'u1' } }, 'auth.signInWithPassword');
    adoptAccountLang.mockRejectedValueOnce(new Error('offline'));

    expect(await session.signIn('a@b.c', 'secret')).toBeNull();
  });

  it('tells wrong credentials from any other failure', async () => {
    fail('invalid_credentials', 'auth.signInWithPassword');
    expect(await session.signIn('a@b.c', 'x')).toBe('wrong-credentials');

    fail('over_request_rate_limit', 'auth.signInWithPassword');
    expect(await session.signIn('a@b.c', 'x')).toBe('failed');
  });
});

describe('signUp', () => {
  const details = {
    email: 'ada@example.com',
    password: 'longenough',
    name: 'Ada',
    example: false,
  };

  it('signs up with the name, and sends the confirmation back to the app', async () => {
    succeed({ session: {} }, 'auth.signUp');

    expect(await session.signUp(details)).toEqual({
      problem: null,
      confirmEmail: false,
    });

    expect(callsOf('auth.signUp')).toEqual([
      [
        {
          email: 'ada@example.com',
          password: 'longenough',
          options: {
            emailRedirectTo: 'https://app.test',
            data: { display_name: 'Ada' },
          },
        },
      ],
    ]);
  });

  it('remembers the wish for example books', async () => {
    succeed({ session: {} }, 'auth.signUp');

    await session.signUp({ ...details, example: true });

    expect(callsOf('auth.signUp')[0][0]).toMatchObject({
      options: { data: { display_name: 'Ada', seed_example: true } },
    });
  });

  it('asks to confirm the email when no session comes back', async () => {
    succeed({ session: null }, 'auth.signUp');

    expect(await session.signUp(details)).toEqual({
      problem: null,
      confirmEmail: true,
    });
  });

  it('says an email is taken, by either code', async () => {
    for (const code of ['user_already_exists', 'email_exists']) {
      fail(code, 'auth.signUp');

      expect(await session.signUp(details)).toEqual({
        problem: 'email-taken',
        confirmEmail: false,
      });
    }
  });

  it('fails on anything else', async () => {
    fail('weak_password', 'auth.signUp');

    expect((await session.signUp(details)).problem).toBe('failed');
  });
});

describe('seedIfWished', () => {
  const wishing = user({ user_metadata: { seed_example: true } });

  it('does nothing for a reader who didn’t ask for example books', async () => {
    await session.seedIfWished(user());

    expect(callsOf('rpc')).toEqual([]);
  });

  it('seeds the atlas, then forgets the wish', async () => {
    await session.seedIfWished(wishing);

    expect(callsOf('rpc')).toEqual([['seed_example_atlas', undefined]]);

    expect(callsOf('auth.updateUser')).toEqual([
      [{ data: { seed_example: null } }],
    ]);
  });

  it('seeds once when asked twice at the same time', async () => {
    await Promise.all([
      session.seedIfWished(wishing),
      session.seedIfWished(wishing),
    ]);

    expect(callsOf('rpc')).toHaveLength(1);
  });

  it('keeps the wish when the seeding fails, to try again next time', async () => {
    fail(undefined, 'seed_example_atlas');

    await session.seedIfWished(wishing);

    expect(callsOf('auth.updateUser')).toEqual([]);
  });
});

describe('sendPasswordReset', () => {
  it('sends a link back to the reset page', async () => {
    expect(await session.sendPasswordReset('ada@example.com')).toBeNull();

    expect(callsOf('auth.resetPasswordForEmail')).toEqual([
      ['ada@example.com', { redirectTo: 'https://app.test/reset-password' }],
    ]);
  });

  it('answers an unknown email as if it were sent', async () => {
    fail('user_not_found');

    expect(await session.sendPasswordReset('nobody@example.com')).toBeNull();
  });

  it('asks to try again on any other failure', async () => {
    fail('over_email_send_rate_limit');

    expect(await session.sendPasswordReset('ada@example.com')).toBe(
      m.common_try_again()
    );
  });
});

describe('signOut', () => {
  it('signs out', async () => {
    await session.signOut();

    expect(callsOf('auth.signOut')).toEqual([[]]);
  });
});

describe('updateDisplayName', () => {
  it('saves the name on the user', async () => {
    expect(await session.updateDisplayName('Ada L.')).toBeNull();

    expect(callsOf('auth.updateUser')).toEqual([
      [{ data: { display_name: 'Ada L.' } }],
    ]);
  });

  it('says when it couldn’t', async () => {
    fail();

    expect(await session.updateDisplayName('Ada')).toBe(
      m.auth_name_save_failed()
    );
  });
});

describe('changePassword', () => {
  it('changes the password', async () => {
    expect(await session.changePassword('newsecret')).toBeNull();
    expect(callsOf('auth.updateUser')).toEqual([[{ password: 'newsecret' }]]);
  });

  it('says what went wrong in the reader’s words', async () => {
    const cases = [
      ['same_password', m.auth_same_password()],
      ['weak_password', m.auth_weak_password()],
      ['reauthentication_needed', m.auth_reauth_needed()],
      ['unexpected_failure', m.auth_change_failed()],
    ] as const;

    for (const [code, said] of cases) {
      fail(code);

      expect(await session.changePassword('x'), code).toBe(said);
    }
  });
});
