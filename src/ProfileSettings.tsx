import { useState } from "react";
import Dialog, { DialogContent, DialogTitle } from "./components/Dialog";
import TextInput from "./components/TextInput";
import { supabase } from "./utils/supabase";

async function signOut() {
  const { error } = await supabase.auth.signOut();
}

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email] = useState("");

  const goBack = () => null;
  return (
    <Dialog isOpen={true} onClose={goBack}>
      <DialogTitle>Profile Settings</DialogTitle>
      <DialogContent>
        <form>
          <label className="label" htmlFor="name">
            Display Name *
          </label>
          <TextInput
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="label" htmlFor="email">
            Email *
          </label>
          <TextInput
            id="name"
            type="email"
            name="email"
            value={email}
            disabled
          />
        </form>
        <button className="button" onClick={signOut}>
          Sign Out
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
