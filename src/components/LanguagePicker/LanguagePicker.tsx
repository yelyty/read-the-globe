import { useId } from 'react';
import { getLocale, locales, type Locale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import { LANG_NAMES, pickLang } from '../../utils/lang';
import { srOnly } from '../../styles/global.css';
import * as styles from './LanguagePicker.css';

type LanguagePickerProps = {
  /** the visible label; without one the select is named "Language" for screen readers only */
  label?: string;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
};

// a native select of the three languages; picking one reloads the page in it
const LanguagePicker = ({
  label,
  className,
  labelClassName,
  selectClassName = styles.select,
}: LanguagePickerProps) => {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className={label ? labelClassName : srOnly}>
        {label ?? m.language()}
      </label>
      <select
        id={id}
        className={selectClassName}
        value={getLocale()}
        onChange={(changeEvent) =>
          void pickLang(changeEvent.target.value as Locale)
        }
      >
        {locales.map((option) => (
          <option key={option} value={option} lang={option}>
            {LANG_NAMES[option]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguagePicker;
