import { useState } from 'react';
import { DownloadSimpleIcon } from '@phosphor-icons/react';
import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import { exportReadingList } from '../YourData/readingList';
import { m } from '../../../../paraglide/messages.js';

import * as s from './DeleteAccount.css';

type KeepCopyProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

// the dialogs that remove books offer the reading list first, so nothing is lost by accident
const KeepCopy = ({ books, names }: KeepCopyProps) => {
  const [kept, setKept] = useState('');

  if (!books.length) return null;

  return (
    <div className={s.keepCopy}>
      <p>{m.account_keep_copy()}</p>
      <Button
        type="button"
        variant="text"
        onClick={() => {
          exportReadingList(books, names);

          setKept(
            m.account_keep_saved({
              books: m.count_book({ count: books.length }),
            })
          );
        }}
      >
        <DownloadSimpleIcon aria-hidden="true" />
        {m.account_download_list()}
      </Button>
      <span className={s.status} role="status">
        {kept}
      </span>
    </div>
  );
};

export default KeepCopy;
