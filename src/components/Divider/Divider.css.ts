import { recipe } from '@vanilla-extract/recipes';

import { vars } from '../../styles/theme.css';

export const divider = recipe({
  base: {
    marginInline: 'auto',
    border: 'none',
  },
  variants: {
    orientation: {
      horizontal: {
        width: '100%',
        maxWidth: 1200,
        borderTop: `1px solid ${vars.color.stroke}`,
      },
      vertical: {
        alignSelf: 'stretch',
        marginBlock: 'auto',
        borderLeft: `1px solid ${vars.color.stroke}`,
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
