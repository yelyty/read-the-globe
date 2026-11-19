import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BookEntry, Goal } from '../types';
import {
  callsOf,
  fail,
  resetStub,
  succeed,
  succeedPages,
} from '../testing/supabaseStub';
import { m } from '../paraglide/messages.js';

vi.mock('../utils/supabase', () => import('../testing/supabaseStub'));

const { deleteBook, getBooks, saveBook } = await import('./books/books');
const { sendContactMessage } = await import('./contact/contact');
const worldsApi = await import('./worlds/worlds');
const { addWorld, getWorlds, readWorlds, removeWorld } = worldsApi;
const { getNextReads } = await import('./nextReads/nextReads');
const goals = await import('./goals/goals');
const data = await import('./data/data');

beforeEach(() => {
  resetStub();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const goal = (extra: Partial<Goal>): Goal => ({
  id: 1,
  kind: 'theme',
  name: 'Books in translation',
  continent: null,
  countryCodes: null,
  target: 12,
  reachedOn: null,
  ...extra,
});

describe('getBooks', () => {
  it('reads the reader’s books, newest read first', async () => {
    succeed([]);

    await getBooks('u1');

    expect(callsOf('eq')).toEqual([['user_id', 'u1']]);

    expect(callsOf('order')).toEqual([
      ['read_on', { ascending: false, nullsFirst: false }],
      ['created_at', { ascending: false }],
      ['id'],
    ]);
  });

  it('reads an atlas bigger than one page whole', async () => {
    const shelf = (from: number, count: number) =>
      Array.from({ length: count }, (_unused, i) => ({
        id: from + i,
        title: `Book ${from + i}`,
        author: null,
        authorCountry: null,
      }));

    succeedPages([shelf(0, 1000), shelf(1000, 400)], 'books');

    const books = await getBooks('u1');

    expect(books).toHaveLength(1400);
    expect(books.at(-1)?.id).toBe(1399);

    expect(callsOf('range')).toEqual([
      [0, 999],
      [1000, 1999],
    ]);
  });

  it('stops after a full last page with an empty one', async () => {
    const full = Array.from({ length: 1000 }, (_unused, i) => ({
      id: i,
      author: null,
    }));

    succeedPages([full, []], 'books');

    expect(await getBooks('u1')).toHaveLength(1000);
    expect(callsOf('range')).toHaveLength(2);
  });

  it('puts the author’s country onto the author', async () => {
    const country = { code: '392', name: 'Japan' };

    succeed([
      {
        id: 1,
        title: 'Kokoro',
        author: { name: 'Sōseki' },
        authorCountry: country,
      },
      { id: 2, title: 'Beowulf', author: null, authorCountry: null },
    ]);

    expect(await getBooks('u1')).toEqual([
      { id: 1, title: 'Kokoro', author: { name: 'Sōseki', country } },
      { id: 2, title: 'Beowulf', author: null },
    ]);
  });

  it('gives an empty shelf when there are no rows', async () => {
    succeed(null);

    expect(await getBooks('u1')).toEqual([]);
  });

  it('throws when the books can’t be read', async () => {
    fail();

    await expect(getBooks('u1')).rejects.toThrow("Couldn't load your books");
  });
});

describe('books', () => {
  const draft = {
    title: 'Solaris',
    author: 'Lem',
    authorCountry: '616',
    readOn: '2026-01-02',
    places: [{ name: 'Solaris', country: null, imagined: true }],
    goalIds: [3],
  };

  it('saves a new book as one call, with every part of it', async () => {
    succeed(7, 'save_book');

    expect(await saveBook(draft)).toEqual({ problem: null, data: 7 });

    expect(callsOf('rpc')).toEqual([
      [
        'save_book',
        {
          p_book_id: null,
          p_title: 'Solaris',
          p_author: 'Lem',
          p_author_country: '616',
          p_read_on: '2026-01-02',
          p_places: draft.places,
          p_goal_ids: [3],
        },
      ],
    ]);
  });

  it('saves over the book it edits', async () => {
    await saveBook(draft, 4);

    expect(callsOf('rpc')[0][1]).toMatchObject({ p_book_id: 4 });
  });

  it('says a save went wrong in the reader’s words', async () => {
    fail();

    expect(await saveBook(draft)).toEqual({ problem: m.book_save_failed() });
  });

  it('removes a book by its id', async () => {
    expect(await deleteBook(4)).toBeNull();
    expect(callsOf('from')).toEqual([['books']]);
    expect(callsOf('eq')).toEqual([['id', 4]]);

    fail();
    expect(await deleteBook(4)).toBe(m.book_remove_failed());
  });
});

describe('sendContactMessage', () => {
  const message = { name: 'Ada', email: 'ada@example.com', message: 'Hi' };

  it('files the message', async () => {
    expect(await sendContactMessage(message)).toBeNull();
    expect(callsOf('insert')).toEqual([[message]]);
  });

  it('says when it couldn’t be sent', async () => {
    fail();

    expect(await sendContactMessage(message)).toBe(m.contact_failed());
  });
});

describe('worlds', () => {
  it('reads the reader’s saved worlds, oldest first', async () => {
    succeed([{ id: 'w1', name: 'Oz' }]);

    expect(await getWorlds('u1')).toEqual([{ id: 'w1', name: 'Oz' }]);
    expect(callsOf('order')).toEqual([['created_at']]);
  });

  it('quietly reads none when it can’t', async () => {
    fail();

    expect(await getWorlds('u1')).toEqual([]);
  });

  it('says so when a backup needs them and can’t read them', async () => {
    fail();

    await expect(readWorlds('u1')).rejects.toThrow(
      "Couldn't load your saved worlds"
    );
  });

  it('adds and removes a world', async () => {
    expect(await addWorld('Oz')).toBeNull();
    expect(await removeWorld('w1')).toBeNull();
    expect(callsOf('insert')).toEqual([[{ name: 'Oz' }]]);
    expect(callsOf('eq')).toEqual([['id', 'w1']]);
  });

  it('says when a world couldn’t be added or removed', async () => {
    fail();

    expect(await addWorld('Oz')).toBe(m.world_save_failed());
    expect(await removeWorld('w1')).toBe(m.world_remove_failed());
  });
});

describe('getNextReads', () => {
  it('reads the reader’s next reads, newest first', async () => {
    succeed([{ id: 1 }]);

    expect(await getNextReads('u1')).toEqual({
      items: [{ id: 1 }],
      failed: false,
    });

    expect(callsOf('order')).toEqual([['created_at', { ascending: false }]]);
  });

  it('quietly reads none, and says it failed', async () => {
    fail();

    expect(await getNextReads('u1')).toEqual({ items: [], failed: true });
  });
});

describe('goals', () => {
  it('reads the reader’s goals, oldest first', async () => {
    succeed([goal({})]);

    expect(await goals.getGoals('u1')).toEqual([goal({})]);
    expect(callsOf('eq')).toEqual([['user_id', 'u1']]);
  });

  it('throws when the goals can’t be read', async () => {
    fail();

    await expect(goals.getGoals('u1')).rejects.toThrow(m.goals_err_load());
  });

  it('stores only the field its kind uses, with a trimmed name', async () => {
    await goals.addGoal(
      goal({
        kind: 'region',
        name: ' Across Africa ',
        continent: 'AF',
        countryCodes: ['250'],
        target: 3,
      })
    );

    await goals.updateGoal(
      2,
      goal({ kind: 'countries', continent: 'EU', countryCodes: ['250'] })
    );

    expect(callsOf('insert')).toEqual([
      [
        {
          kind: 'region',
          name: 'Across Africa',
          continent: 'AF',
          country_codes: null,
          target: null,
        },
      ],
    ]);

    expect(callsOf('update')).toEqual([
      [
        {
          kind: 'countries',
          name: 'Books in translation',
          continent: null,
          country_codes: ['250'],
          target: null,
        },
      ],
    ]);

    expect(callsOf('eq')).toEqual([['id', 2]]);
  });

  it('says a name is taken in the reader’s words', async () => {
    fail('23505');

    expect(await goals.addGoal(goal({}))).toBe(m.goals_err_taken());
    expect(await goals.updateGoal(1, goal({}))).toBe(m.goals_err_taken());
  });

  it('passes on any other problem', async () => {
    fail(undefined, undefined, 'nope');

    expect(await goals.addGoal(goal({}))).toBe('nope');
    expect(await goals.deleteGoal(1)).toBe('nope');
    expect(await goals.markReached(1, null)).toBe('nope');
    expect(await goals.setGoalBooks(1, [])).toBe('nope');
  });

  it('deletes a goal and marks one reached', async () => {
    expect(await goals.deleteGoal(1)).toBeNull();
    expect(await goals.markReached(2, '2026-11-18')).toBeNull();
    expect(callsOf('update')).toEqual([[{ reached_on: '2026-11-18' }]]);

    expect(callsOf('eq')).toEqual([
      ['id', 1],
      ['id', 2],
    ]);
  });

  it('sets the books a goal counts', async () => {
    expect(await goals.setGoalBooks(1, [4, 5])).toBeNull();

    expect(callsOf('rpc')).toEqual([
      ['set_goal_books', { p_goal_id: 1, p_book_ids: [4, 5] }],
    ]);
  });

  describe('restoreGoal', () => {
    it('brings a goal back as it was, with its books', async () => {
      succeed({ id: 9 });

      const reached = goal({ reachedOn: '2026-01-01' });

      expect(await goals.restoreGoal(reached, [4])).toBeNull();

      expect(callsOf('insert')[0][0]).toMatchObject({
        reached_on: '2026-01-01',
      });

      expect(callsOf('rpc')).toEqual([
        ['set_goal_books', { p_goal_id: 9, p_book_ids: [4] }],
      ]);
    });

    it('sets no books for a goal that had none', async () => {
      succeed({ id: 9 });

      expect(await goals.restoreGoal(goal({}), [])).toBeNull();
      expect(callsOf('rpc')).toEqual([]);
    });

    it('stops when the goal can’t come back', async () => {
      fail('23505');

      expect(await goals.restoreGoal(goal({}), [4])).toBe(m.goals_err_taken());
      expect(callsOf('rpc')).toEqual([]);
    });
  });
});

describe('data', () => {
  const book = (id: number) => ({ id, title: `b${id}` }) as BookEntry;

  // what the reader has now, table by table
  const reading = ({
    books = [] as unknown[],
    goalRows = [] as Goal[],
    next = [] as unknown[],
    worlds = [] as unknown[],
  }) => {
    succeed(books, 'books');
    succeed(goalRows, 'goals');
    succeed(next, 'next_reads');
    succeed(worlds, 'worlds');
  };

  describe('getBackup', () => {
    it('copies the whole atlas', async () => {
      reading({ books: [book(1)], next: [{ id: 2 }], worlds: [{ id: 'w' }] });

      const backup = await data.getBackup('u1');

      expect(backup).toMatchObject({
        books: [book(1)],
        goals: [],
        nextReads: [{ id: 2 }],
        worlds: [{ id: 'w' }],
      });

      expect(Number.isNaN(Date.parse(backup.exported))).toBe(false);
    });

    it('throws rather than copy part of it', async () => {
      reading({});
      fail(undefined, 'next_reads');

      await expect(data.getBackup('u1')).rejects.toThrow(
        "Couldn't load your next reads"
      );
    });

    it('throws rather than leave out the saved worlds', async () => {
      reading({});
      fail(undefined, 'worlds');

      await expect(data.getBackup('u1')).rejects.toThrow(
        "Couldn't load your saved worlds"
      );
    });
  });

  describe('importBooks', () => {
    it('adds nothing, without asking, for an empty list', async () => {
      expect(await data.importBooks([])).toEqual({
        problem: null,
        data: { added: 0, duplicates: 0 },
      });

      expect(callsOf('rpc')).toEqual([]);
    });

    it('says how many were added and skipped', async () => {
      succeed({ added: 2, duplicates: 1 }, 'import_books');

      const list = [{ title: 'Kokoro' }] as never;

      expect(await data.importBooks(list)).toEqual({
        problem: null,
        data: { added: 2, duplicates: 1 },
      });

      expect(callsOf('rpc')).toEqual([['import_books', { p_books: list }]]);
    });

    it('says when the import failed', async () => {
      fail(undefined, 'import_books');

      expect(await data.importBooks([{}] as never)).toEqual({
        problem: m.data_import_failed(),
      });
    });
  });

  it('restores a backup, or says it couldn’t', async () => {
    const backup = { exported: '', books: [], goals: [] };

    expect(await data.restoreBackup(backup)).toBeNull();
    expect(callsOf('rpc')).toEqual([['restore_backup', { p_backup: backup }]]);

    fail();
    expect(await data.restoreBackup(backup)).toBe(m.data_restore_failed());
  });

  it('clears the atlas, or says it couldn’t', async () => {
    expect(await data.clearAtlas()).toBeNull();
    expect(callsOf('rpc')).toEqual([['clear_atlas', undefined]]);

    fail();
    expect(await data.clearAtlas()).toBe(m.account_clear_failed());
  });

  describe('restoreCleared', () => {
    it('brings the atlas back beside anything logged since', async () => {
      const was = {
        exported: '',
        books: [book(1)],
        goals: [goal({ id: 1, name: 'Nordics' })],
        nextReads: [{ id: 10 }],
        worlds: [{ id: 'old' }],
      } as never;

      reading({
        books: [book(2)],
        goalRows: [
          goal({ id: 2, name: 'NORDICS' }),
          goal({ id: 3, name: 'Nile' }),
        ],
        next: [{ id: 11 }],
        worlds: [{ id: 'new' }],
      });

      expect(await data.restoreCleared(was, 'u1')).toBeNull();

      const [[, { p_backup: restored }]] = callsOf('rpc') as [
        [string, { p_backup: Record<string, { id: unknown }[]> }],
      ];

      expect(restored.books.map((each) => each.id)).toEqual([2, 1]);
      // the goal from before keeps its name; a new one of the same name is dropped
      expect(restored.goals.map((each) => each.id)).toEqual([1, 3]);
      expect(restored.nextReads.map((each) => each.id)).toEqual([11, 10]);
      expect(restored.worlds.map((each) => each.id)).toEqual(['old', 'new']);
    });

    it('copes with a backup made before next reads and worlds', async () => {
      reading({});

      await data.restoreCleared({ exported: '', books: [], goals: [] }, 'u1');

      expect(callsOf('rpc')[0][1]).toMatchObject({
        p_backup: { nextReads: [], worlds: [] },
      });
    });

    it('restores nothing when what’s there now can’t be read', async () => {
      reading({});
      fail(undefined, 'books');

      expect(
        await data.restoreCleared({ exported: '', books: [], goals: [] }, 'u1')
      ).toBe(m.data_restore_failed());

      expect(callsOf('rpc')).toEqual([]);
    });
  });
});
