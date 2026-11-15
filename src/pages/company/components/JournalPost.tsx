import * as styles from '../../../layout/PublicLayout/PublicLayout.css';

export type Post = {
  date: string;
  shown: string;
  title: string;
  text: string;
};

// a post's teaser: its date, title and first lines
const JournalPost = ({ post }: { post: Post }) => (
  <li className={styles.post}>
    <time dateTime={post.date}>{post.shown}</time>
    <h2>{post.title}</h2>
    <p>{post.text}</p>
  </li>
);

export default JournalPost;
