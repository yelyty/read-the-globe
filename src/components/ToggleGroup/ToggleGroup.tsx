import type { CSSProperties, ReactNode } from 'react';

import ToggleButton from './ToggleButton';

export type ToggleOption<T> = {
  value: T;
  /** what the button shows */
  content: ReactNode;
  /** its name, when what it shows isn't words (a colour swatch) or needs saying in full */
  ariaLabel?: string;
  title?: string;
  style?: CSSProperties;
  /** data-* attributes the styles key on */
  data?: Record<`data-${string}`, string>;
};

type ToggleGroupProps<T> = {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  /** the group's name: the id of a visible label, or the words themselves */
  labelledBy?: string;
  label?: string;
  className?: string;
  optionClassName?: string;
  /** shown before the buttons, inside the group */
  children?: ReactNode;
};

// a row of buttons where one is pressed: pick one of a few, each choice applies at once
const ToggleGroup = <T extends string | number>({
  value,
  options,
  onChange,
  labelledBy,
  label,
  className,
  optionClassName,
  children,
}: ToggleGroupProps<T>) => {
  return (
    <div
      className={className}
      role="group"
      aria-labelledby={labelledBy}
      aria-label={label}
    >
      {children}
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          option={option}
          pressed={option.value === value}
          className={optionClassName}
          onChoose={onChange}
        />
      ))}
    </div>
  );
};

export default ToggleGroup;
