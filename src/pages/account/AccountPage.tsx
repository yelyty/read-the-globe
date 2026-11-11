import { getRouteApi } from '@tanstack/react-router';
import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';

import UserDetails from './features/UserDetails';
import ChangePassword from './features/ChangePassword/ChangePassword';
import DeleteAccount from './features/DeleteAccount/DeleteAccount';
import YourData from './features/YourData/YourData';
import ClearAtlas from './features/ClearAtlas/ClearAtlas';
import Block from './components/Block';

import * as s from './AccountPage.css';
import PageTitle from '../../components/PageTitle/PageTitle';

const app = getRouteApi('/app');

const AccountPage = () => {
  const { user } = useAuth();
  const { books, goals } = app.useLoaderData();
  const names = useCountryNames();

  if (!user) return null;

  return (
    <div className={s.wrapper}>
      <PageTitle>Account</PageTitle>
      <UserDetails user={user} />
      <ChangePassword email={user.email ?? ''} />
      <YourData userId={user.id} books={books} goals={goals} names={names} />
      <Block title="Start over" danger>
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
