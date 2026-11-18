import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '../../auth/auth-context';
import Footer from '../../pages/landing/features/Footer/Footer';
import Header from '../../pages/landing/features/Header/Header';
import LoginDialog from '../../pages/landing/features/LoginDialog/LoginDialog';
import type { AuthMode } from '../../pages/landing/features/LoginDialog/validate';
import { page } from '../../pages/landing/LandingPage.css';
import * as styles from './PublicLayout.css';

type PublicLayoutProps = {
  title: string;
  description: string;
  /** marks text that's still a draft, to be reviewed before launch */
  draft?: boolean;
  /** the body is in the reader's language; otherwise it is English (the company pages aren't translated) */
  translated?: boolean;
  children: ReactNode;
};

/**
 * Shows the layout of a public page: the header, the page, and the footer. It sets the title and the description of the page.
 * The header can open the sign-in dialog. After the reader signs in, the app opens.
 * @param translated - If true, the body is in the language of the reader. If not, it is in English.
 */
const PublicLayout = ({
  title,
  description,
  translated = false,
  children,
}: PublicLayoutProps) => {
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

  const handleLogIn = () => setAuth('login');
  const handleSignUp = () => setAuth('signup');
  const handleAuthClose = () => setAuth(null);

  return (
    <div className={page}>
      <Header onLogIn={handleLogIn} onSignUp={handleSignUp} />
      <main
        id="main"
        tabIndex={-1}
        className={styles.main}
        lang={translated ? undefined : 'en'}
      >
        {children}
      </main>
      <LoginDialog mode={auth} onMode={setAuth} onClose={handleAuthClose} />
      <Footer />
    </div>
  );
};

export default PublicLayout;
