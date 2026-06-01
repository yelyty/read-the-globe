import type { CSSProperties } from "react";

type IconProps = {
  style: CSSProperties;
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
  const isDark = "dark";

  const toggle = () => {};
  return (
    <button
      type="button"
      role="switch"
      aria-label="Toggle dark mode"
      onClick={toggle}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 48,
        height: 24,
        padding: "0 5px",
        borderRadius: 999,
        background: "var(--color-surface)",
        border: "1px solid var(--color-stroke)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <SunIcon
        style={{
          width: 12,
          height: 12,
          color: isDark
            ? "var(--color-text-disabled)"
            : "var(--color-secondary)",
          transition: "color .2s ease",
        }}
      />
      <MoonIcon
        style={{
          width: 12,
          height: 12,
          color: isDark
            ? "var(--color-secondary)"
            : "var(--color-text-disabled)",
          transition: "color .2s ease",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "var(--color-primary)",
          transform: isDark ? "translateX(24px)" : "translateX(0)",
          transition: "transform .2s ease",
        }}
      />
    </button>
  );
}
