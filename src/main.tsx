import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./auth.tsx";
import { App } from "./App.tsx";

import "./global.css";
import "./index.css";
import "./theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
