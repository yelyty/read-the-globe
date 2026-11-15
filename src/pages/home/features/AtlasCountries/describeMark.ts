import { type Mark } from '../../../../utils/atlasMarks';
import { m } from '../../../../paraglide/messages.js';

export const describe = ({ set, author }: Mark) =>
  [
    set.length &&
      m.home_n_set({ stories: m.count_story({ count: set.length }) }),
    author.length &&
      m.home_n_from({ authors: m.count_author({ count: author.length }) }),
  ]
    .filter(Boolean)
    .join(', ');
