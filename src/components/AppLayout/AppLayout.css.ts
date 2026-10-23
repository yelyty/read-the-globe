import { style } from '@vanilla-extract/css';
import { space } from '../../styles/theme.css';

export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
});

export const main = style({
  flex: '1 0 auto',
  width: '100%',
  paddingBlock: `${space.sp6} 56px`,
});
