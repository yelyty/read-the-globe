import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../auth/auth-context';
import Footer from '../LandingPage/components/Footer/Footer';
import Header from '../LandingPage/components/Header/Header';
import LoginDialog, {
  type AuthMode,
} from '../LandingPage/components/LoginDialog/LoginDialog';
import { page } from '../LandingPage/LandingPage.css';
import * as s from './CompanyPage.css';

type CompanyPageProps = {
  title: string;
  description: string;
  /** marks text that's still a draft, to be reviewed before launch */
  draft?: boolean;
  /** the body is in the reader's language; otherwise it is English (the company pages aren't translated) */
  translated?: boolean;
  children: ReactNode;
};

const CompanyPage = ({
  title,
  description,
  translated = false,
  children,
}: CompanyPageProps) => {
  const [auth, setAuth] = useState<AuthMode | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && isAuthenticated) navigate({ to: '/app' });
  }, [auth, isAuthenticated, navigate]);

  useEffect(() => {
    document.title = `${title} · Read The Globe`;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description);
  }, [title, description]);

  return (
    <div className={page}>
      <Header
        onLogIn={() => setAuth('login')}
        onSignUp={() => setAuth('signup')}
      />
      <main
        id="main"
        tabIndex={-1}
        className={s.main}
        lang={translated ? undefined : 'en'}
      >
        {children}
      </main>
      <LoginDialog mode={auth} onMode={setAuth} onClose={() => setAuth(null)} />
      <Footer />
    </div>
  );
};

export default CompanyPage;
