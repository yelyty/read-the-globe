import { SunIcon, MoonStarsIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import * as s from "./ThemeButton.css";

const THEME_KEY = "rtg-theme";
const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

const ThemeButton = () => {
  const [dark, setDark] = useState(() => {
    const picked = document.documentElement.dataset.theme;
    return picked ? picked === "dark" : darkQuery().matches;
  });

  useEffect(() => {
    const query = darkQuery();
    const follow = () => {
      if (!document.documentElement.dataset.theme) setDark(query.matches);
    };
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      //
    }
    setDark(!dark);
  };

  return (
    <button
      type="button"
      className={s.themeBtn}
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Night mode"
    >
      {dark ? (
        <SunIcon aria-hidden="true" />
      ) : (
        <MoonStarsIcon aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeButton;
