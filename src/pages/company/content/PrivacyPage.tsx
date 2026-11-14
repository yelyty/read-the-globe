import * as styles from '../CompanyPage.css';
import CompanyPage from '../CompanyPage';

const PrivacyPage = () => (
  <CompanyPage
    title="Privacy"
    description="What Read The Globe keeps, why, and how to take it with you or delete it."
    draft
  >
    <h1>Privacy</h1>
    <p className={styles.lede}>
      The short version: we keep what the atlas needs to work, nothing more, and
      you can take it all with you or delete it whenever you like.
    </p>
    <p className={styles.meta}>
      Last updated 22 October 2026 · draft, to be reviewed before launch
    </p>
    <h2>What we keep</h2>
    <ul>
      <li>
        <b>Your account:</b> your display name, your email address and a
        securely stored password.
      </li>
      <li>
        <b>Your atlas:</b> the books you log, their authors and places, your
        goals, your Next to read list and your postcard settings.
      </li>
      <li>
        <b>Your preferences:</b> language and day or night reading.
      </li>
    </ul>
    <h2>What we don’t do</h2>
    <p>
      We don’t show ads, we don’t sell or share your data, and we don’t track
      you across other sites. Postcards are pictures you save and send yourself;
      there is no public page for your atlas.
    </p>
    <h2>Cookies</h2>
    <p>
      We use one cookie to keep you signed in. There are no analytics or
      advertising cookies.
    </p>
    <h2>Your choices</h2>
    <p>
      From your Account page you can download your reading list (CSV) or a full
      backup (JSON) at any time, clear your atlas, or delete your account.
      Deleting your account removes your atlas with it.
    </p>
    <h2>Questions</h2>
    <p>
      Write to{' '}
      <a href="mailto:hello@readtheglobe.app">hello@readtheglobe.app</a> and
      we’ll answer.
    </p>
  </CompanyPage>
);

export default PrivacyPage;
