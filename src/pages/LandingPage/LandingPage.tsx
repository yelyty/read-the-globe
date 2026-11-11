import * as styles from './LandingPage.css';
import Hero from './components/Hero/Hero';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth/auth-context';
import { useNavigate } from '@tanstack/react-router';
import Header from './components/Header/Header';
import LoginDialog, {
  type AuthMode,
} from './components/LoginDialog/LoginDialog';
import Footer from './components/Footer/Footer';
import LiveAtlas from './components/LiveAtlas/LiveAtlas';
import Features from './components/Features/Features';
import Share from './components/Share/Share';
import Faq from './components/Faq/Faq';
import Closing from './components/Closing/Closing';

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
