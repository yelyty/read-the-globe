import { type Mark } from '../../../../utils/atlasMarks';
import { m } from '../../../../paraglide/messages.js';

/**
 * Tells the marks of a country as text, for example "2 stories set here, 1 author from here".
 */
export const describe = ({ set, author }: Mark) =>
  [
    set.length &&
      m.home_n_set({ stories: m.count_story({ count: set.length }) }),
    author.length &&
      m.home_n_from({ authors: m.count_author({ count: author.length }) }),
  ]
    .filter(Boolean)
    .join(', ');
