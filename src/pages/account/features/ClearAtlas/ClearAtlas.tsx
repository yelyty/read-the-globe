import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { EraserIcon } from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import {
  clearAtlas,
  getBackup,
  restoreCleared,
} from '../../../../api/data/data';
import { useStatus } from '../../../../hooks/useStatus';
import { useUndo } from '../../../../hooks/useUndo';
import { Button } from '../../../../components/Button/Button';
import Dialog from '../../../../components/Dialog/Dialog';
import DialogActions from '../../../../components/Dialog/DialogActions';
import DialogText from '../../../../components/Dialog/DialogText';
import { m } from '../../../../paraglide/messages.js';
import { atlasWords } from '../YourData/readingList';
import KeepCopy from '../DeleteAccount/KeepCopy';
import * as styles from '../DeleteAccount/DeleteAccount.css';

type ClearAtlasProps = {
  userId: string;
  books: BookEntry[];
  goals: Goal[];
  names: Record<string, string>;
};

// Clear this atlas: books, goals, next reads and saved worlds go; the account stays. Undo puts them back.
const ClearAtlas = ({ userId, books, goals, names }: ClearAtlasProps) => {
  const router = useRouter();
  const status = useStatus();
  const offerUndo = useUndo();
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0);
  const [clearing, setClearing] = useState(false);

  // nothing to clear on a blank atlas: the button says so rather than opening an empty dialog
  const blank = !books.length && !goals.length;
  const lost = atlasWords(books.length, goals.length);

  const close = () => {
    setOpen(false);
    setRound((current) => current + 1); // a fresh KeepCopy next time
  };

  const clear = async () => {
    setClearing(true);
    // the snapshot Undo restores, taken first: if it can't be read, nothing is cleared
    const was = await getBackup(userId).catch(() => null);
    const problem = was ? await clearAtlas() : m.account_clear_failed();

    setClearing(false);
    close();

    if (problem || !was) {
      status.show({ text: problem ?? '' });

      return;
    }

    await router.invalidate();
    await router.navigate({ to: '/app' });

    // anything logged since the clear stays, beside the atlas as it was
    offerUndo({
      said: m.account_cleared({ what: lost }),
      undo: () => restoreCleared(was, userId),
      undone: m.account_atlas_back(),
    });
  };

  const handleOpen = () => setOpen(true);

  return (
    <div className={styles.dangerItem}>
      <h3 className={styles.itemTitle}>{m.account_clear()}</h3>
      <p className={styles.itemText} id="ac-clear-desc">
        {blank ? m.account_clear_blank() : m.account_clear_text()}
      </p>
      <Button
        type="button"
        variant="dangerOutline"
        aria-haspopup="dialog"
        aria-describedby="ac-clear-desc"
        disabled={blank}
        onClick={handleOpen}
      >
        <EraserIcon aria-hidden="true" />
        {m.account_clear()}
      </Button>

      <Dialog
        open={open}
        onClose={close}
        title={m.account_clear_question()}
        initialFocus="ac-clear-keep" // the safe choice takes focus
        aria-describedby="ac-clear-q"
      >
        <DialogText id="ac-clear-q">
          {m.account_clear_dialog({ what: lost })}
        </DialogText>
        <KeepCopy key={round} books={books} names={names} />
        <DialogActions>
          <Button
            id="ac-clear-keep"
            type="button"
            variant="text"
            onClick={close}
          >
            {m.account_keep_atlas()}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={clearing}
            aria-busy={clearing || undefined}
            onClick={clear}
          >
            <EraserIcon aria-hidden="true" />
            {clearing ? m.account_clearing() : m.account_clear()}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClearAtlas;
