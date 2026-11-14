import { useState } from 'react';
import { DownloadSimpleIcon } from '@phosphor-icons/react';

import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import { m } from '../../../../paraglide/messages.js';
import { exportReadingList } from '../YourData/readingList';
import * as styles from './DeleteAccount.css';

type KeepCopyProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

// the dialogs that remove books offer the reading list first, so nothing is lost by accident
const KeepCopy = ({ books, names }: KeepCopyProps) => {
  const [kept, setKept] = useState('');

  if (!books.length) return null;

  const handleDownload = () => {
    exportReadingList(books, names);

    setKept(
      m.account_keep_saved({
        books: m.count_book({ count: books.length }),
      })
    );
  };

  return (
    <div className={styles.keepCopy}>
      <p>{m.account_keep_copy()}</p>
      <Button type="button" variant="text" onClick={handleDownload}>
        <DownloadSimpleIcon aria-hidden="true" />
        {m.account_download_list()}
      </Button>
      <span className={styles.status} role="status">
        {kept}
      </span>
    </div>
  );
};

export default KeepCopy;
