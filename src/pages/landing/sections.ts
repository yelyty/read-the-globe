import { m } from '../../paraglide/messages.js';

// the landing's sections. Plain anchors: on the landing they scroll in place (the router's Link would mark
// them all aria-current="page"); ponytail: from a company page they reload the landing, fine for a footer-page hop
export const SECTIONS = [
  { hash: 'atlas', label: m.landing_nav_atlas },
  { hash: 'features', label: m.landing_nav_how },
  { hash: 'share', label: m.landing_nav_postcards },
  { hash: 'faq', label: m.landing_nav_faq },
];
