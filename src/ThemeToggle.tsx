import { useState } from "react";
import type { CSSProperties } from "react";

type IconProps = {
  style: CSSProperties;
};

const iconBase: CSSProperties = {
  width: 28,
  height: 28,
  position: "relative",
  zIndex: 1,
  transition: "color .2s ease",
};

function SunIcon({ style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr) return attr === "dark";
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        next ? "dark" : "light",
      );
      return next;
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggle}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        width: 70,
        height: 39,
        padding: "0 5px",
        borderRadius: "var(--radius)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-stroke)",
        cursor: "pointer",
        flexShrink: 0,
        zIndex: 1000,
      }}
    >
      <SunIcon
        style={{
          ...iconBase,
          color: isDark
            ? "var(--color-text-disabled)"
            : "var(--color-secondary)",
        }}
      />
      <MoonIcon
        style={{
          ...iconBase,
          color: isDark
            ? "var(--color-secondary)"
            : "var(--color-text-disabled)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: 4,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "var(--color-primary)",
          transform: isDark ? "translate(30px, -50%)" : "translate(0, -50%)",
          transition: "transform .2s ease",
        }}
      />
    </button>
  );
}
