import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';

import { srOnly } from '../../styles/global.css';
import * as styles from './Select.css';
import SelectItem from './SelectItem';

// keys typed within this long of each other spell one word (type-ahead)
const TYPE_AHEAD_MS = 600;
// options Page Up / Page Down move by
const PAGE_STEP = 8;

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  /** the option's own language, when it's written in one (a language's name) */
  lang?: string;
};

type SelectProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** the id of the visible label that names it */
  labelId?: string;
  /** its name for screen readers, when nothing on screen names it */
  label?: string;
  /** the button's id, so a <label htmlFor> still points at it */
  id?: string;
  /** compact: a small box; field: a form field; pill: a filled pill (the Shelf's filters); footer: on the landing green */
  variant?: keyof typeof styles.trigger;
  className?: string;
  disabled?: boolean;
  describedBy?: string;
};

const GAP = 6; // between the button and its list
const EDGE = 8; // the closest the list comes to the window's edge

/* A select of our own: a button showing the choice, opening a list of the options (the listbox pattern).
   The list is a popover, in the top layer, so dialogs and scroll boxes never clip it. */
const Select = <T extends string>({
  value,
  options,
  onChange,
  labelId,
  label,
  id,
  variant = 'field',
  className,
  disabled,
  describedBy,
}: SelectProps<T>) => {
  const auto = useId();
  const ownLabelId = `${auto}-label`;
  const buttonId = id ?? `${auto}-button`;
  const listId = `${auto}-list`;
  const optionId = (index: number) => `${auto}-option-${index}`;

  const chosen = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(chosen);

  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });

  // under the button, or over it when there's no room below; never past the window's edge
  const place = () => {
    const at = button.current?.getBoundingClientRect();
    const box = list.current;

    if (!at || !box) return;
    box.style.minWidth = `${at.width}px`;
    const height = box.offsetHeight;
    const below = innerHeight - at.bottom;
    const up = below < height + GAP + EDGE && at.top > below;

    box.style.top = `${up ? at.top - height - GAP : at.bottom + GAP}px`;
    box.style.left = `${Math.max(EDGE, Math.min(at.left, innerWidth - box.offsetWidth - EDGE))}px`;
    box.style.transformOrigin = up ? 'bottom' : 'top';
  };

  useLayoutEffect(() => {
    const box = list.current;

    if (!box) return;

    if (open) {
      if (!box.matches(':popover-open')) box.showPopover();
      place();
      box.focus({ preventScroll: true });
    } else if (box.matches(':popover-open')) box.hidePopover();
  }, [open]);

  // the active option stays in sight in a long list (the years)
  useEffect(() => {
    if (open)
      document.getElementById(optionId(active))?.scrollIntoView({
        block: 'nearest',
      });
  });

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };

    // the page moving under it: follow the button
    const follow = () => place();

    document.addEventListener('pointerdown', handlePointerDown);
    addEventListener('scroll', follow, true);
    addEventListener('resize', follow);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      removeEventListener('scroll', follow, true);
      removeEventListener('resize', follow);
    };
  }, [open]);

  const show = (index = chosen) => {
    setActive(index);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  const choose = (index: number) => {
    close();
    if (options[index] && options[index].value !== value)
      onChange(options[index].value);
  };

  // typing a few letters jumps to the option they start, as a native select does
  const typeahead = (key: string, now: number) => {
    const text =
      (now - typed.current.at < TYPE_AHEAD_MS ? typed.current.text : '') + key;

    typed.current = { text, at: now };
    const from = text.length === 1 ? active + 1 : active;

    for (let step = 0; step < options.length; step++) {
      const index = (from + step) % options.length;

      if (options[index].label.toLowerCase().startsWith(text.toLowerCase()))
        return index;
    }

    return null;
  };

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    event.stopPropagation(); // the account menu moves between its items on arrows
    show();
  };

  const onListKeyDown = (event: KeyboardEvent) => {
    const last = options.length - 1;

    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive(Math.min(last, active + 1)),
      ArrowUp: () => setActive(Math.max(0, active - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      PageDown: () => setActive(Math.min(last, active + PAGE_STEP)),
      PageUp: () => setActive(Math.max(0, active - PAGE_STEP)),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: close,
    };

    if (event.key === 'Tab') {
      setOpen(false);

      return;
    }

    const action = keys[event.key];

    if (action) {
      event.preventDefault();
      event.stopPropagation(); // keep Escape and arrows from closing or moving a menu or dialog around it
      action();

      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const found = typeahead(event.key, event.timeStamp);

      if (found !== null) setActive(found);
    }
  };

  // focus leaving the select altogether closes its list
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!root.current?.contains(event.relatedTarget)) setOpen(false);
  };

  const handleButtonClick = () => (open ? setOpen(false) : show());
  const handleOptionClick = (index: number) => () => choose(index);
  const handleOptionPointerMove = (index: number) => () => setActive(index);

  const renderOption = (option: SelectOption<T>, index: number) => (
    <SelectItem
      key={option.value}
      id={optionId(index)}
      label={option.label}
      lang={option.lang}
      selected={index === chosen}
      active={index === active}
      onClick={handleOptionClick(index)}
      onPointerMove={handleOptionPointerMove(index)}
    />
  );

  const current = options[chosen];

  return (
    <div
      ref={root}
      className={[styles.wrap[variant], className].filter(Boolean).join(' ')}
      onBlur={handleBlur}
    >
      {!labelId && (
        <span id={ownLabelId} className={srOnly}>
          {label}
        </span>
      )}
      <button
        ref={button}
        id={buttonId}
        type="button"
        className={styles.trigger[variant]}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId ?? ownLabelId} ${buttonId}`}
        aria-describedby={describedBy}
        onClick={handleButtonClick}
        onKeyDown={onButtonKeyDown}
      >
        <span className={styles.value} lang={current?.lang}>
          {current?.label}
        </span>
        <CaretDownIcon className={styles.caret} aria-hidden="true" />
      </button>
      <ul
        ref={list}
        id={listId}
        popover="manual"
        role="listbox"
        tabIndex={-1}
        aria-labelledby={labelId ?? ownLabelId}
        aria-activedescendant={open ? optionId(active) : undefined}
        className={styles.list}
        onKeyDown={onListKeyDown}
      >
        {options.map(renderOption)}
      </ul>
    </div>
  );
};

export default Select;
