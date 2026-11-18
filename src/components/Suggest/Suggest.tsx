import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import { fold } from '../../utils/text';
import { joinClass, useFieldControl } from '../Field/fieldControl';
import * as styles from './Suggest.css';
import SuggestOption from './SuggestOption';

// space kept between the list and the screen's edge, and between the list and its field
const SCREEN_MARGIN = 16;
const FIELD_GAP = 8;
// below this much room under the field, the list opens upwards if there's more room above
const MIN_ROOM_BELOW = 200;
const MAX_LIST_HEIGHT = 280;

const MAX = 60;

type SuggestProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'value' | 'onChange' | 'list'
> & {
  value: string;
  options: string[];
  /** typed or picked */
  onValue: (value: string) => void;
  /** picked from the menu (after onValue): for a field that adds what's picked, as the goal's countries do */
  onPick?: (value: string) => void;
};

/**
 * Shows a text field with a menu of suggestions, in place of the datalist of the browser (the ARIA combobox pattern).
 * The arrow keys move in the menu, Enter picks, and Esc closes the menu (not the dialog under it).
 * The menu is a popover in the top layer, so it shows over the log dialog. The component places it.
 */
const Suggest = ({
  value,
  options,
  onValue,
  onPick,
  onKeyDown,
  ...input
}: SuggestProps) => {
  const id = `sug-${useId().replace(/[^\w-]/g, '')}`;
  // inside a Field it takes the field's id, class and aria props
  const fieldControl = useFieldControl();

  const inputProps = {
    ...fieldControl,
    ...input,
    className: joinClass(fieldControl?.className, input.className),
  };

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
    const below = innerHeight - rect.bottom - SCREEN_MARGIN;
    const up = below < MIN_ROOM_BELOW && rect.top > below;

    list.style.left = `${rect.left}px`;
    list.style.width = `${rect.width}px`;
    list.style.maxHeight = `${Math.min(MAX_LIST_HEIGHT, (up ? rect.top : below) - SCREEN_MARGIN)}px`;
    list.style.top = up ? '' : `${rect.bottom + FIELD_GAP}px`;
    list.style.bottom = up ? `${innerHeight - rect.top + FIELD_GAP}px` : '';
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
    onPick?.(option);
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

  const handlePlainChange = (event: ChangeEvent<HTMLInputElement>) =>
    onValue(event.target.value);

  // typing opens the list again, with nothing highlighted
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValue(event.target.value);
    setOpen(true);
    setAt(-1);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setOpen(false);
    input.onBlur?.(event);
  };

  // keep focus in the field
  const handleMenuMouseDown = (event: MouseEvent<HTMLUListElement>) =>
    event.preventDefault();

  const handleMenuClick = (event: MouseEvent<HTMLUListElement>) => {
    const li = (event.target as Element).closest<HTMLElement>(
      '[role="option"]'
    );

    if (li) pick(hits[Number(li.dataset.i)]);
  };

  // nothing to suggest (a real place's name): a plain field
  if (!options.length)
    return (
      <input
        {...inputProps}
        value={value}
        onChange={handlePlainChange}
        onKeyDown={onKeyDown}
      />
    );

  return (
    <>
      <input
        {...inputProps}
        ref={field}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={id}
        aria-expanded={shown}
        aria-activedescendant={shown && at > -1 ? `${id}-${at}` : undefined}
        onChange={handleChange}
        onKeyDown={keys}
        onBlur={handleBlur}
      />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the field's arrow keys and Enter pick from the keyboard */}
      <ul
        ref={menu}
        id={id}
        className={styles.menu}
        role="listbox"
        popover="manual"
        onMouseDown={handleMenuMouseDown}
        onClick={handleMenuClick}
      >
        {shown &&
          hits.map((option, i) => (
            <SuggestOption
              key={option}
              id={`${id}-${i}`}
              index={i}
              active={i === at}
            >
              {option}
            </SuggestOption>
          ))}
      </ul>
    </>
  );
};

export default Suggest;
