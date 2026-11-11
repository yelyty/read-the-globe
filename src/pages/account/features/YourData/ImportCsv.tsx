import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { importBooks } from '../../../../api/data/data';
import { getCountryNames } from '../../../../utils/countryNames';
import { booksFromCsv } from '../../../../utils/readingListCsv';
import { importReport } from './readingList';

type ImportCsvProps = {
  className: string;
  children: ReactNode;
  /** the result, in words */
  onDone: (text: string) => void;
};

// Import a reading list (CSV): a button that opens the file picker. Books are added, never replaced, all or nothing.
const ImportCsv = ({ className, children, onDone }: ImportCsvProps) => {
  const router = useRouter();
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

    if ('error' in result) {
      setBusy(false);
      onDone(result.error);

      return;
    }

    if (result.added) await router.invalidate();
    setBusy(false);
    onDone(importReport(result.added, result.duplicates, problems));
  };

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={busy}
        onClick={() => file.current?.click()}
      >
        {children}
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
