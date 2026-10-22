import * as s from "./LandingPage.css";
import Hero from "./components/Hero/Hero";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/auth-context";
import { useNavigate } from "@tanstack/react-router";
import Goals from "./components/Goals/Goals";
import Header from "./components/Header/Header";
import LoginDialog, {
  type AuthMode,
} from "./components/LoginDialog/LoginDialog";
import Footer from "./components/Footer/Footer";
import Shelf from "./components/Shelf/Shelf";

const LandingPage = () => {
  const [auth, setAuth] = useState<AuthMode | null>(null);
  const openLogIn = useCallback(() => setAuth("login"), []);
  const openSignUp = useCallback(() => setAuth("signup"), []);
  const closeAuth = useCallback(() => setAuth(null), []);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={s.page}>
      {/* <a href="main" className={s.skip}>Skip to content</a> */}
      <Header onLogIn={openLogIn} onSignUp={openSignUp} />
      <main id="main" tabIndex={-1}>
        <Hero onSignUp={openSignUp} />
        <Shelf />
        <Goals />
      </main>
      <LoginDialog mode={auth} onMode={setAuth} onClose={closeAuth} />
      <Footer />
    </div>
  );
};

export default LandingPage;
