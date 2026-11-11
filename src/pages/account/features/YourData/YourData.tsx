import { useState } from 'react';
import {
  DownloadSimpleIcon,
  FileCsvIcon,
  FileCodeIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import { getBackup } from '../../../../api/data/data';
import * as styles from '../../AccountPage.css';
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
import { m } from '../../../../paraglide/messages.js';

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
    setStatus(m.account_exported({ books: bookCount(books.length) }));
  };

  // the backup is read fresh, so it carries next reads and saved worlds too
  const onExportFullBackup = async () => {
    const backup = await getBackup(userId).catch(() => null);

    if (!backup) {
      setStatus(m.account_backup_failed());

      return;
    }

    exportBackup(backup);
    setStatus(m.account_backup_saved());
  };

  return (
    <Block title={m.account_data_title()}>
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
          <Button type="button" variant="quiet" onClick={onExportFullBackup}>
            <FileCodeIcon aria-hidden="true" />
            {m.account_full_backup()}
          </Button>
          <p className={styles.status} role="status">
            {status}
          </p>
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
          <p className={styles.status} role="status">
            {imported}
          </p>
        </div>
      </div>
    </Block>
  );
};

export default YourData;
