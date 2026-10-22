import { PushPinIcon } from "@phosphor-icons/react";
import * as s from "./Hero.css";
import { btnPrimary } from "../LoginDialog/LoginDialog.css";

const Hero = ({ onSignUp }: { onSignUp: () => void }) => {
  return (
    <section className={s.hero} id="top">
      <div className={s.heroCopy}>
        {/* TODO: Add stickers */}
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>
            Read the world.
            <br />
            One book at a time.
          </h1>
          <p className={s.heroSub}>
            Every novel becomes a pin on your own atlas. Log what you read, list
            the places in it and where its author is from, and watch 195
            countries fill in.
          </p>
          <div className={s.heroCta}>
            <button type="button" className={btnPrimary} onClick={onSignUp}>
              <PushPinIcon weight="fill" aria-hidden="true" />
              Start your atlas
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
