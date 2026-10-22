import { useState } from "react";
import { FileCsvIcon, FileCodeIcon } from "@phosphor-icons/react";
import Block from "./Block";
import type { BookEntry } from "../../../types";
import { bookCount, exportBackup, exportReadingList } from "../readingList";
import * as s from "../AccountPage.css";

type YourDataProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

// the atlas out: a reading list any spreadsheet opens, and a full backup
const YourData = ({ books, names }: YourDataProps) => {
  const [status, setStatus] = useState("");

  return (
    <Block title="Your data">
      <div className={s.item}>
        <h3 className={s.itemTitle}>Export</h3>
        <p className={s.itemText}>
          Take your atlas with you. The reading list opens in any spreadsheet;
          the backup keeps everything.
        </p>
        <div className={s.row}>
          <button
            type="button"
            className={s.quiet}
            onClick={() => {
              exportReadingList(books, names);
              setStatus(
                `Exported ${bookCount(books.length)} to a reading list.`,
              );
            }}
          >
            <FileCsvIcon aria-hidden="true" />
            Reading list (CSV)
          </button>
          <button
            type="button"
            className={s.quiet}
            onClick={() => {
              exportBackup(books);
              setStatus("Saved a full backup to your downloads.");
            }}
          >
            <FileCodeIcon aria-hidden="true" />
            Full backup (JSON)
          </button>
          <p className={s.status} role="status">
            {status}
          </p>
        </div>
      </div>
    </Block>
  );
};

export default YourData;
