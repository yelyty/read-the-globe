import { useEffect, useRef, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Link, useMatchRoute } from "@tanstack/react-router";

import * as s from "./AccountMenu.css";

const AccountMenu = () => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const matchRoute = useMatchRoute();
  const onAccount = Boolean(matchRoute({ to: "/app/account" }));

  //   const signOut = useSignOut();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  });

  return (
    <div ref={root} className={s.menu}>
      <button
        type="button"
        className={s.button}
        data-current={onAccount || undefined}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-menu"
        onClick={() => setOpen((current) => !current)}
      >
        Account <CaretDownIcon className={s.caret} aria-hidden="true" />
      </button>
      <ul id="account-menu" className={s.list} hidden={!open}>
        <li>
          <Link
            className={s.item}
            to="/app/account"
            onClick={() => setOpen(false)}
          >
            Your Account
          </Link>
        </li>
        <li>
          <button
            type="button"
            className={s.item}
            onClick={() => {
              setOpen(false);
              //   signOut();
            }}
          >
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountMenu;
