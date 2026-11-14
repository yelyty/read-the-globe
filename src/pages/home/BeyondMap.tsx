import {
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
  type SyntheticEvent,
} from 'react';
import { useRouter } from '@tanstack/react-router';
import { ArrowCounterClockwiseIcon, PlusIcon } from '@phosphor-icons/react';

import type { World } from '../../types';
import { addWorld, removeWorld } from '../../api/worlds/worlds';
import { useStatus } from '../../hooks/useStatus';
import { sameWorld, type WorldRow } from '../../utils/worlds';
import { m } from '../../paraglide/messages.js';
import * as styles from './HomePage.css';
import WorldItem from './WorldItem';
import WorldDialog from './WorldDialog';

const OPEN = 'rtg-beyond';

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

  // the list remembers being open or closed on this device
  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const now = event.currentTarget.open;

    setOpen(now);

    try {
      localStorage.setItem(OPEN, now ? 'open' : 'closed');
    } catch {
      /* private mode: it opens again next time */
    }
  };

  const renderWorld = (world: WorldRow) => (
    <WorldItem
      key={world.name}
      world={world}
      onOpen={setShown}
      onRemove={remove}
    />
  );

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleDialogClose = () => setShown(null);

  return (
    <>
      <details className={styles.beyond} open={open} onToggle={handleToggle}>
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
            <ul className={styles.beyondList}>{worlds.map(renderWorld)}</ul>
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
              onChange={handleNameChange}
            />
            <button type="submit" className={styles.beyondBtn}>
              <PlusIcon aria-hidden="true" />
              {m.world_add()}
            </button>
          </form>
        </div>
      </details>
      {shown && <WorldDialog world={shown} onClose={handleDialogClose} />}
    </>
  );
};

export default BeyondMap;
