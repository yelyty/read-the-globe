import { button, type ButtonVariants } from './Button.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants;

export function Button({
  variant = 'contained',
  underline,
  className,
  ...props
}: ButtonProps) {
  const classes = [button({ variant, underline }), className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
