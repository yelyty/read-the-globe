import { UserIcon } from "@phosphor-icons/react";
import { useAuth } from "../../auth/auth-context";

const AccountPage = () => {
  const { user } = useAuth();

  const yearOf = (iso?: string) =>
    iso ? new Date(iso).getFullYear() : Infinity;
  const since = Math.min(yearOf(user?.created_at));

  return (
    <div>
      <header>
        <h1>
          <UserIcon aria-hidden="true" />
          Account
        </h1>
        {Number.isFinite(since) && <p>Mapping books since {since}</p>}
      </header>
    </div>
  );
};

export default AccountPage;
