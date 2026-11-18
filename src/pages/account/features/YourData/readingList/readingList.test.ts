import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Backup } from '../../../../../api/data/data';
import { CSV_HEAD, parseCsv, readingListRows, toCsv } from './readingListCsv';
import {
  atlasWords,
  bookCount,
  exportBackup,
  exportExample,
  exportReadingList,
  goalCount,
  importReport,
} from './readingList';

describe('bookCount and goalCount', () => {
  it('say one in the singular and more in the plural', () => {
    expect(bookCount(1)).toBe('1 book');
    expect(bookCount(3)).toBe('3 books');
    expect(goalCount(1)).toBe('1 goal');
    expect(goalCount(2)).toBe('2 goals');
  });
});

describe('atlasWords', () => {
  it('names both books and goals when there are some of each', () => {
    expect(atlasWords(3, 1)).toBe('3 books and 1 goal');
  });

  it('leaves out goals when there are none', () => {
    expect(atlasWords(2, 0)).toBe('2 books');
  });

  it('leaves out books when there are none', () => {
    expect(atlasWords(0, 2)).toBe('2 goals');
  });

  it('says nothing yet for an empty atlas', () => {
    expect(atlasWords(0, 0)).toBe('nothing yet');
  });
});

describe('importReport', () => {
  it('reports only what was imported when nothing was skipped', () => {
    expect(importReport(3, 0, 0)).toBe('Imported 3 books.');
  });

  it('adds a sentence for duplicates and for rows it could not read', () => {
    const report = importReport(2, 1, 4);

    expect(report).toMatch(
      /^Imported 2 books\. Skipped 1 book already on your shelf\. Skipped 4 rows/
    );
  });

  it('skips the duplicates sentence when there were none', () => {
    const report = importReport(0, 0, 1);

    expect(report).toMatch(/^Imported 0 books\. Skipped 1 row/);
    expect(report).not.toContain('already on your shelf');
  });
});

type Download = { text: Promise<string>; type: string; name: string };

describe('downloads', () => {
  let downloads: Download[];
  let revoke: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    downloads = [];
    revoke = vi.fn();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 17, 12));

    let blob: Blob | undefined;

    vi.stubGlobal('URL', {
      createObjectURL: (made: Blob) => {
        blob = made;

        return 'blob:test';
      },
      revokeObjectURL: revoke,
    });

    vi.stubGlobal('document', {
      createElement: () => {
        const link = { href: '', download: '' };

        return Object.assign(link, {
          click: () =>
            downloads.push({
              text: blob!.text(),
              type: blob!.type,
              name: link.download,
            }),
        });
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('exports the reading list as a dated CSV', async () => {
    const names = { '566': 'Nigeria' };

    exportReadingList([], names);

    expect(downloads).toHaveLength(1);

    expect(downloads[0].name).toBe(
      'read-the-globe-reading-list-2026-11-17.csv'
    );

    expect(downloads[0].type).toBe('text/csv');
    expect(await downloads[0].text).toBe(toCsv(readingListRows([], names)));
  });

  it('exports the backup as dated, indented JSON', async () => {
    const backup = { books: [], goals: [] } as unknown as Backup;

    exportBackup(backup);

    expect(downloads[0].name).toBe('read-the-globe-backup-2026-11-17.json');
    expect(downloads[0].type).toBe('application/json');
    expect(await downloads[0].text).toBe(JSON.stringify(backup, null, 2));
  });

  it('exports an example reading list the import can read back', async () => {
    exportExample();

    expect(downloads[0].name).toBe('read-the-globe-example-reading-list.csv');

    const rows = parseCsv(await downloads[0].text);

    expect(rows[0]).toEqual(CSV_HEAD);
    expect(rows).toHaveLength(6);
    expect(rows.every((row) => row.length === CSV_HEAD.length)).toBe(true);
  });

  it('frees the object URL once the click has gone through', () => {
    exportExample();

    expect(revoke).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith('blob:test');
  });
});
