import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import {
  baseLocale,
  extractLocaleFromNavigator,
  getLocale,
  localizeUrl,
  localStorageKey,
  locales,
  toLocale,
} from '../paraglide/runtime.js';
import { m } from '../paraglide/messages.js';
import type { AuthContextValue } from '../auth/auth-context';
import CompanyPage from '../pages/CompanyPage/CompanyPage';

export interface RouterContext {
  auth: AuthContextValue;
}

// A URL without /cs or /uk reads as English, so Paraglide never looks further. Send a reader who
// picked another language, or whose browser prefers one, to its prefix. A prefix in a link always wins.
const wantedLocale = () => {
  try {
    const saved = toLocale(localStorage.getItem(localStorageKey));

    if (saved) return saved;
  } catch {
    // storage blocked: fall back to the browser
  }

  return extractLocaleFromNavigator();
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: () => {
    const prefix = window.location.pathname.split('/')[1];

    if (!locales.some((l) => l === prefix)) {
      const wanted = wantedLocale();

      if (wanted && wanted !== baseLocale)
        throw redirect({
          href: localizeUrl(window.location.href, { locale: wanted }).href,
        });
    }

    document.documentElement.lang = getLocale();
  },
  component: Outlet,
  notFoundComponent: () => (
    // TODO: Redesign 404 page
    <CompanyPage
      title={m.not_found_title()}
      description={m.not_found_text()}
      translated
    >
      <h1>{m.not_found_title()}</h1>
    </CompanyPage>
  ),
});
