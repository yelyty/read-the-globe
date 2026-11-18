import { useMemo } from 'react';

import type { BookEntry, World } from '../../../types';
import type { Landing } from '../../../hooks/useLanding';
import { atlasMarks, atlasStats } from '../../../utils/atlasMarks';
import { worldsOf } from '../../../utils/worlds';
import { m } from '../../../paraglide/messages.js';

/**
 * Gets what the atlas of Home shows.
 * While the pins of a book just pinned are in flight, Home shows the atlas as it was without that book,
 * and each country takes its mark when its pin lands.
 */
export function useAtlasView(
  books: BookEntry[],
  savedWorlds: World[],
  flying: Landing | null,
  landed: Set<string>
) {
  const marks = useMemo(() => atlasMarks(books), [books]);

  const shown = useMemo(
    () => (flying ? books.filter((book) => book.id !== flying.bookId) : books),
    [books, flying]
  );

  const held = useMemo(
    () => (flying ? atlasMarks(shown) : marks),
    [flying, shown, marks]
  );

  const painted = useMemo(
    () =>
      flying
        ? {
            ...held,
            ...Object.fromEntries(
              [...landed]
                .filter((code) => marks[code])
                .map((code) => [code, marks[code]])
            ),
          }
        : marks,
    [flying, held, landed, marks]
  );

  const dots = useMemo(
    () =>
      shown
        .flatMap((book) => book.places ?? [])
        .filter((place) => place.lon != null && place.lat != null),
    [shown]
  );

  const worlds = useMemo(
    () => worldsOf(shown, savedWorlds),
    [shown, savedWorlds]
  );

  const stats = useMemo(() => atlasStats(shown, held), [shown, held]);

  // imagined worlds a book has gone to, for the cartouche
  const imagined = worlds.filter((world) => world.books.length).length;

  const caption = stats.countries
    ? m.home_map_caption({
        countries: stats.countries,
        set: stats.set,
        authors: stats.authors,
      })
    : m.home_map_caption_empty();

  return {
    marks,
    shown,
    held,
    painted,
    dots,
    worlds,
    stats,
    imagined,
    caption,
    blank: !shown.length,
  };
}
