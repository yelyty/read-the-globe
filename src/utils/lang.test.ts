import { beforeEach, describe, expect, it, vi } from 'vitest';

// the account and the page's language, as stand-ins that remember what they were asked
const account = vi.hoisted(() => ({
  get: vi.fn<(id: string) => Promise<string | null>>(),
  save: vi.fn<(lang: string, id?: string) => Promise<null>>(() =>
    Promise.resolve(null)
  ),
}));

const page = vi.hoisted(() => ({ locale: 'en', set: vi.fn() }));

vi.mock('../api/Profile/accountLang', () => ({
  getAccountLang: account.get,
  saveAccountLang: account.save,
}));

vi.mock('../paraglide/runtime.js', () => ({
  extractLocaleFromNavigator: () => 'en',
  getLocale: () => page.locale,
  localStorageKey: 'rtg-lang',
  setLocale: page.set,
  toLocale: (value: unknown) =>
    ['en', 'cs', 'uk'].includes(value as string) ? value : undefined,
}));

const { adoptAccountLang, pickLang } = await import('./lang');

beforeEach(() => {
  vi.clearAllMocks();
  page.locale = 'en';
});

describe('the account’s language', () => {
  it('wins on this device after signing in', async () => {
    account.get.mockResolvedValue('cs');

    expect(await adoptAccountLang('u1')).toBe(true);
    expect(page.set).toHaveBeenCalledWith('cs');
    expect(account.save).not.toHaveBeenCalled();
  });

  it('leaves the page alone when it’s already the one', async () => {
    account.get.mockResolvedValue('en');

    expect(await adoptAccountLang('u1')).toBe(false);
    expect(page.set).not.toHaveBeenCalled();
  });

  it('is taken from this device when the account has none yet', async () => {
    account.get.mockResolvedValue(null);

    expect(await adoptAccountLang('u1')).toBe(false);
    expect(account.save).toHaveBeenCalledWith('en', 'u1');
  });

  it('is never overwritten when it can’t be read', async () => {
    account.get.mockRejectedValue(new Error('down'));

    await expect(adoptAccountLang('u1')).rejects.toThrow();
    expect(account.save).not.toHaveBeenCalled();
  });

  it('follows a pick made on this device', async () => {
    await pickLang('uk');

    expect(account.save).toHaveBeenCalledWith('uk');
    expect(page.set).toHaveBeenCalledWith('uk');
  });
});
