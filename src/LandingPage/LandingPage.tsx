import * as s from "./LandingPage.css";
import Hero from "./components/Hero/Hero";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth-context";
import { useNavigate } from "@tanstack/react-router";
import Goals from "./components/Goals/Goals";
import Header from "./components/Header/Header";
import LoginDialog from "./components/LoginDialog/LoginDialog";
import Footer from "./components/Footer/Footer";
import SignUp from "./components/SignUp/SignUp";
import Story from "./components/Story/Story";
import Shelf from "./components/Shelf/Shelf";

const LandingPage = () => {
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, navigate]);

  const openLogIn = useCallback(() => setIsLogInOpen(true), []);
  const closeLogIn = useCallback(() => setIsLogInOpen(false), []);

  return (
    <div className={s.page}>
      {/* <a href="main" className={s.skip}>Skip to content</a> */}
      <Header onLogIn={openLogIn} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Story />
        <Shelf />
        <Goals />
        <SignUp onLogIn={openLogIn} />
      </main>
      <LoginDialog open={isLogInOpen} onClose={closeLogIn} />
      <Footer />
    </div>
  );
};

export default LandingPage;
