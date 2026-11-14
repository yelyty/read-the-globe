import { type ComponentProps } from 'react';

import * as styles from './Dialog.css';

type DialogTextProps = ComponentProps<'p'>;

/** the explaining paragraph under the header */
const DialogText = ({ className, ...rest }: DialogTextProps) => (
  <p className={[styles.text, className].filter(Boolean).join(' ')} {...rest} />
);

export default DialogText;
