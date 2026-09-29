import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MapPinIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import {
  ANTARCTICA,
  MAP,
  SPINES,
  STORY_BOOKS,
  STORY_COUNTS,
  STORY_DWELL_MS,
  STORY_FRAMES,
  STORY_MARKS,
  STORY_STEPS,
  STORY_TYPE_MS,
  STORY_ZOOM,
  type DemoBook,
} from "./storyConfig";
import * as s from "./Story.css";
import { GEO_URL } from "../../config";

type Form = DemoBook;
type FormField = keyof Form;

const FIELDS: FormField[] = [
  "title",
  "author",
  "country",
  "place",
  "placeCountry",
];
const EMPTY: Form = {
  title: "",
  author: "",
  country: "",
  place: "",
  placeCountry: "",
};
const LAST = STORY_STEPS.length;
const MARKS = new Map(STORY_MARKS.map((m) => [m.id, m]));

/** the form as it looks once step n is done (0 = empty) */
const formFor = (n: number): Form =>
  n ? { ...STORY_BOOKS[n >= 3 ? 3 : 1] } : EMPTY;
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* On request, the log-a-book form fills in and the result lands on a framed atlas.
   `copy` is the step whose words show; `step` is how far the marks, camera and count have landed. */
const Story = () => {
  const [step, setStep] = useState(0);
  const [copy, setCopy] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [filled, setFilled] = useState(0);
  const [typing, setTyping] = useState<FormField | null>(null);
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [status, setStatus] = useState("");
  const [size, setSize] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  // The demo is an async sequence; each wait checks it still belongs to the current run,
  // so Pause or a step button cancels it mid-word.
  const run = useRef(0);
  const stepNow = useRef(0);
  const copyNow = useRef(1);
  const countNow = useRef(0);
  const playingNow = useRef(false);
  const timers = useRef<{ count?: number; tick?: number }>({});

  const wait = (ms: number, id: number) =>
    new Promise<void>((resolve, reject) =>
      window.setTimeout(() => (id === run.current ? resolve() : reject()), ms),
    );

  const setPlay = (value: boolean) => {
    playingNow.current = value;
    setPlaying(value);
  };

  const show = (n: number) => {
    copyNow.current = n;
    setCopy(n);
  };

  const fill = (n: number) => {
    setTyping(null);
    setPressed(false);
    setForm(formFor(n));
    setFilled(n);
  };

  /** the map: marks, camera and count once step n has landed */
  const land = (n: number) => {
    if (stepNow.current === n) return;
    stepNow.current = n;
    setStep(n);
    const to = STORY_COUNTS[n];
    window.clearInterval(timers.current.count);
    // the world view counts up from the last step, so the jump reads as books adding up
    if (n === LAST && to > countNow.current + 1 && !reduced()) {
      timers.current.count = window.setInterval(() => {
        countNow.current += 1;
        setCount(countNow.current);
        if (countNow.current >= to) window.clearInterval(timers.current.count);
      }, 110);
    } else {
      countNow.current = to;
      setCount(to);
    }
    if (n)
      setStatus(
        `${STORY_STEPS[n - 1].title} ${to} of 195 countries on the example atlas.`,
      );
    setTicking(true);
    window.clearTimeout(timers.current.tick);
    timers.current.tick = window.setTimeout(() => setTicking(false), 450);
  };

  const type = async (field: FormField, text: string, id: number) => {
    setTyping(field);
    let typed = "";
    setForm((current) => ({ ...current, [field]: typed }));
    for (const character of text) {
      if (!reduced()) await wait(STORY_TYPE_MS, id);
      typed += character;
      const value = typed;
      setForm((current) => ({ ...current, [field]: value }));
    }
    await wait(reduced() ? 150 : 300, id);
    setTyping(null);
  };

  const playStep = async (n: number, id: number) => {
    show(n);
    if (n === 1 || n === 3) {
      const book = STORY_BOOKS[n];
      fill(0);
      await wait(450, id);
      for (const field of FIELDS) await type(field, book[field], id);
      setPressed(true);
      await wait(220, id);
      setPressed(false);
    } else if (n === 2) {
      fill(2);
    }
    land(n);
    await wait(n === LAST ? 600 : STORY_DWELL_MS, id);
  };

  const play = async () => {
    const id = ++run.current;
    setPlay(true);
    setTouched(true);
    let from = copyNow.current;
    if (stepNow.current >= LAST) {
      // watch again from the empty world
      land(0);
      fill(0);
      from = 1;
    } else if (stepNow.current >= from) {
      // this step already landed: carry on from the next
      from += 1;
    }
    try {
      for (let n = from; n <= LAST; n++) await playStep(n, id);
    } catch {
      return; // cancelled by Pause, a step button, or the plate leaving the screen
    }
    setPlay(false);
  };

  const stop = () => {
    run.current += 1;
    setPlay(false);
    setTyping(null);
    setPressed(false);
  };

  const go = (n: number) => {
    setTouched(true);
    stop();
    show(n);
    fill(n);
    land(n);
  };

  // Frame the step into the part of the plate the panel does not cover.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const panel = panelRef.current;
    const world = worldRef.current;
    if (!frame || !panel || !world) return;
    const W = frame.clientWidth;
    const H = frame.clientHeight;
    if (!W || !H) return;
    const k = Math.min(W / MAP.width, H / MAP.height);
    const ox = (W - MAP.width * k) / 2;
    const oy = (H - MAP.height * k) / 2;
    const top = window.innerWidth >= 640 ? 60 : 44;
    const right = panel.offsetLeft + panel.offsetWidth;
    const area =
      step === LAST
        ? { x: 0, y: top, w: W, h: Math.max(120, panel.offsetTop - top - 8) } // the panel is a caption below
        : window.innerWidth >= 1000
          ? { x: right, y: 0, w: W - right, h: H } // beside the panel
          : { x: 0, y: 44, w: W, h: Math.max(120, panel.offsetTop - 56) }; // above it
    const [x0, y0, x1, y1] = STORY_FRAMES[step];
    const [wx0, wy0, wx1, wy1] = STORY_FRAMES[0];
    const fillShare = step === 0 || step === LAST ? 0.94 : 0.8;
    const worldScale = Math.min(
      (W * 0.94) / ((wx1 - wx0) * k),
      (H * 0.94) / ((wy1 - wy0) * k),
    );
    const scale = Math.min(
      (area.w * fillShare) / ((x1 - x0) * k),
      (area.h * fillShare) / ((y1 - y0) * k),
      worldScale * STORY_ZOOM,
    );
    const tx = (area.x + area.w / 2 - ox) / k - (scale * (x0 + x1)) / 2;
    const ty = (area.y + area.h / 2 - oy) / k - (scale * (y0 + y1)) / 2;
    world.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${scale.toFixed(3)})`;
    // the first framing is placed, not flown to
    if (!world.dataset.ready)
      requestAnimationFrame(() => (world.dataset.ready = "true"));
  }, [step, copy, size]);

  useEffect(() => {
    const frame = frameRef.current;
    const pending = timers.current;
    if (!frame) return;
    const resize = new ResizeObserver(() => setSize((n) => n + 1));
    resize.observe(frame);
    // nobody is watching once the plate scrolls away, so the demo stops there
    const visible = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && playingNow.current) stop();
    });
    visible.observe(frame);
    return () => {
      resize.disconnect();
      visible.disconnect();
      run.current += 1;
      window.clearInterval(pending.count);
      window.clearTimeout(pending.tick);
    };
    // stop only touches refs and state setters, so the first render's copy stays correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resting = !playing && step === 0;
  const world = step === 0 || step === LAST;

  const input = (field: FormField, placeholder: string) => (
    <span
      className={s.input}
      data-typing={typing === field}
      data-placeholder={placeholder}
    >
      {form[field]}
    </span>
  );

  return (
    <section
      id="how"
      className={s.story}
      data-step={step}
      data-copy={copy}
      aria-labelledby="story-title"
    >
      <h2 className={s.srOnly} id="story-title">
        How your atlas fills in
      </h2>
      <p className={s.srOnly} role="status">
        {status}
      </p>

      <div className={s.pin}>
        {/* <div className={page.tape} aria-hidden="true" /> */}
        <div className={`${s.exampleTag} ${s.exampleTag}`}>Example</div>
        <div ref={frameRef} className={s.frame}>
          <div className={s.stage} aria-hidden="true">
            <ComposableMap
              projection="geoEqualEarth"
              width={MAP.width}
              height={MAP.height}
              projectionConfig={{ scale: MAP.scale }}
              className={s.map}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* at world scale the 2-unit stripes blur into brown, so they widen */}
                <pattern
                  id="story-both-hatch"
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                  patternTransform={`rotate(45) scale(${world ? 1.75 : 1})`}
                >
                  <rect className={s.hatchSet} width="2" height="4" />
                  <rect className={s.hatchAuthor} x="2" width="2" height="4" />
                </pattern>
              </defs>
              <g ref={worldRef} className={s.world}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => [
                    ...geographies
                      .filter((geo) => geo.id !== ANTARCTICA)
                      .map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className={s.land}
                          tabIndex={-1}
                          role={undefined}
                        />
                      )),
                    ...geographies
                      .filter((geo) => MARKS.has(geo.id))
                      .map((geo) => {
                        const m = MARKS.get(geo.id)!;
                        const both =
                          m.bothFrom !== undefined && step >= m.bothFrom;
                        const landed =
                          step >= m.from
                            ? both
                              ? s.landedAgain
                              : s.landed
                            : "";
                        return (
                          <Geography
                            key={`${geo.rsmKey}-mark`}
                            geography={geo}
                            className={`${s.mark[both ? "both" : m.mark]} ${landed}`}
                            tabIndex={-1}
                            role={undefined}
                          />
                        );
                      }),
                  ]}
                </Geographies>
              </g>
            </ComposableMap>

            <div className={s.legend}>
              <span>
                <i className={s.dot.set} />
                Where it’s set
              </span>
              <span>
                <i className={s.dot.author} />
                Author’s country
              </span>
              <span>
                <i className={s.swatch} />
                Both
              </span>
            </div>
            <div className={s.count}>
              <b className={s.countNum} data-ticking={ticking}>
                {count}
              </b>
              <span className={s.countOf}>/ 195</span>
              <span className={s.countLabel}>countries</span>
            </div>
          </div>

          <div ref={panelRef} className={s.panel}>
            <div className={s.controls}>
              <button
                type="button"
                className={s.play}
                aria-pressed={playing}
                onClick={() => (playing ? stop() : void play())}
              >
                {playing ? (
                  <PauseIcon weight="fill" aria-hidden="true" />
                ) : (
                  <PlayIcon weight="fill" aria-hidden="true" />
                )}
                {playing
                  ? "Pause"
                  : step >= LAST
                    ? "Watch again"
                    : "Watch how it works"}
              </button>
              <div className={s.stepButtons} role="group" aria-label="Steps">
                {STORY_STEPS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={s.stepButton}
                    aria-pressed={touched && copy === i + 1}
                    aria-labelledby={`story-step${i + 1}-title`}
                    onClick={() => go(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <ol className={s.steps}>
              {STORY_STEPS.map((item, i) => {
                const n = i + 1;
                return (
                  <li
                    key={n}
                    className={s.step}
                    data-active={copy === n}
                    data-last={n === LAST}
                  >
                    <h3 className={s.stepTitle}>
                      <span className={s.stepN} data-current={step === n}>
                        {n}
                      </span>
                      <span id={`story-step${n}-title`}>{item.title}</span>
                    </h3>
                    <p className={s.stepText}>{item.text}</p>
                    {item.log && <p className={s.srOnly}>{item.log}</p>}
                    {n === LAST && (
                      <p className={s.books}>
                        {SPINES.map((book) => book.title).join(" · ")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>

            <div
              className={s.form}
              aria-hidden="true"
              data-resting={resting}
              onClick={resting ? () => void play() : undefined}
            >
              <div className={s.field}>
                <span className={s.fieldLabel}>Title</span>
                {input("title", "What is it called?")}
              </div>
              <div className={s.field}>
                <span className={s.fieldLabel}>Author</span>
                {input("author", "Who wrote it?")}
              </div>
              <div
                className={`${s.field} ${s.fieldWide}`}
                data-lit={filled === 2}
              >
                <span className={s.fieldLabel}>
                  <i className={s.dot.author} />
                  Author’s country
                </span>
                {input("country", "Where are they from?")}
              </div>
              <div className={`${s.field} ${s.fieldWide}`}>
                <span className={s.fieldLabel}>
                  <i className={s.dot.set} />
                  Places in the book
                </span>
                <span className={s.placeRow}>
                  {input("place", "City or region")}
                  {input("placeCountry", "Country")}
                </span>
              </div>
              <span className={s.pinButton} data-pressed={pressed}>
                <MapPinIcon weight="fill" />
                Pin it
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
