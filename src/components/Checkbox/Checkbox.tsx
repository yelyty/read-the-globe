import type { ComponentProps } from 'react';
import { CheckIcon } from '@phosphor-icons/react';

import * as styles from './Checkbox.css';

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>;

/**
 * Shows the checkbox of the app: a rounded box that is green with a tick when it is checked.
 * Put it inside the label that names it.
 */
const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <span
    className={className ? `${styles.checkbox} ${className}` : styles.checkbox}
  >
    <input {...props} type="checkbox" className={styles.box} />
    <CheckIcon className={styles.tick} weight="bold" aria-hidden="true" />
  </span>
);

export default Checkbox;
