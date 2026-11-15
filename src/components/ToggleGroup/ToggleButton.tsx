import type { ToggleOption } from './ToggleGroup';

type ToggleButtonProps<T> = {
  option: ToggleOption<T>;
  pressed: boolean;
  className?: string;
  onChoose: (value: T) => void;
};

// one choice of a ToggleGroup
const ToggleButton = <T extends string | number>({
  option,
  pressed,
  className,
  onChoose,
}: ToggleButtonProps<T>) => {
  const handleClick = () => onChoose(option.value);

  return (
    <button
      type="button"
      className={className}
      style={option.style}
      title={option.title}
      aria-label={option.ariaLabel}
      aria-pressed={pressed}
      onClick={handleClick}
      {...option.data}
    >
      {option.content}
    </button>
  );
};

export default ToggleButton;
