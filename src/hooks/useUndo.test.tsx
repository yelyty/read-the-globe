import { describe, expect, it, vi } from 'vitest';

import { m } from '../paraglide/messages.js';
import type { Status } from './useStatus';
import { offerUndo, type UndoableChange } from './useUndo';

// the status line and the page refresh, as stand-ins that remember what they were asked
const outlets = () => {
  const said: Status[] = [];
  const refresh = vi.fn(() => Promise.resolve());

  return { said, show: (status: Status) => said.push(status), refresh };
};

const offer = (change: UndoableChange) => {
  const out = outlets();

  offerUndo(change, out);

  // pressing Undo on the line it showed
  const press = () => out.said[0].action!.run();

  return { ...out, press };
};

describe('an undoable change', () => {
  it('says what was done, with Undo beside it', () => {
    const { said } = offer({
      said: 'Solaris removed.',
      undo: () => Promise.resolve(null),
    });

    expect(said).toHaveLength(1);
    expect(said[0].text).toBe('Solaris removed.');
    expect(said[0].action?.label).toBe(m.common_undo());
  });

  it('puts it back, refreshes, then says it’s back', async () => {
    const undo = vi.fn(() => Promise.resolve(null));

    const { said, refresh, press } = offer({
      said: 'Solaris removed.',
      undo,
      undone: 'Solaris is back.',
    });

    await press();

    expect(undo).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();

    expect(said.map((status) => status.text)).toEqual([
      'Solaris removed.',
      'Solaris is back.',
    ]);
  });

  it('says what went wrong, and neither refreshes nor claims it’s back', async () => {
    const { said, refresh, press } = offer({
      said: 'Solaris removed.',
      undo: () => Promise.resolve('Couldn’t put it back.'),
      undone: 'Solaris is back.',
    });

    await press();

    expect(refresh).not.toHaveBeenCalled();

    expect(said.map((status) => status.text)).toEqual([
      'Solaris removed.',
      'Couldn’t put it back.',
    ]);
  });

  it('leaves the page alone when the caller puts its own list back', async () => {
    const { refresh, press } = offer({
      said: 'Removed from Next to read.',
      undo: () => Promise.resolve(null),
      refresh: false,
    });

    await press();

    expect(refresh).not.toHaveBeenCalled();
  });

  it('says nothing more when there’s no line for it being back', async () => {
    const { said, press } = offer({
      said: 'Earthsea removed.',
      undo: () => Promise.resolve(null),
    });

    await press();

    expect(said).toHaveLength(1);
  });
});
