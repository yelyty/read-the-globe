import { style } from '@vanilla-extract/css';
import { phone } from '../../styles/global.css';
import { vars } from '../../styles/theme.css';

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '8px 16px',
  marginBottom: 24,
});

export const title = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 16,
  margin: 0,
  fontFamily: vars.font.display,
  fontWeight: 500,
  fontSize: 30,
  lineHeight: 1.1,
  color: vars.color.text,
  '@media': { [phone]: { fontSize: 26 } },
});
