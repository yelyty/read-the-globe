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

const app = getRouteApi("/app");

// The frame of every signed-in page: header, the page itself, and the book form (?log=true).
const AppLayout = () => {
  const { log, country } = app.useSearch();
  const navigate = useNavigate();
  const router = useRouter();

  const closeForm = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, log: undefined, country: undefined }),
    });
    seedCountries(); // as Dashboard did, until a migration fills in the countries table
    router.invalidate(); // reload the books, so a new one shows on every page
  }, [navigate, router]);

  return (
    <>
      <AppHeader />
      <main className="wrapper">
        <Outlet />
      </main>

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
