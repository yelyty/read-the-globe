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
import * as accountStyles from '../account/features/DeleteAccount/DeleteAccount.css';
import { Button } from '../../components/Button/Button';
import * as styles from './HomePage.css';
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
  const books = worlds.reduce((total, world) => total + world.books.length, 0);

  const add = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = name.trim().replace(/\s+/g, ' ');

    if (!typed) return input.current?.focus();
    const had = worlds.find((world) => sameWorld(world.name, typed));

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
        className={styles.beyond}
        open={open}
        onToggle={(toggleEvent) => {
          const now = toggleEvent.currentTarget.open;

          setOpen(now);

          try {
            localStorage.setItem(OPEN, now ? 'open' : 'closed');
          } catch {
            /* private mode: it opens again next time */
          }
        }}
      >
        <summary className={styles.beyondLabel}>
          {m.world_beyond()}{' '}
          {worlds.length > 0 && (
            <span className={styles.beyondSum}>
              · {m.count_world({ count: worlds.length })}
              {books > 0 && `, ${m.count_book({ count: books })}`}
            </span>
          )}
        </summary>
        <div className={styles.beyondBody}>
          {worlds.length > 0 && (
            <ul className={styles.beyondList}>
              {worlds.map((world) => (
                <li key={world.name} className={styles.worldRow}>
                  <button
                    type="button"
                    className={styles.worldOpen}
                    aria-haspopup="dialog"
                    onClick={() => setShown(world)}
                  >
                    <i className={styles.dotImagined} aria-hidden="true" />
                    <span
                      className={styles.worldName}
                      data-saved={!world.books.length || undefined}
                    >
                      {world.name}
                    </span>
                    <span className={styles.beyondN}>
                      {world.books.length
                        ? m.count_book({ count: world.books.length })
                        : m.world_no_books_short()}
                    </span>
                  </button>
                  {!world.books.length && world.saved && (
                    <button
                      type="button"
                      className={styles.beyondRm}
                      aria-label={m.world_remove({ name: world.name })}
                      onClick={() => remove(world.saved!)}
                    >
                      <XIcon aria-hidden="true" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <form className={styles.beyondAdd} onSubmit={add} noValidate>
            <label className={styles.srOnly} htmlFor="w-name">
              {m.world_to_save()}
            </label>
            <input
              ref={input}
              id="w-name"
              maxLength={60}
              placeholder={m.world_placeholder()}
              autoComplete="off"
              value={name}
              onChange={(changeEvent) => setName(changeEvent.target.value)}
            />
            <button type="submit" className={styles.beyondBtn}>
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
      className={accountStyles.dialog}
      aria-labelledby="world-title"
      onClose={onClose}
      onClick={(clickEvent) =>
        clickEvent.target === clickEvent.currentTarget &&
        dialog.current?.close()
      }
    >
      <div className={accountStyles.dialogHead}>
        <div>
          <h2 className={accountStyles.dialogTitle} id="world-title">
            {world.name}
          </h2>
          <p className={styles.worldSub}>
            {m.world_beyond()} ·{' '}
            {books.length
              ? m.count_book({ count: books.length })
              : m.world_no_books_short()}
          </p>
        </div>
        <button
          type="button"
          className={accountStyles.close}
          aria-label={m.common_close()}
          onClick={() => dialog.current?.close()}
        >
          <XIcon aria-hidden="true" />
        </button>
      </div>
      {books.length ? (
        <ul className={styles.worldBooks}>
          {books.map((book) => (
            <li key={book.id}>
              <i
                className={styles.tipCover}
                style={{
                  background: coverColor(
                    book.title + (book.author?.name ?? '')
                  ),
                }}
                aria-hidden="true"
              />
              <div>
                <span className={styles.tipTitle}>{book.title}</span>
                <span>{book.author?.name}</span>
                {readDate(book) && (
                  <time dateTime={readDate(book)}>
                    {formatDay(readDate(book))}
                  </time>
                )}
              </div>
              <Link
                className={styles.more}
                to="."
                search={(prev) => ({ ...prev, edit: book.id })}
                aria-label={m.book_edit({ title: book.title })}
                onClick={() => dialog.current?.close()}
              >
                <PencilSimpleIcon aria-hidden="true" />
                {m.common_edit()}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={accountStyles.dialogText}>{m.world_no_books()}</p>
      )}
      <div className={accountStyles.dialogActions}>
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
