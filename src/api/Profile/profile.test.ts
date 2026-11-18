import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  callsOf,
  fail,
  resetStub,
  stub,
  succeed,
} from '../../testing/supabaseStub';
import { m } from '../../paraglide/messages.js';

vi.mock('../../utils/supabase', () => import('../../testing/supabaseStub'));

const { getAccountLang, saveAccountLang } = await import('./accountLang');
const { deleteAccount } = await import('./deleteAccount');
const { getProfile } = await import('./getProfile');
const { updateProfile } = await import('./updateProfile');

beforeEach(() => {
  resetStub();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('getAccountLang', () => {
  it('reads the language saved on the account', async () => {
    succeed({ lang: 'cs' });

    expect(await getAccountLang('u1')).toBe('cs');
    expect(callsOf('eq')).toEqual([['id', 'u1']]);
  });

  it('gives null when the account has no language or no profile yet', async () => {
    succeed({ lang: null });
    expect(await getAccountLang('u1')).toBeNull();

    succeed(null);
    expect(await getAccountLang('u1')).toBeNull();
  });

  it('throws when it can’t be read', async () => {
    fail();

    await expect(getAccountLang('u1')).rejects.toMatchObject({
      message: 'down',
    });
  });
});

describe('saveAccountLang', () => {
  it('saves on the account it is given', async () => {
    expect(await saveAccountLang('uk', 'u1')).toBeNull();
    expect(callsOf('update')).toEqual([[{ lang: 'uk' }]]);
    expect(callsOf('eq')).toEqual([['id', 'u1']]);
  });

  it('saves on the signed-in reader’s account when given none', async () => {
    stub.session = { user: { id: 'u2' } };

    await saveAccountLang('cs');

    expect(callsOf('eq')).toEqual([['id', 'u2']]);
  });

  it('saves nothing when signed out', async () => {
    expect(await saveAccountLang('cs')).toBeNull();
    expect(stub.calls).toEqual([]);
  });

  it('says what went wrong', async () => {
    fail();

    expect(await saveAccountLang('cs', 'u1')).toBe('down');
  });
});

describe('deleteAccount', () => {
  it('deletes the account, then signs out', async () => {
    expect(await deleteAccount()).toBeNull();
    expect(stub.calls.map(([step]) => step)).toEqual(['rpc', 'auth.signOut']);
  });

  it('stays signed in when the delete fails', async () => {
    fail(undefined, 'delete_account');

    expect(await deleteAccount()).toBe('down');
    expect(callsOf('auth.signOut')).toEqual([]);
  });
});

describe('getProfile', () => {
  it('reads the reader’s profile', async () => {
    const profile = { displayName: 'Ada', handle: null, postcard: null };

    succeed(profile);

    expect(await getProfile('u1')).toEqual(profile);
    expect(callsOf('eq')).toEqual([['id', 'u1']]);
  });

  it('quietly gives nothing when it can’t be read', async () => {
    fail();

    expect(await getProfile('u1')).toBeNull();
  });
});

describe('updateProfile', () => {
  it('writes only the fields it is given', async () => {
    await updateProfile('u1', { handle: 'ada' });
    await updateProfile('u1', { displayName: 'Ada', postcard: { year: 1 } });

    expect(callsOf('update')).toEqual([
      [{ handle: 'ada' }],
      [{ display_name: 'Ada', postcard: { year: 1 } }],
    ]);
  });

  it('can clear a handle', async () => {
    await updateProfile('u1', { handle: null });

    expect(callsOf('update')).toEqual([[{ handle: null }]]);
  });

  it('says a handle is taken in the reader’s words', async () => {
    fail('23505');

    expect(await updateProfile('u1', { handle: 'ada' })).toBe(
      m.account_handle_taken()
    );
  });

  it('passes on any other problem', async () => {
    fail('42501', undefined, 'not allowed');

    expect(await updateProfile('u1', { handle: 'ada' })).toBe('not allowed');
  });
});
