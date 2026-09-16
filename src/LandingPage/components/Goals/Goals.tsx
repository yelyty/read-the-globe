// import { MapTrifoldIcon, PushPinIcon } from "@phosphor-icons/react";
import { useReveal } from "../../../hooks/useReveal";
import { GOALS } from "../../config";
import GoalRow from "./GoalRow";
import * as s from "./Goals.css";
import { section } from "../../LandingPage.css";

const Goals = () => {
  const [headRef, headRevealed] = useReveal<HTMLDivElement>();

  return (
    <section id="goals" className={section}>
      {/* <PushPinIcon weight="thin" className={s.marg.pin} aria-hidden="true" />
      <MapTrifoldIcon weight="thin" className={s.marg.map} aria-hidden="true" /> */}
      <div
        ref={headRef}
        className={`${s.goalsHead} ${s.reveal}`}
        data-revealed={headRevealed}
      >
        <h2 className={s.h2Small}>Aim somewhere you haven't read yet.</h2>
        <p className={s.goalsLede}>
          Books you log count toward goals automatically; tick off the rest by
          hand.
        </p>
      </div>
      <ul className={s.goalsList}>
        {GOALS.map((goal) => (
          <GoalRow key={goal.name} goal={goal} />
        ))}
      </ul>
    </section>
  );
};

export default Goals;
