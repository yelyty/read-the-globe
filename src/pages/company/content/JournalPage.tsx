import * as styles from '../CompanyPage.css';
import CompanyPage from '../CompanyPage';
import JournalPost, { type Post } from '../components/JournalPost';

const POSTS: Post[] = [
  {
    date: '2026-10-14',
    shown: '14 October 2026',
    title: 'Postcards for every year',
    text: 'Each December your atlas makes a card for the year: a stamp for every country your books reached. Here’s how it chooses what goes on it.',
  },
  {
    date: '2026-09-30',
    shown: '30 September 2026',
    title: 'Reading from a place, not just about it',
    text: 'Why the atlas keeps two marks per book, and what changed on our own maps once we started counting authors as well as settings.',
  },
  {
    date: '2026-09-02',
    shown: '2 September 2026',
    title: 'Twelve countries around South America',
    text: 'A starting list for the Around South America goal, one book for each country on the route.',
  },
];

// ponytail: three teasers, no post pages yet; add a /journal/$post route when there's a post to read
const JournalPage = () => {
  return (
    <CompanyPage
      title="Journal"
      description="Notes on reading the world: what’s new in the atlas, and ideas for where to read next."
      draft
    >
      <h1>Journal</h1>
      <p className={styles.lede}>
        Notes on reading the world: what’s new in the atlas, and ideas for where
        to read next.
      </p>
      <ul className={styles.posts}>
        {POSTS.map((post) => (
          <JournalPost key={post.date} post={post} />
        ))}
      </ul>
    </CompanyPage>
  );
};

export default JournalPage;
