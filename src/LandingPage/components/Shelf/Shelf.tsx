import { useReveal } from "../../../hooks/useReveal";
import * as s from "./Shelf.css";
import { section } from "../../LandingPage.css";
import { reveal } from "../Goals/Goals.css";
import ShelfImage from "./ShelfImage";

const Shelf = () => {
  const [textRef, textRevealed] = useReveal<HTMLDivElement>();

  return (
    <section id="features" className={section}>
      <div className={s.shelfBlock}>
        <div ref={textRef} className={reveal} data-revealed={textRevealed}>
          <h2 className={s.h2}>Your shelf is already a map.</h2>
          <p className={s.lede}>Every spine leads somewhere in the world.</p>
          <p className={s.shelfNote}>
            Every book leaves two marks: where its story is set, and where its
            author calls home.
          </p>
        </div>
        <div>
          <ShelfImage />
        </div>
      </div>
    </section>
  );
};

export default Shelf;
