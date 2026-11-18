import type { AnchorHTMLAttributes, Ref } from 'react';

import { button, type ButtonVariants } from './Button.css';

type ButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonVariants & { ref?: Ref<HTMLAnchorElement> };

/**
 * Shows a link that looks like a Button. ButtonLink uses it inside the Link of the router.
 */
const ButtonAnchor = ({
  variant = 'primary',
  underline,
  className,
  children,
  ...props
}: ButtonAnchorProps) => {
  const classes = [button({ variant, underline }), className]
    .filter(Boolean)
    .join(' ');

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  );
};

export default ButtonAnchor;
