import { useState } from 'react';
import {
  DownloadSimpleIcon,
  FileCsvIcon,
  FileCodeIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import { getBackup } from '../../../../api/data/data';
import * as s from '../../AccountPage.css';
import Block from '../../components/Block';
import { Button } from '../../../../components/Button/Button';
import { button } from '../../../../components/Button/Button.css';

import {
  bookCount,
  exportBackup,
  exportExample,
  exportReadingList,
} from './readingList';
import ImportCsv from './ImportCsv';
import RestoreBackup from './RestoreBackup';

type YourDataProps = {
  userId: string;
  books: BookEntry[];
  names: Record<string, string>;
  goals: Goal[];
};

const YourData = ({ userId, books, names, goals }: YourDataProps) => {
  const [status, setStatus] = useState('');
  const [imported, setImported] = useState('');

  const onExportReadingListClick = () => {
    exportReadingList(books, names);
    setStatus(`Exported ${bookCount(books.length)} to a reading list.`);
  };

  // the backup is read fresh, so it carries next reads and saved worlds too
  const onExportFullBackup = async () => {
    const backup = await getBackup(userId).catch(() => null);
    if (!backup) {
      setStatus('Your backup couldn’t be saved. Try again.');
      return;
    }
    exportBackup(backup);
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
      <div className={s.item}>
        <h3 className={s.itemTitle}>Import</h3>
        <p className={s.itemText}>
          Add books from a reading list (CSV) with columns for title, author,
          the author’s country, places (“City, Country; City”) and an optional
          date. Restoring a backup (JSON) replaces everything in this atlas.
        </p>
        <p className={s.example}>
          <Button type="button" variant="text" onClick={exportExample}>
            <DownloadSimpleIcon aria-hidden="true" />
            Download an example CSV
          </Button>
        </p>
        <div className={s.row}>
          <ImportCsv
            className={button({ variant: 'quiet' })}
            onDone={setImported}
          >
            <UploadSimpleIcon aria-hidden="true" />
            Reading list (CSV)
          </ImportCsv>
          <RestoreBackup
            userId={userId}
            books={books}
            goals={goals}
            onFail={setImported}
          />
          <p className={s.status} role="status">
            {imported}
          </p>
        </div>
      </div>
    </Block>
  );
};

export default YourData;
