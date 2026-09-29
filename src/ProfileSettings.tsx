import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import Dialog, { DialogContent, DialogTitle } from "./components/Dialog/Dialog";
import { useAuth } from "./auth/auth-context";

import { supabase } from "./utils/supabase";
import { getProfile } from "./api/Profile/getProfile";
import { updateProfile } from "./api/Profile/updateProfile";
import { deleteAccount } from "./api/Profile/deleteAccount";

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then((profile) => {
      setName(profile?.displayName ?? "");
      setHandle(profile?.handle ?? "");
    });
  }, [user]);

  const goBack = () => navigate({ to: "/app" });

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setStatus(null);
    const cleanHandle = handle.trim().toLowerCase() || null;
    if (cleanHandle && !/^[a-z0-9-]{3,24}$/.test(cleanHandle)) {
      setError("Handles use 3–24 lowercase letters, digits or hyphens.");
      return;
    }
    if (password && password.length < 8) {
      setError("A new password needs at least 8 characters.");
      return;
    }

    let failed = await updateProfile(user.id, {
      displayName: name.trim(),
      handle: cleanHandle,
    });
    if (!failed && password) {
      failed =
        (await supabase.auth.updateUser({ password })).error?.message ?? null;
    }
    setError(failed);
    if (!failed) {
      setPassword("");
      setStatus("Saved.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const removeAccount = async () => {
    if (
      !window.confirm(
        "Delete your account and every book on it? This cannot be undone.",
      )
    )
      return;
    const failed = await deleteAccount();
    if (failed) setError(failed);
    else navigate({ to: "/" });
  };

  return (
    <Dialog isOpen={true} onClose={goBack}>
      <DialogTitle>Profile Settings</DialogTitle>
      <DialogContent>
        <form className="form" onSubmit={save}>
          <label className="label" htmlFor="name">
            Display Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={user?.email ?? ""}
            disabled
          />

          <label className="label" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p role="alert">{error}</p>}
          {status && <p role="status">{status}</p>}
          <div className="actions" style={{ gap: "8px" }}>
            <button type="submit" className="button submit">
              Save
            </button>
          </div>
        </form>

        <div className="actions" style={{ gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="button" onClick={signOut}>
            Sign Out
          </button>
          <button type="button" className="button" onClick={removeAccount}>
            Delete account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
