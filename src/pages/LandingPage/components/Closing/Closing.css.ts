import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sectionTitle } from '../../LandingPage.css';
import { easeOut, hover } from '../../../../styles/global.css';

const narrow = 'screen and (max-width: 799px)';
const motionOk = '(prefers-reduced-motion: no-preference)';

export const close = style({
  position: 'relative',
  padding: '176px 0 208px',
  textAlign: 'center',
  overflow: 'hidden',
});
// set once the promise is in view (useReveal; at once under reduced motion)
export const stamped = style({});

export const defs = style({ position: 'absolute' });

export const inner = style({
  position: 'relative',
  zIndex: 1,
  width: 'min(1180px, 100% - 32px)',
  marginInline: 'auto',
});
export const title = style({
  ...sectionTitle,
  maxWidth: '15em',
  margin: '0 auto',
  lineHeight: 1.04,
});
export const cta = style({ marginTop: 32 });

// a stamp coming down, no bounce
const press = keyframes({
  from: { opacity: 0, scale: '1.25', rotate: '-10deg' },
  to: { opacity: 1, scale: '1', rotate: '0deg' },
});

export const stamp = style({
  position: 'absolute',
  width: 'var(--s)',
  height: 'var(--s)',
  opacity: 0,
  selectors: {
    [`${stamped} &`]: { opacity: 1 },
  },
  '@media': {
    [motionOk]: {
      transition: 'translate .24s ease-out, scale .24s ease-out',
      selectors: {
        [`${stamped} &`]: {
          animation: `${press} .48s ${easeOut} both`,
          animationDelay: 'calc(var(--n) * 120ms)',
        },
      },
    },
    // pointing at one lifts it; its <title> names it
    [`${motionOk} and ${hover}`]: {
      selectors: { '&:hover': { translate: '0 -8px', scale: '1.06' } },
    },
  },
});

// phones keep four stamps, two above the promise and two below (!important beats the inline spot)
export const onPhone = styleVariants({
  high: { '@media': { [narrow]: { top: '40px !important' } } },
  low: { '@media': { [narrow]: { top: 'auto !important', bottom: 32 } } },
  hide: { '@media': { [narrow]: { display: 'none' } } },
});
