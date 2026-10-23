import { useState } from 'react';
import { FileCsvIcon, FileCodeIcon } from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import * as s from '../../AccountPage.css';
import Block from '../../components/Block';
import { Button } from '../../../../components/Button/Button';

import { bookCount, exportBackup, exportReadingList } from './readingList';

type YourDataProps = {
  books: BookEntry[];
  names: Record<string, string>;
  goals: Goal[];
};

const YourData = ({ books, names, goals }: YourDataProps) => {
  const [status, setStatus] = useState('');

  const onExportReadingListClick = () => {
    exportReadingList(books, names);
    setStatus(`Exported ${bookCount(books.length)} to a reading list.`);
  };

  const onExportFullBackup = () => {
    exportBackup(books, goals);
    setStatus('Saved a full backup to your downloads.');
  };

  return (
    <Block title="Your data">
      <div className={s.item}>
        <h3 className={s.itemTitle}>Export</h3>
        <p className={s.itemText}>
          Take your atlas with you. The reading list opens in any spreadsheet;
          the backup keeps everything.
        </p>
        <div className={s.row}>
          <Button
            type="button"
            variant="quiet"
            onClick={onExportReadingListClick}
          >
            <FileCsvIcon aria-hidden="true" />
            Reading list (CSV)
          </Button>
          <Button type="button" variant="quiet" onClick={onExportFullBackup}>
            <FileCodeIcon aria-hidden="true" />
            Full backup (JSON)
          </Button>
          <p className={s.status} role="status">
            {status}
          </p>
        </div>
      </div>
    </Block>
  );
};

export default YourData;
