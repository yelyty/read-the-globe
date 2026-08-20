import * as s from "../LandingPage.css";

const Hero = () => {
  return (
    <section className={s.hero}>
      <div className={s.heroText}>
        <span className={s.kicker}>A reading atlas</span>
        <h1 className={s.head}>
          Read the Globe,
          <br />
          one book at a time.
        </h1>
        <p className={s.sub}>
          Read The Globe turns every novel into a pin on your own atlas. Log
          what you've read, mark where its story is set and where its author is
          from, set goals and watch the Globe slowly fill in.
        </p>
      </div>
    </section>
  );
};
export default Hero;
