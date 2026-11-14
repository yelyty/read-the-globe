import { useId } from 'react';

import { getLocale, locales, type Locale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import { LANG_NAMES, pickLang } from '../../utils/lang';
import Select from '../Select/Select';

type LanguagePickerProps = {
  /** the visible label; without one the picker is named "Language" for screen readers only */
  label?: string;
  /** compact: a small box in a menu row; field: a form field; footer: outlined on the green */
  variant?: 'compact' | 'field' | 'footer';
  className?: string;
  labelClassName?: string;
};

// each language in its own name; picking one reloads the page in it
const LanguagePicker = ({
  label,
  variant = 'compact',
  className,
  labelClassName,
}: LanguagePickerProps) => {
  const labelId = useId();

  const handleChange = (lang: Locale) => void pickLang(lang);

  // each language in its own name and language, so a screen reader pronounces it right
  const options = locales.map((lang) => ({
    value: lang,
    label: LANG_NAMES[lang],
    lang,
  }));

  return (
    <div className={className}>
      {label && (
        <span id={labelId} className={labelClassName}>
          {label}
        </span>
      )}
      <Select
        value={getLocale()}
        options={options}
        onChange={handleChange}
        labelId={label ? labelId : undefined}
        label={m.language()}
        variant={variant}
      />
    </div>
  );
};

export default LanguagePicker;
