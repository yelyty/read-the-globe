import { useState } from "react";
import { supabase } from "./utils/supabase";
import Dialog, { DialogContent, DialogTitle } from "./components/Dialog";
import TextInput from "./components/TextInput";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog isOpen={isDialogOpen} onClose={closeDialog} canClose={false}>
      <DialogTitle>Welcome back!</DialogTitle>
      <DialogContent>
        <div className="login-wrapper">
          <label className="label" htmlFor="email">
            Email *
          </label>
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label" htmlFor="password">
            Password *
          </label>
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error">{error}</div>}

          <button
            onClick={signIn}
            disabled={loading}
            className="login-button button"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
