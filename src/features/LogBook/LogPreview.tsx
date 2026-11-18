import { m } from '../../paraglide/messages.js';
import * as styles from './LogBook.css';
import ImaginedMark from './ImaginedMark';
import MarkPreview from './MarkPreview';
import type { LogReading, ReadPlace } from './bookLog';

type LogPreviewProps = {
  /** each country it will mark, by code, and which marks */
  marks: LogReading['marks'];
  /** the imagined worlds it's set in, on no map */
  imagined: Extract<ReadPlace, { imagined: true }>[];
  names: Record<string, string>;
};

/**
 * Shows Will mark: the countries the book adds to the atlas while the reader types, and its imagined worlds.
 * If there is nothing to mark, it shows nothing.
 */
const LogPreview = ({ marks, imagined, names }: LogPreviewProps) => {
  const preview = Object.entries(marks);

  if (!preview.length && !imagined.length) return null;

  return (
    <p className={styles.preview}>
      <span className={styles.label}>{m.log_will_mark()}</span>
      {preview.map(([code, mark]) => (
        <MarkPreview
          key={code}
          name={names[code] ?? ''}
          set={mark.set}
          author={mark.author}
        />
      ))}
      {imagined.map((place) => (
        <ImaginedMark key={place.key} name={place.name} />
      ))}
    </p>
  );
};

export default LogPreview;
