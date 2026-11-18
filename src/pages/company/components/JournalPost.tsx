import * as styles from '../../../layout/PublicLayout/PublicLayout.css';

export type Post = {
  date: string;
  shown: string;
  title: string;
  text: string;
};

/**
 * Shows the teaser of a Journal post: its date, title, and first lines.
 */
const JournalPost = ({ post }: { post: Post }) => (
  <li className={styles.post}>
    <time dateTime={post.date}>{post.shown}</time>
    <h2>{post.title}</h2>
    <p>{post.text}</p>
  </li>
);

export default JournalPost;
