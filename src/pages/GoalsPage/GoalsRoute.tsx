import type { CSSProperties } from "react";
import * as s from "./GoalsPage.css";

type GoalRouteProps = { done: number; total: number; theme?: boolean };

export const GoalRoute = ({ done, total, theme }: GoalRouteProps) => {
  const p = Math.min(1, total ? done / total : 0);
  return (
    <div
      className={theme ? `${s.route} ${s.routeTheme}` : s.route}
      style={{ "--p": p } as CSSProperties}
      aria-hidden="true"
    >
      <div className={s.routeTrack} />
      <div className={s.routeFill} />
      {total <= 30 && (
        <div className={s.routeStops}>
          {Array.from({ length: total - 1 }, (_, i) => (
            <i
              key={i}
              className={i + 1 <= done ? s.stopHit : s.stop}
              style={{ "--k": (i + 1) / total } as CSSProperties}
            />
          ))}
        </div>
      )}
      <svg className={s.routePin} viewBox="0 0 24 24">
        <path
          d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="9" r="2.6" />
      </svg>
      <svg className={s.routeFlag} viewBox="0 0 16 20">
        <path
          className={s.flagPole}
          d="M3 19V2"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path className={s.flagCloth} d="M3 3h11l-3.4 3.7L14 10.5H3Z" />
      </svg>
    </div>
  );
};
