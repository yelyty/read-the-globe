import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IconContext } from '@phosphor-icons/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './auth/auth.tsx';
import { queryClient } from './api/queryClient';
import { App } from './App.tsx';
import './styles/global.css.ts';
import './styles/index.css';
import './styles/theme.css.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IconContext.Provider value={{ weight: 'bold' }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </IconContext.Provider>
  </StrictMode>
);
