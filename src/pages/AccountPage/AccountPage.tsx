import { getRouteApi } from "@tanstack/react-router";
import { useAuth } from "../../auth/auth-context";
import { useCountryNames } from "../../hooks/useCountryNames";
import UserDetails from "./components/UserDetails";

import * as s from "./AccountPage.css";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";
import YourData from "./components/YourData";

const app = getRouteApi("/app");

const AccountPage = () => {
  const { user } = useAuth();
  const { books } = app.useLoaderData();
  const names = useCountryNames();
  if (!user) return null;

  return (
    <div className={s.page}>
      <header className={s.head}>
        <h1 className={s.title}>Account</h1>
      </header>
      <UserDetails user={user} />
      <ChangePassword email={user.email ?? ""} />
      <YourData books={books} names={names} />
      <DeleteAccount books={books} names={names} />
    </div>
  );
};

export default AccountPage;
