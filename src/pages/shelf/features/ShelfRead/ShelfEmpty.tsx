import {
  DownloadSimpleIcon,
  PushPinIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';

import { m } from '../../../../paraglide/messages.js';
import { Button } from '../../../../components/Button/Button';
import ButtonLink from '../../../../components/Button/ButtonLink';
import { button } from '../../../../components/Button/Button.css';
import EmptyState from '../../../../components/EmptyState/EmptyState';
import ShelfSticker from '../../../../components/Sticker/ShelfSticker';
import ImportCsv from '../../../account/features/YourData/ImportCsv/ImportCsv';
import { exportExample } from '../../../account/features/YourData/readingList/readingList';
import * as styles from '../../ShelfPage.css';

type ShelfEmptyProps = {
  /** the import's result, in words */
  onImported: (text: string) => void;
};

/**
 * Shows the Shelf with no books yet: Log a book, or import a reading list as a CSV file.
 * @param onImported - Called with the report of the import.
 */
const ShelfEmpty = ({ onImported }: ShelfEmptyProps) => (
  <EmptyState
    art={<ShelfSticker />}
    title={m.shelf_empty_title()}
    text={m.shelf_empty_text()}
    actions={
      <>
        <ButtonLink
          variant="primary"
          to="."
          search={(prev) => ({ ...prev, log: true })}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          {m.log_a_book()}
        </ButtonLink>
        <span className={styles.orRule} aria-hidden="true">
          {m.shelf_or()}
        </span>
        <ImportCsv
          className={button({ variant: 'link', underline: true })}
          onDone={onImported}
        >
          <UploadSimpleIcon aria-hidden="true" />
          {m.shelf_backlog()}
        </ImportCsv>
      </>
    }
    note={
      <>
        {m.shelf_csv_hint()}
        <Button
          type="button"
          variant="link"
          underline
          className={styles.noteLink}
          onClick={exportExample}
        >
          <DownloadSimpleIcon aria-hidden="true" />
          {m.shelf_download_example()}
        </Button>
      </>
    }
  />
);

export default ShelfEmpty;
