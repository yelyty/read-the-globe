import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { Link, useMatchRoute } from '@tanstack/react-router';

import { useSignOut } from '../../hooks/useSignOut';
import * as s from './AccountMenu.css';
import { m } from '../../paraglide/messages.js';
import LanguagePicker from '../LanguagePicker/LanguagePicker';
import { menuRow } from '../LanguagePicker/LanguagePicker.css';

const AccountMenu = () => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const matchRoute = useMatchRoute();
  const onAccount = Boolean(matchRoute({ to: '/app/account' }));

  const { signOut } = useSignOut();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!open) return;
    if (event.key === 'Escape') {
      setOpen(false);
      button.current?.focus();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = [
        ...(list.current?.querySelectorAll<HTMLElement>('a, button, select') ??
          []),
      ];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(i + step + items.length) % items.length]?.focus();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keys and focus-out bubble up from the button and items
    <div
      ref={root}
      className={s.menu}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className={s.button}
        data-current={onAccount || undefined}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-menu"
        onClick={() => setOpen((current) => !current)}
      >
        {m.nav_account()}{' '}
        <CaretDownIcon className={s.caret} aria-hidden="true" />
      </button>
      <ul ref={list} id="account-menu" className={s.list} hidden={!open}>
        <li>
          <Link
            className={s.item}
            to="/app/account"
            onClick={() => setOpen(false)}
          >
            {m.nav_your_account()}
          </Link>
        </li>
        <li>
          <LanguagePicker label={m.language()} className={menuRow} />
        </li>
        <li>
          <button
            type="button"
            className={s.item}
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
          >
            {m.nav_sign_out()}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountMenu;
