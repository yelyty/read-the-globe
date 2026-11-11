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
import * as s from './Suggest.css';

// "hoeg" finds Høeg: accents don't block a match
const fold = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
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
  const q = fold(value).trim();
  const hits = useMemo(
    () =>
      options
        .filter((v) => !q || fold(v).includes(q))
        // starts-with first
        .sort(
          (a, b) =>
            Number(fold(b).startsWith(q)) - Number(fold(a).startsWith(q))
        )
        .slice(0, MAX),
    [options, q]
  );
  // nothing to offer, or already exact: no menu
  const shown =
    open && hits.length > 0 && !(hits.length === 1 && fold(hits[0]) === q);

  // under the field, or over it when there's more room above
  const place = () => {
    const m = menu.current;
    const r = field.current?.getBoundingClientRect();
    if (!m || !r) return;
    const below = innerHeight - r.bottom - 16;
    const up = below < 200 && r.top > below;
    m.style.left = `${r.left}px`;
    m.style.width = `${r.width}px`;
    m.style.maxHeight = `${Math.min(280, (up ? r.top : below) - 16)}px`;
    m.style.top = up ? '' : `${r.bottom + 8}px`;
    m.style.bottom = up ? `${innerHeight - r.top + 8}px` : '';
  };

  useLayoutEffect(() => {
    const m = menu.current;
    if (!m) return;
    if (!shown) {
      if (m.matches(':popover-open')) m.hidePopover();
      return;
    }
    place();
    if (!m.matches(':popover-open')) m.showPopover();
    if (at > -1) m.children[at]?.scrollIntoView({ block: 'nearest' });
  });

  // the dialog scrolling under it moves the menu along; a resize closes it
  useEffect(() => {
    if (!shown) return;
    const onScroll = (e: Event) =>
      !menu.current?.contains(e.target as Node) && place();
    const close = () => setOpen(false);
    document.addEventListener('scroll', onScroll, true);
    addEventListener('resize', close);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
      removeEventListener('resize', close);
    };
  }, [shown]);

  const pick = (v: string) => {
    setOpen(false);
    setAt(-1);
    onValue(v);
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    const n = hits.length;
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && n) {
      e.preventDefault();
      const d = e.key === 'ArrowDown' ? 1 : -1;
      setAt((i) => (!shown || i < 0 ? (d > 0 ? 0 : n - 1) : (i + d + n) % n));
      setOpen(true);
    } else if (e.key === 'Enter' && shown && at > -1) {
      e.preventDefault();
      pick(hits[at]);
    } else if (e.key === 'Escape' && shown) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  };

  // nothing to suggest (a real place's name): a plain field
  if (!options.length)
    return (
      <input
        {...input}
        value={value}
        onChange={(e) => onValue(e.target.value)}
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
        onChange={(e) => {
          onValue(e.target.value);
          setOpen(true);
          setAt(-1);
        }}
        onKeyDown={keys}
        onBlur={(e) => {
          setOpen(false);
          input.onBlur?.(e);
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the field's arrow keys and Enter pick from the keyboard */}
      <ul
        ref={menu}
        id={id}
        className={s.menu}
        role="listbox"
        popover="manual"
        onMouseDown={(e) => e.preventDefault()} // keep focus in the field
        onClick={(e) => {
          const li = (e.target as Element).closest<HTMLElement>(
            '[role="option"]'
          );
          if (li) pick(hits[Number(li.dataset.i)]);
        }}
      >
        {shown &&
          hits.map((v, i) => (
            <li
              key={v}
              id={`${id}-${i}`}
              data-i={i}
              className={s.option}
              role="option"
              aria-selected={i === at}
            >
              {v}
            </li>
          ))}
      </ul>
    </>
  );
};

export default Suggest;
