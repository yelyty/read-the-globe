import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';

import { useRefresh } from '../../../../hooks/useReader';
import { importBooks } from '../../../../api/data/data';
import { getCountryNames } from '../../../../utils/countryNames';
import { booksFromCsv } from '../../../../utils/readingListCsv';
import { m } from '../../../../paraglide/messages.js';
import { importReport } from './readingList';

type ImportCsvProps = {
  className: string;
  children: ReactNode;
  /** the result, in words */
  onDone: (text: string) => void;
};

// Import a reading list (CSV): a button that opens the file picker. Books are added, never replaced, all or nothing.
const ImportCsv = ({ className, children, onDone }: ImportCsvProps) => {
  const refresh = useRefresh();
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0];

    event.target.value = '';
    if (!chosen) return;
    setBusy(true);

    const { books, problems } = booksFromCsv(
      await chosen.text(),
      await getCountryNames()
    );

    const result = await importBooks(books);

    if (result.problem !== null) {
      setBusy(false);
      onDone(result.problem);

      return;
    }

    const { added, duplicates } = result.data;

    if (added) await refresh();
    setBusy(false);
    onDone(importReport(added, duplicates, problems));
  };

  const handleChooseFile = () => file.current?.click();

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={busy}
        aria-busy={busy || undefined}
        onClick={handleChooseFile}
      >
        {busy ? m.account_importing() : children}
      </button>
      <input
        ref={file}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={pick}
      />
    </>
  );
};

export default ImportCsv;
