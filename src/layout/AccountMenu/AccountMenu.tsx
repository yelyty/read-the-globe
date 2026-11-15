import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { Link, useMatchRoute } from '@tanstack/react-router';

import { useSignOut } from '../../hooks/useSignOut';
import { m } from '../../paraglide/messages.js';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import { menuRow } from '../../components/LanguagePicker/LanguagePicker.css';
import * as styles from './AccountMenu.css';

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
        ...(list.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
      ];

      const i = items.indexOf(document.activeElement as HTMLElement);
      const step = event.key === 'ArrowDown' ? 1 : -1;

      items[(i + step + items.length) % items.length]?.focus();
    }
  };

  // focus leaving the menu altogether closes it
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!root.current?.contains(event.relatedTarget)) setOpen(false);
  };

  const handleToggle = () => setOpen((current) => !current);
  const handleClose = () => setOpen(false);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keys and focus-out bubble up from the button and items
    <div
      ref={root}
      className={styles.menu}
      onKeyDown={onKeyDown}
      onBlur={handleBlur}
    >
      <button
        ref={button}
        type="button"
        className={styles.button}
        data-current={onAccount || undefined}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-menu"
        onClick={handleToggle}
      >
        {m.nav_account()}{' '}
        <CaretDownIcon className={styles.caret} aria-hidden="true" />
      </button>
      <ul ref={list} id="account-menu" className={styles.list} hidden={!open}>
        <li>
          <Link className={styles.item} to="/app/account" onClick={handleClose}>
            {m.nav_your_account()}
          </Link>
        </li>
        <li>
          <LanguagePicker label={m.language()} className={menuRow} />
        </li>
        <li>
          <button type="button" className={styles.item} onClick={handleSignOut}>
            {m.nav_sign_out()}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountMenu;
