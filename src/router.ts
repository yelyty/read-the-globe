import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { deLocalizeUrl, localizeUrl } from './paraglide/runtime.js';

export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  // routes and links stay unprefixed; the router adds and strips /cs or /uk
  rewrite: {
    input: ({ url }) => deLocalizeUrl(url),
    output: ({ url }) => localizeUrl(url),
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
