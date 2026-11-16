import { m } from '../../paraglide/messages.js';
import MarkDot from '../../components/MarkDot/MarkDot';
import * as styles from './LogBook.css';

// an imagined world in Will mark: on no map, so it says so
const ImaginedMark = ({ name }: { name: string }) => (
  <span className={styles.mark}>
    <MarkDot kind="imagined" />
    {name}
    <span className={styles.markNote}> · {m.log_imagined_note()}</span>
  </span>
);

export default ImaginedMark;
