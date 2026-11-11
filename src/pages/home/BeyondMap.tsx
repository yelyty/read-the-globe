import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import {
  ArrowCounterClockwiseIcon,
  PencilSimpleIcon,
  PlusIcon,
  PushPinIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { World } from '../../types';
import { addWorld, removeWorld } from '../../api/worlds/worlds';
import { useStatus } from '../../hooks/useStatus';
import { coverColor } from '../../utils/coverColors';
import { byReadDate, readDate } from '../../utils/readDate';
import { sameWorld, type WorldRow } from '../../utils/worlds';
import * as a from '../account/features/DeleteAccount/DeleteAccount.css';
import { Button } from '../../components/Button/Button';
import * as s from './HomePage.css';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';

const OPEN = 'rtg-beyond';
const formatDay = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/* Imagined worlds sit below the map: a margin of places no map has, each with how many books went there.
   A world can be saved before any book goes there, and removed (with Undo) until one does. The fold is
   remembered on this device. */
const BeyondMap = ({ worlds }: { worlds: WorldRow[] }) => {
  const router = useRouter();
  const status = useStatus();
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(OPEN) !== 'closed';
    } catch {
      return true;
    }
  });
  const [name, setName] = useState('');
  const [shown, setShown] = useState<WorldRow | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const books = worlds.reduce((n, w) => n + w.books.length, 0);

  const add = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = name.trim().replace(/\s+/g, ' ');
    if (!typed) return input.current?.focus();
    const had = worlds.find((w) => sameWorld(w.name, typed));
    if (had) {
      status.show({ text: m.world_already({ name: had.name }) });
      return input.current?.select();
    }
    const error = await addWorld(typed);
    if (error) return status.show({ text: error });
    setName('');
    await router.invalidate();
    status.show({ text: m.world_saved({ name: typed }) });
  };

  const remove = async (world: World) => {
    const error = await removeWorld(world.id);
    if (error) return status.show({ text: error });
    await router.invalidate();
    input.current?.focus();
    status.show({
      text: m.world_removed({ name: world.name }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const again = await addWorld(world.name);
          if (again) return status.show({ text: again });
          await router.invalidate();
        },
      },
    });
  };

  return (
    <>
      <details
        className={s.beyond}
        open={open}
        onToggle={(e) => {
          const now = e.currentTarget.open;
          setOpen(now);
          try {
            localStorage.setItem(OPEN, now ? 'open' : 'closed');
          } catch {
            /* private mode: it opens again next time */
          }
        }}
      >
        <summary className={s.beyondLabel}>
          {m.world_beyond()}{' '}
          {worlds.length > 0 && (
            <span className={s.beyondSum}>
              · {m.count_world({ count: worlds.length })}
              {books > 0 && `, ${m.count_book({ count: books })}`}
            </span>
          )}
        </summary>
        <div className={s.beyondBody}>
          {worlds.length > 0 && (
            <ul className={s.beyondList}>
              {worlds.map((w) => (
                <li key={w.name} className={s.worldRow}>
                  <button
                    type="button"
                    className={s.worldOpen}
                    aria-haspopup="dialog"
                    onClick={() => setShown(w)}
                  >
                    <i className={s.dotImagined} aria-hidden="true" />
                    <span
                      className={s.worldName}
                      data-saved={!w.books.length || undefined}
                    >
                      {w.name}
                    </span>
                    <span className={s.beyondN}>
                      {w.books.length
                        ? m.count_book({ count: w.books.length })
                        : m.world_no_books_short()}
                    </span>
                  </button>
                  {!w.books.length && w.saved && (
                    <button
                      type="button"
                      className={s.beyondRm}
                      aria-label={m.world_remove({ name: w.name })}
                      onClick={() => remove(w.saved!)}
                    >
                      <XIcon aria-hidden="true" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <form className={s.beyondAdd} onSubmit={add} noValidate>
            <label className={s.srOnly} htmlFor="w-name">
              {m.world_to_save()}
            </label>
            <input
              ref={input}
              id="w-name"
              maxLength={60}
              placeholder={m.world_placeholder()}
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className={s.beyondBtn}>
              <PlusIcon aria-hidden="true" />
              {m.world_add()}
            </button>
          </form>
        </div>
      </details>
      {shown && <WorldDialog world={shown} onClose={() => setShown(null)} />}
    </>
  );
};

// a world's box opens its books in a dialog, with the way to log another one set there
const WorldDialog = ({
  world,
  onClose,
}: {
  world: WorldRow;
  onClose: () => void;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const books = [...world.books].sort(byReadDate);
  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById('world-log')?.focus();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard
    <dialog
      ref={dialog}
      className={a.dialog}
      aria-labelledby="world-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
    >
      <div className={a.dialogHead}>
        <div>
          <h2 className={a.dialogTitle} id="world-title">
            {world.name}
          </h2>
          <p className={s.worldSub}>
            {m.world_beyond()} ·{' '}
            {books.length
              ? m.count_book({ count: books.length })
              : m.world_no_books_short()}
          </p>
        </div>
        <button
          type="button"
          className={a.close}
          aria-label={m.common_close()}
          onClick={() => dialog.current?.close()}
        >
          <XIcon aria-hidden="true" />
        </button>
      </div>
      {books.length ? (
        <ul className={s.worldBooks}>
          {books.map((b) => (
            <li key={b.id}>
              <i
                className={s.tipCover}
                style={{
                  background: coverColor(b.title + (b.author?.name ?? '')),
                }}
                aria-hidden="true"
              />
              <div>
                <span className={s.tipTitle}>{b.title}</span>
                <span>{b.author?.name}</span>
                {readDate(b) && (
                  <time dateTime={readDate(b)}>{formatDay(readDate(b))}</time>
                )}
              </div>
              <Link
                className={s.more}
                to="."
                search={(prev) => ({ ...prev, edit: b.id })}
                aria-label={m.book_edit({ title: b.title })}
                onClick={() => dialog.current?.close()}
              >
                <PencilSimpleIcon aria-hidden="true" />
                {m.common_edit()}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={a.dialogText}>{m.world_no_books()}</p>
      )}
      <div className={a.dialogActions}>
        <Button
          type="button"
          variant="text"
          onClick={() => dialog.current?.close()}
        >
          {m.common_close()}
        </Button>
        <Button
          type="button"
          id="world-log"
          onClick={() => {
            dialog.current?.close();
            navigate({
              to: '.',
              search: (prev) => ({ ...prev, log: true, world: world.name }),
            });
          }}
        >
          <PushPinIcon aria-hidden="true" />
          {m.world_log_here()}
        </Button>
      </div>
    </dialog>
  );
};

export default BeyondMap;
