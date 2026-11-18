import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '../../auth/auth-context';
import * as styles from './LandingPage.css';
import Hero from './features/Hero/Hero';
import Header from './features/Header/Header';
import LoginDialog from './features/LoginDialog/LoginDialog';
import type { AuthMode } from './features/LoginDialog/validate';
import Footer from './features/Footer/Footer';
import LiveAtlas from './features/LiveAtlas/LiveAtlas';
import Features from './features/Features/Features';
import Share from './features/Share/Share';
import Faq from './features/Faq/Faq';
import Closing from './features/Closing/Closing';

/**
 * Shows the landing page, with the sign-in dialog. A reader who is signed in goes to the app.
 */
const LandingPage = () => {
  const [auth, setAuth] = useState<AuthMode | null>(null);
  const openLogIn = useCallback(() => setAuth('login'), []);
  const openSignUp = useCallback(() => setAuth('signup'), []);
  const closeAuth = useCallback(() => setAuth(null), []);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/app' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.page}>
      <Header onLogIn={openLogIn} onSignUp={openSignUp} />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Hero onSignUp={openSignUp} />
        <LiveAtlas />
        <Features />
        <Share onSignUp={openSignUp} />
        <Faq />
        <Closing onSignUp={openSignUp} />
      </main>
      <LoginDialog mode={auth} onMode={setAuth} onClose={closeAuth} />
      <Footer />
    </div>
  );
};

export default LandingPage;
