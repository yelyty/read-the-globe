import { useReveal } from "../../../hooks/useReveal";
import { vars } from "../../../theme.css";
import type { GOALS } from "../../config";
import * as s from "./Goals.css";

type Goal = (typeof GOALS)[number];
type GoalRowProps = {
  goal: Goal;
};

const GoalRow = ({ goal }: GoalRowProps) => {
  const [routeRef, routeRevealed] = useReveal<HTMLDivElement>();

  return (
    <li className={s.goal}>
      <div>
        <div className={s.goalKind}>{goal.kind}</div>
        <div className={s.goalName}>{goal.name}</div>
      </div>
      <div className={s.goalCount}>
        <b>{goal.done}</b> / {goal.total}
      </div>
      <div
        ref={routeRef}
        className={s.route}
        data-revealed={routeRevealed}
        aria-hidden="true"
        style={{ "--p": goal.done / goal.total } as React.CSSProperties}
      >
        <div className={s.routeTrack} />
        <div className={s.routeFill} />
        <svg className={s.routePin} viewBox="0 0 24 24">
          <path
            d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"
            fill="var(--route)"
            stroke={vars.color.surface}
            strokeWidth="1.6"
          />
          <circle cx="12" cy="9" r="2.6" fill={vars.color.success} />
        </svg>
        <svg className={s.routeFlag} viewBox="0 0 16 20">
          <path
            d="M3 19V2"
            stroke={vars.color.textMuted}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M3 3h11l-3.4 3.7L14 10.5H3Z" fill={vars.color.textMuted} />
        </svg>
      </div>
    </li>
  );
};

export default GoalRow;
