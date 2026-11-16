import { markWhich } from '../../utils/atlasMarks';
import { m } from '../../paraglide/messages.js';
import MarkDot from '../../components/MarkDot/MarkDot';
import * as styles from './LogBook.css';

type MarkPreviewProps = {
  name: string;
  /** a story is set there */
  set?: boolean;
  /** the author is from there */
  author?: boolean;
};

// one country Pin it will mark, with its swatch and, for screen readers, which mark
const MarkPreview = ({ name, set, author }: MarkPreviewProps) => {
  const which =
    set && author
      ? m.log_mark_both()
      : set
        ? m.log_mark_set()
        : m.log_mark_author();

  return (
    <span className={styles.mark}>
      <MarkDot kind={markWhich(Boolean(set), Boolean(author))} />
      {name}
      <span className={styles.srOnly}>, {which}</span>
    </span>
  );
};

export default MarkPreview;
