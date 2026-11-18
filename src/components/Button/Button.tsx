import { button, type ButtonVariants } from './Button.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants;

/**
 * Shows a button in the style of the app.
 * @param variant - The look of the button, for example contained.
 * @param underline - If true, the text is underlined.
 */
const Button = ({
  variant = 'contained',
  underline,
  className,
  ...props
}: ButtonProps) => {
  const classes = [button({ variant, underline }), className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
};

export default Button;
