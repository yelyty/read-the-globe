import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from 'react';
import * as styles from './Suggest.css';

// "hoeg" finds Høeg: accents don't block a match
const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const MAX = 60;

type SuggestProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'value' | 'onChange' | 'list'
> & {
  value: string;
  options: string[];
  /** typed or picked */
  onValue: (value: string) => void;
};

/* A text field with the app's own suggestion menu in place of the browser's datalist: the ARIA combobox
   pattern, arrow keys to move, Enter to pick, Esc to close (the menu, not the dialog under it).
   ponytail: the menu is a popover in the top layer, so it sits over the log dialog; it's placed by hand. */
const Suggest = ({
  value,
  options,
  onValue,
  onKeyDown,
  ...input
}: SuggestProps) => {
  const id = `sug-${useId().replace(/[^\w-]/g, '')}`;
  const field = useRef<HTMLInputElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(-1);
  const needle = fold(value).trim();

  const hits = useMemo(
    () =>
      options
        .filter((option) => !needle || fold(option).includes(needle))
        // starts-with first
        .sort(
          (first, second) =>
            Number(fold(second).startsWith(needle)) -
            Number(fold(first).startsWith(needle))
        )
        .slice(0, MAX),
    [options, needle]
  );

  // nothing to offer, or already exact: no menu
  const shown =
    open && hits.length > 0 && !(hits.length === 1 && fold(hits[0]) === needle);

  // under the field, or over it when there's more room above
  const place = () => {
    const list = menu.current;
    const rect = field.current?.getBoundingClientRect();

    if (!list || !rect) return;
    const below = innerHeight - rect.bottom - 16;
    const up = below < 200 && rect.top > below;

    list.style.left = `${rect.left}px`;
    list.style.width = `${rect.width}px`;
    list.style.maxHeight = `${Math.min(280, (up ? rect.top : below) - 16)}px`;
    list.style.top = up ? '' : `${rect.bottom + 8}px`;
    list.style.bottom = up ? `${innerHeight - rect.top + 8}px` : '';
  };

  useLayoutEffect(() => {
    const list = menu.current;

    if (!list) return;

    if (!shown) {
      if (list.matches(':popover-open')) list.hidePopover();

      return;
    }

    place();
    if (!list.matches(':popover-open')) list.showPopover();
    if (at > -1) list.children[at]?.scrollIntoView({ block: 'nearest' });
  });

  // the dialog scrolling under it moves the menu along; a resize closes it
  useEffect(() => {
    if (!shown) return;

    const onScroll = (scrollEvent: Event) =>
      !menu.current?.contains(scrollEvent.target as Node) && place();

    const close = () => setOpen(false);

    document.addEventListener('scroll', onScroll, true);
    addEventListener('resize', close);

    return () => {
      document.removeEventListener('scroll', onScroll, true);
      removeEventListener('resize', close);
    };
  }, [shown]);

  const pick = (option: string) => {
    setOpen(false);
    setAt(-1);
    onValue(option);
  };

  const keys = (keyEvent: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(keyEvent);
    const count = hits.length;

    if ((keyEvent.key === 'ArrowDown' || keyEvent.key === 'ArrowUp') && count) {
      keyEvent.preventDefault();
      const step = keyEvent.key === 'ArrowDown' ? 1 : -1;

      setAt((i) =>
        !shown || i < 0
          ? step > 0
            ? 0
            : count - 1
          : (i + step + count) % count
      );

      setOpen(true);
    } else if (keyEvent.key === 'Enter' && shown && at > -1) {
      keyEvent.preventDefault();
      pick(hits[at]);
    } else if (keyEvent.key === 'Escape' && shown) {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      setOpen(false);
    }
  };

  // nothing to suggest (a real place's name): a plain field
  if (!options.length)
    return (
      <input
        {...input}
        value={value}
        onChange={(changeEvent) => onValue(changeEvent.target.value)}
        onKeyDown={onKeyDown}
      />
    );

  return (
    <>
      <input
        {...input}
        ref={field}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={id}
        aria-expanded={shown}
        aria-activedescendant={shown && at > -1 ? `${id}-${at}` : undefined}
        onChange={(changeEvent) => {
          onValue(changeEvent.target.value);
          setOpen(true);
          setAt(-1);
        }}
        onKeyDown={keys}
        onBlur={(blurEvent) => {
          setOpen(false);
          input.onBlur?.(blurEvent);
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the field's arrow keys and Enter pick from the keyboard */}
      <ul
        ref={menu}
        id={id}
        className={styles.menu}
        role="listbox"
        popover="manual"
        onMouseDown={(mouseEvent) => mouseEvent.preventDefault()} // keep focus in the field
        onClick={(clickEvent) => {
          const li = (clickEvent.target as Element).closest<HTMLElement>(
            '[role="option"]'
          );

          if (li) pick(hits[Number(li.dataset.i)]);
        }}
      >
        {shown &&
          hits.map((option, i) => (
            <li
              key={option}
              id={`${id}-${i}`}
              data-i={i}
              className={styles.option}
              role="option"
              aria-selected={i === at}
            >
              {option}
            </li>
          ))}
      </ul>
    </>
  );
};

export default Suggest;
