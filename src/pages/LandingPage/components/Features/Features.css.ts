import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { sectionTitle } from '../../LandingPage.css';
import { band as bandFill } from '../../../../styles/global.css';
import { vars } from '../../../../styles/theme.css';

const narrow = 'screen and (max-width: 799px)';
// the panels stack only where a panel fits under the header with room to spare
const stacking = 'screen and (min-width: 800px) and (min-height: 640px)';

/* the band: a wave down into the grey, then three colour panels */
export const band = style({ marginTop: 96, scrollMarginTop: 80 });

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
  margin: '16px auto 0',
  textAlign: 'center',
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});

export const panels = style({
  display: 'grid',
  gap: 32,
  marginTop: 56,
  '@media': { [stacking]: { gap: 64, paddingBottom: 64 } },
});

/* each panel pins under the header, 24px lower than the one before, and the next slides over it;
   the one underneath settles back a touch, where the browser can tie that to the scroll */
const settle = keyframes({ to: { scale: '.94', filter: 'brightness(.92)' } });

const panelBase = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: 760,
  padding: '56px 64px 0',
  borderRadius: 32,
  overflow: 'hidden',
  background: 'var(--pb)',
  color: 'var(--pf)',
  '@media': {
    [stacking]: { position: 'sticky', top: 'calc(96px + var(--i) * 24px)' },
    [narrow]: { height: 'auto', minHeight: 760, padding: '40px 24px 0' },
  },
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
  gap: '16px 48px',
  paddingBottom: 40,
  '@media': {
    [narrow]: { gridTemplateColumns: 'minmax(0, 1fr)', paddingBottom: 32 },
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
  padding: '8px 8px 0',
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
