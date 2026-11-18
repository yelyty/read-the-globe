import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { useBooks, useGoals } from '../../hooks/useReader';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import * as fieldStyles from '../../components/Field/Field.css';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import UserDetails from './features/UserDetails/UserDetails';
import ChangePassword from './features/ChangePassword/ChangePassword';
import DeleteAccount from './features/DeleteAccount/DeleteAccount';
import YourData from './features/YourData/YourData';
import ClearAtlas from './features/ClearAtlas/ClearAtlas';
import AccountSection from './components/AccountSection';
import * as styles from './AccountPage.css';

/**
 * Shows the Account page.
 * The page has a section for the details, the language, and the password of the reader.
 * It also has a section for the data of the atlas, and a section to start again.
 * If no reader is signed in, the page shows nothing.
 */
const AccountPage = () => {
  const { user } = useAuth();
  const books = useBooks();
  const goals = useGoals();
  const names = useCountryNames();

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <PageTitle>{m.nav_account()}</PageTitle>
      <UserDetails user={user} />
      <AccountSection title={m.language()}>
        <LanguagePicker
          label={m.language_app()}
          className={fieldStyles.field}
          labelClassName={fieldStyles.fieldLabel}
          variant="field"
        />
      </AccountSection>
      <ChangePassword email={user.email ?? ''} />
      <YourData userId={user.id} books={books} goals={goals} names={names} />
      <AccountSection title={m.account_start_over()} danger>
        <ClearAtlas
          userId={user.id}
          books={books}
          goals={goals}
          names={names}
        />
        <DeleteAccount books={books} names={names} />
      </AccountSection>
    </div>
  );
};

export default AccountPage;
