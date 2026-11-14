import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import {
  baseLocale,
  getLocale,
  localizeUrl,
  locales,
} from '../paraglide/runtime.js';
import { m } from '../paraglide/messages.js';
import type { AuthContextValue } from '../auth/auth-context';
import CompanyPage from '../pages/company/CompanyPage';
import { wantedLocale } from '../utils/lang';

export interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: () => {
    const prefix = window.location.pathname.split('/')[1];

    if (!locales.some((locale) => locale === prefix)) {
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
  // TODO: make nice
  errorComponent: () => (
    <CompanyPage
      title={m.common_try_again()}
      description={m.common_try_again()}
      translated
    >
      <h1>{m.common_try_again()}</h1>
    </CompanyPage>
  ),
});
