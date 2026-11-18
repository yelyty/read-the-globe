import { useState } from 'react';
import {
  DownloadSimpleIcon,
  FileCsvIcon,
  FileCodeIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import { getBackup } from '../../../../api/data/data';
import Button from '../../../../components/Button/Button';
import { button } from '../../../../components/Button/Button.css';
import { m } from '../../../../paraglide/messages.js';
import StatusLine from '../../../../components/StatusLine/StatusLine';
import * as styles from '../../AccountPage.css';
import AccountSection from '../../components/AccountSection';
import {
  bookCount,
  exportBackup,
  exportExample,
  exportReadingList,
} from './readingList/readingList';
import ImportCsv from './ImportCsv/ImportCsv';
import RestoreBackup from './RestoreBackup/RestoreBackup';

type YourDataProps = {
  userId: string;
  books: BookEntry[];
  names: Record<string, string>;
  goals: Goal[];
};

/**
 * Shows the Your data section.
 * The reader can export the reading list as a CSV file, or a full backup as a JSON file.
 * The reader can also import a reading list, or restore a backup that replaces the atlas.
 */
const YourData = ({ userId, books, names, goals }: YourDataProps) => {
  const [status, setStatus] = useState('');
  const [imported, setImported] = useState('');
  const [backingUp, setBackingUp] = useState(false);

  const onExportReadingListClick = () => {
    exportReadingList(books, names);
    setStatus(m.account_exported({ books: bookCount(books.length) }));
  };

  const onExportFullBackup = async () => {
    setBackingUp(true);
    const backup = await getBackup(userId).catch(() => null);

    setBackingUp(false);

    if (!backup) {
      setStatus(m.account_backup_failed());

      return;
    }

    exportBackup(backup);
    setStatus(m.account_backup_saved());
  };

  return (
    <AccountSection title={m.account_data_title()}>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>{m.account_export()}</h3>
        <p className={styles.itemText}>{m.account_export_text()}</p>
        <div className={styles.row}>
          <Button
            type="button"
            variant="quiet"
            onClick={onExportReadingListClick}
          >
            <FileCsvIcon aria-hidden="true" />
            {m.account_reading_list_csv()}
          </Button>
          <Button
            type="button"
            variant="quiet"
            disabled={backingUp}
            aria-busy={backingUp || undefined}
            onClick={onExportFullBackup}
          >
            <FileCodeIcon aria-hidden="true" />
            {backingUp ? m.account_backup_preparing() : m.account_full_backup()}
          </Button>
          <StatusLine>{status}</StatusLine>
        </div>
      </div>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>{m.account_import()}</h3>
        <p className={styles.itemText}>{m.account_import_text()}</p>
        <p className={styles.example}>
          <Button type="button" variant="text" onClick={exportExample}>
            <DownloadSimpleIcon aria-hidden="true" />
            {m.account_example_csv()}
          </Button>
        </p>
        <div className={styles.row}>
          <ImportCsv
            className={button({ variant: 'quiet' })}
            onDone={setImported}
          >
            <UploadSimpleIcon aria-hidden="true" />
            {m.account_reading_list_csv()}
          </ImportCsv>
          <RestoreBackup
            userId={userId}
            books={books}
            goals={goals}
            onFail={setImported}
          />
          <StatusLine>{imported}</StatusLine>
        </div>
      </div>
    </AccountSection>
  );
};

export default YourData;
