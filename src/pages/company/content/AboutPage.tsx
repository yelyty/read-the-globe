import { Link } from '@tanstack/react-router';
import * as styles from '../CompanyPage.css';
import CompanyPage from '../CompanyPage';

const AboutPage = () => (
  <CompanyPage
    title="About"
    description="Read The Globe is a reading atlas: every book you log marks where its story is set and where its author comes from."
    draft
  >
    <h1>A map for the books you’ve read</h1>
    <p className={styles.lede}>
      Read The Globe is a reading atlas. Every book you log marks the map twice:
      where its story is set, and where its author comes from. Over the years it
      becomes a picture of how far your reading has travelled.
    </p>
    <h2>Why two marks</h2>
    <p>
      A book set in Lagos and a book by an author from Lagos take you to the
      same place in different ways. One shows you the setting; the other shows
      you the perspective. Keeping both on the map lets you see the difference
      between reading about a place and reading from it.
    </p>
    <h2>What it isn’t</h2>
    <p>
      There are no streaks to keep and no leaderboard to climb. The map is the
      only progress bar, and it’s yours. When you want to show someone, you send
      a postcard.
    </p>
    <h2>Free, and kept simple</h2>
    <p>
      Read The Globe is free. You won’t be asked for a card, and there are no
      ads. Your reading list is yours to export at any time, as a spreadsheet or
      a full backup.
    </p>
    <p className={styles.meta}>
      Questions or ideas? <Link to="/contact">Write to us</Link>.
    </p>
  </CompanyPage>
);

export default AboutPage;
