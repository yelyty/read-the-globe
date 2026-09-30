import { useCallback } from "react";
import {
  getRouteApi,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import AddBook from "../../AddBook";
import { seedCountries } from "../../api/saveBook";

import Dialog, { DialogContent, DialogTitle } from "../Dialog/Dialog";
import "../../App.css";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../AppFooter/AppFooter";
import * as s from "./AppLayout.css";

const app = getRouteApi("/app");

const AppLayout = () => {
  const { log, country } = app.useSearch();
  const navigate = useNavigate();
  const router = useRouter();

  const closeForm = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, log: undefined, country: undefined }),
    });
    seedCountries();
    router.invalidate();
  }, [navigate, router]);

  return (
    <>
      <div className={s.shell}>
        <AppHeader />
        <main className={`wrapper ${s.main}`}>
          <Outlet />
        </main>
        <AppFooter />
      </div>

      <Dialog isOpen={Boolean(log)} onClose={closeForm}>
        <DialogTitle>What have you read?</DialogTitle>
        <DialogContent>
          <AddBook
            selectedCountry={{ code: country ?? "", name: "" }}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppLayout;
