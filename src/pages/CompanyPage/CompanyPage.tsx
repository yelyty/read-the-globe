import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/auth-context";
import Footer from "../LandingPage/components/Footer/Footer";
import Header from "../LandingPage/components/Header/Header";
import LoginDialog from "../LandingPage/components/LoginDialog/LoginDialog";
import { page } from "../LandingPage/LandingPage.css";
import * as s from "./CompanyPage.css";

type CompanyPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const CompanyPage = ({ title, description, children }: CompanyPageProps) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginOpen && isAuthenticated) navigate({ to: "/app" });
  }, [loginOpen, isAuthenticated, navigate]);

  useEffect(() => {
    document.title = `${title} · Read The Globe`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);

  return (
    <div className={page}>
      <Header onLogIn={() => setLoginOpen(true)} />
      <main id="main" tabIndex={-1} className={s.main}>
        {children}
      </main>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Footer />
    </div>
  );
};

export default CompanyPage;
