import * as s from '../CompanyPage.css';
import CompanyPage from '../CompanyPage';

const TermsPage = () => (
  <CompanyPage
    title="Terms of use"
    description="Plain rules for a free reading atlas."
    draft
  >
    <h1>Terms of use</h1>
    <p className={s.lede}>Plain rules for a free reading atlas.</p>
    <p className={s.meta}>
      Last updated 22 October 2026 · draft, to be reviewed before launch
    </p>
    <h2>Using Read The Globe</h2>
    <p>
      Read The Globe is free. You need an account to keep an atlas; keep your
      password to yourself, and tell us if you think someone else has used your
      account.
    </p>
    <h2>Your atlas is yours</h2>
    <p>
      The books, notes and goals you add belong to you. We store them only to
      run the atlas for you, and you can export or delete them at any time from
      your Account page.
    </p>
    <h2>Fair use</h2>
    <p>
      Don’t try to break the service, get into other people’s accounts or use it
      to send spam.
    </p>
    <h2>The map</h2>
    <p>
      Borders on the map are drawn from public-domain sources and simplified for
      reading. They aren’t a statement about any territory. Places outside the
      195 countries the atlas counts still show on the map.
    </p>
    <h2>Changes</h2>
    <p>
      If these terms change in a way that matters, we’ll tell you in the app
      before the change takes effect.
    </p>
    <h2>Contact</h2>
    <p>
      Questions about these terms:{' '}
      <a href="mailto:hello@readtheglobe.app">hello@readtheglobe.app</a>.
    </p>
  </CompanyPage>
);

export default TermsPage;
