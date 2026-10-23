import { Outlet } from "@tanstack/react-router";

import "../../App.css";

import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../AppFooter/AppFooter";

import * as s from "./AppLayout.css";
import LogBook from "../LogBook/LogBook";

const AppLayout = () => {
  return (
    <>
      <div className={s.shell}>
        <AppHeader />
        <main className={`wrapper ${s.main}`}>
          <Outlet />
        </main>
        <AppFooter />
        <LogBook />
      </div>
    </>
  );
};

export default AppLayout;
