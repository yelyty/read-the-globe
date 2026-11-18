import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';

import { band as bandFill } from '../../../../styles/global.css';
import { space, vars } from '../../../../styles/theme.css';
import { sectionTitle } from '../../LandingPage.css';

const narrow = 'screen and (max-width: 799px)';
// the panels stack only where a panel fits under the header with room to spare
const stacking = 'screen and (min-width: 800px) and (min-height: 640px)';

/* the band: a wave down into the grey, then three colour panels */
export const band = style({ marginTop: space.sp9, scrollMarginTop: 80 });

export const wave = style({
  display: 'block',
  width: '100%',
  height: 'clamp(36px, 5vw, 72px)',
  marginBottom: -1,
  color: bandFill,
});

export const bandIn = style({
  width: '100%',
  padding: '40px max(16px, (100% - 1180px) / 2) 112px',
  background: bandFill,
});

export const title = style({
  ...sectionTitle,
  maxWidth: '16em',
  margin: '0 auto',
  textAlign: 'center',
});
export const sub = style({
  maxWidth: '32em',
  margin: `${space.sp4} auto 0`,
  textAlign: 'center',
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});

export const panels = style({
  display: 'grid',
  gap: space.sp6,
  marginTop: space.sp8,
  '@media': { [stacking]: { gap: space.sp8, paddingBottom: space.sp8 } },
});

// room after the last panel, so it pins under the header like the others before the pile scrolls away
globalStyle(`${panels}::after`, {
  '@media': { [stacking]: { content: '""', height: '30vh' } },
});

/* each panel pins under the header, 24px lower than the one before, and the next slides over it;
   the one underneath settles back a touch, where the browser can tie that to the scroll */
const settle = keyframes({ to: { scale: '.94', filter: 'brightness(.92)' } });

const panelBase = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: 760,
  padding: `${space.sp8} ${space.sp8} 0`,
  borderRadius: 32,
  overflow: 'hidden',
  background: 'var(--pb)',
  color: 'var(--pf)',
  '@media': {
    [stacking]: {
      position: 'sticky',
      top: 'calc(96px + var(--i) * 24px)',
      // every pinned panel ends at the same line, so the pile leaves as one (2 = the last panel's --i)
      marginBottom: 'calc((2 - var(--i)) * 24px)',
    },
    [narrow]: {
      height: 'auto',
      minHeight: 760,
      padding: `${space.sp7} ${space.sp5} 0`,
    },
  },
});

// …and the next panel takes that margin back, so the gap between them stays as it was
globalStyle(`${panelBase} + ${panelBase}`, {
  '@media': { [stacking]: { marginTop: 'calc((var(--i) - 3) * 24px)' } },
});

globalStyle(`${panelBase}:not(:last-child)`, {
  '@media': {
    [stacking]: {
      '@supports': {
        '(animation-timeline: view())': {
          '@media': {
            '(prefers-reduced-motion: no-preference)': {
              animation: `${settle} linear both`,
              animationTimeline: 'view()',
              animationRange: 'exit-crossing 0% exit-crossing 60%',
            },
          },
        },
      },
    },
  },
});

export const panel = styleVariants({
  green: [
    panelBase,
    {
      vars: {
        '--pb': 'var(--green)',
        '--pf': 'var(--on-green)',
        '--pf2': 'var(--on-green2)',
        '--i': '0',
      },
    },
  ],
  clay: [
    panelBase,
    {
      vars: {
        '--pb': 'var(--clay)',
        '--pf': 'var(--on-clay)',
        '--pf2': 'var(--on-clay2)',
        '--i': '1',
      },
    },
  ],
  // body text in full ink: the lighter brown fell under 4.5:1
  ochre: [
    panelBase,
    {
      vars: {
        '--pb': 'var(--ochre)',
        '--pf': 'var(--on-ochre)',
        '--pf2': 'var(--on-ochre)',
        '--i': '2',
      },
    },
  ],
});

// the words in one row, title left and line right; the app's own screen under them, cut by the panel's foot
export const panelText = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  alignItems: 'end',
  gap: `${space.sp4} ${space.sp7}`,
  paddingBottom: space.sp7,
  '@media': {
    [narrow]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      paddingBottom: space.sp6,
    },
  },
});

globalStyle(`${panelText} h3`, {
  fontFamily: vars.font.sans,
  fontWeight: 800,
  fontSize: 'clamp(32px, 3.6vw, 48px)',
  lineHeight: 1.02,
  letterSpacing: '-.025em',
  textWrap: 'balance',
  color: 'inherit',
});

globalStyle(`${panelText} p`, {
  maxWidth: '28em',
  color: 'var(--pf2)',
  textWrap: 'pretty',
});

export const shot = style({
  position: 'relative',
  flex: '1 1 0',
  minHeight: 0,
  padding: `${space.sp2} ${space.sp2} 0`,
  overflow: 'hidden',
  background: '#1E1A12',
  borderRadius: '16px 16px 0 0',
  '@media': { [narrow]: { flexBasis: 400 } },
});

globalStyle(`${shot} img`, {
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: '8px 8px 0 0',
  outline: '1px solid rgba(255, 255, 255, .08)', // a faint edge on the dark frame
  outlineOffset: -1,
});
