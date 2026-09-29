import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./auth/auth.tsx";
import { App } from "./App.tsx";

import "./styles/global.css.ts";
import "./styles/index.css";
import "./styles/theme.css.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
