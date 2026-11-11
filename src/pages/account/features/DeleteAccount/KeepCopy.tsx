import { useState } from 'react';
import { DownloadSimpleIcon } from '@phosphor-icons/react';
import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import { bookCount, exportReadingList } from '../YourData/readingList';
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
      <p>Want to keep your books? Save a copy first.</p>
      <Button
        type="button"
        variant="text"
        onClick={() => {
          exportReadingList(books, names);
          setKept(`Saved ${bookCount(books.length)} to your downloads.`);
        }}
      >
        <DownloadSimpleIcon aria-hidden="true" />
        Download reading list (CSV)
      </Button>
      <span className={s.status} role="status">
        {kept}
      </span>
    </div>
  );
};

export default KeepCopy;
