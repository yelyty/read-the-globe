import { getRouteApi } from "@tanstack/react-router";
import { useAuth } from "../../auth/auth-context";
import { useCountryNames } from "../../hooks/useCountryNames";

import UserDetails from "./features/UserDetails";
import ChangePassword from "./features/ChangePassword/ChangePassword";
import DeleteAccount from "./features/DeleteAccount";
import YourData from "./features/YourData/YourData";

import * as s from "./AccountPage.css";

const app = getRouteApi("/app");

const AccountPage = () => {
  const { user } = useAuth();
  const { books, goals } = app.useLoaderData();
  const names = useCountryNames();
  if (!user) return null;

  return (
    <div className={s.page}>
      <header className={s.head}>
        <h1 className={s.title}>Account</h1>
      </header>
      <UserDetails user={user} />
      <ChangePassword email={user.email ?? ""} />
      <YourData books={books} goals={goals} names={names} />
      <DeleteAccount books={books} names={names} />
    </div>
  );
};

export default AccountPage;
