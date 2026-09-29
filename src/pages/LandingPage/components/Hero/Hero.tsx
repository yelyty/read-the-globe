import { MapPinIcon } from "@phosphor-icons/react";
import * as s from "./Hero.css";
import { btnPrimary } from "../LoginDialog/LoginDialog.css";

const Hero = () => {
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
            {/* Todo: fix that classname */}
            <a href="#start" className={btnPrimary}>
              <MapPinIcon weight="fill" aria-hidden="true" />
              Start your atlas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
