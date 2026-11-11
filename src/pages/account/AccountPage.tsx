import { getRouteApi } from '@tanstack/react-router';
import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';

import UserDetails from './features/UserDetails';
import ChangePassword from './features/ChangePassword/ChangePassword';
import DeleteAccount from './features/DeleteAccount/DeleteAccount';
import YourData from './features/YourData/YourData';
import ClearAtlas from './features/ClearAtlas/ClearAtlas';
import Block from './components/Block';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import * as fieldStyles from '../../components/Field/Field.css';
import { m } from '../../paraglide/messages.js';

import * as styles from './AccountPage.css';
import PageTitle from '../../components/PageTitle/PageTitle';

const app = getRouteApi('/app');

const AccountPage = () => {
  const { user } = useAuth();
  const { books, goals } = app.useLoaderData();
  const names = useCountryNames();

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <PageTitle>{m.nav_account()}</PageTitle>
      <UserDetails user={user} />
      <Block title={m.language()}>
        <LanguagePicker
          label={m.language_app()}
          className={fieldStyles.field}
          labelClassName={fieldStyles.fieldLabel}
          selectClassName={fieldStyles.input}
        />
      </Block>
      <ChangePassword email={user.email ?? ''} />
      <YourData userId={user.id} books={books} goals={goals} names={names} />
      <Block title={m.account_start_over()} danger>
        <ClearAtlas
          userId={user.id}
          books={books}
          goals={goals}
          names={names}
        />
        <DeleteAccount books={books} names={names} />
      </Block>
    </div>
  );
};

export default AccountPage;
