import { useEffect, useMemo, useRef, useState } from 'react';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import {
  DownloadSimpleIcon,
  PushPinIcon,
  ShareFatIcon,
} from '@phosphor-icons/react';
import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { atlasMarks } from '../../utils/atlasMarks';
import { updateProfile } from '../../api/Profile/updateProfile';
import type { SavedPostcard } from '../../api/Profile/getProfile';
import type { Goal } from '../../types';
import {
  COLORS,
  KINDS,
  PAPERS,
  SIZE,
  drawPostcard,
  loadCountries,
  postcardStats,
  type Country,
  type Kind,
  type Options,
} from './drawPostcard';
import { GOAL_H, GOAL_W, drawGoalCard, goalCardName } from './drawGoalCard';
import { bookYears, yearSum } from './yearSum';
import { goalProgress, plural } from '../GoalsPage/goals';
import * as s from './PostCardPage.css';
import PageTitle from '../../components/PageTitle/PageTitle';
import Logo from '../../components/Logo/Logo';
import Hint from '../../components/Hint/Hint';

const app = getRouteApi('/app');
const route = getRouteApi('/app/postcard');

// which card: the atlas's (both null), a year's, or a reached goal's
type CardOptions = Options & { goal: number | null; year: string | null };

const DEFAULTS: CardOptions = {
  kind: 'authors',
  count: 0,
  frame: 'perforated',
  color: null,
  paper: 'paper',
  goal: null,
  year: null,
};

// the reader's saved set-up, field by field: an unknown or older value falls back to the default
const oneOf = <T,>(values: readonly T[], v: unknown, fallback: T) =>
  values.find((x) => x === v) ?? fallback;
const keys = <T extends object>(o: T) => Object.keys(o) as (keyof T)[];
const readOptions = (saved: SavedPostcard): CardOptions => ({
  kind: oneOf(keys(KINDS), saved?.kind, DEFAULTS.kind),
  count: oneOf([0, 3, 6] as const, saved?.count, DEFAULTS.count),
  frame: oneOf(
    ['perforated', 'framed', 'plain'] as const,
    saved?.frame,
    DEFAULTS.frame
  ),
  color: oneOf(keys(COLORS), saved?.color, null),
  paper: oneOf(keys(PAPERS), saved?.paper, DEFAULTS.paper),
  goal: typeof saved?.goal === 'number' ? saved.goal : null,
  year: typeof saved?.year === 'string' ? saved.year : null,
});

const COUNTS = [
  { value: 3, label: 'Top 3' },
  { value: 6, label: 'Top 6' },
  { value: 0, label: 'All' },
] as const;
const FRAMES = [
  { value: 'perforated', label: 'Perforated' },
  { value: 'framed', label: 'Framed' },
  { value: 'plain', label: 'Plain' },
] as const;

// the logo as a picture the canvas can draw: the same SVG the header shows, given its own size
const logoImage = (svg: SVGSVGElement) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute('width', '604');
    copy.setAttribute('height', '610');
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(copy));
  });

const PostcardPage = () => {
  const { books, goals } = app.useLoaderData();
  const profile = route.useLoaderData();
  const search = route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const names = useCountryNames();
  // a reached goal's Postcard link (?goal=) or a year link (?year=) chooses that card over the saved one
  const [options, setOptions] = useState<CardOptions>(() => ({
    ...readOptions(profile?.postcard ?? null),
    ...(search.goal !== undefined && { goal: search.goal, year: null }),
    ...(search.year && { year: search.year, goal: null }),
  }));
  const [countries, setCountries] = useState<Map<string, Country>>();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const marks = useMemo(() => atlasMarks(books), [books]);
  const counts = {
    authors: postcardStats(books, marks, KINDS.authors).countries,
    settings: postcardStats(books, marks, KINDS.settings).countries,
  };
  const stats = postcardStats(books, marks, KINDS[options.kind]);
  const firstName = String(profile?.displayName ?? user?.signUpName ?? '')
    .trim()
    .split(/\s+/)[0];

  // the cards there are: the atlas, one per year with books, one per reached goal.
  // ponytail: "reached" is the date GoalsPage stamps, not a fresh count, so a card waits for a visit to Goals
  const years = bookYears(books);
  const reached = goals.filter((g) => g.reachedOn);
  const goal = reached.find((g) => g.id === options.goal) ?? null;
  const year =
    !goal && options.year && years.includes(options.year) ? options.year : null;
  const Y = useMemo(
    () => (year ? yearSum(year, books, goals) : null),
    [year, books, goals]
  );
  const shapes = useMemo(
    () =>
      Object.fromEntries([...(countries ?? [])].map(([k, v]) => [k, v.shape])),
    [countries]
  );
  const progress = (g: Goal) => goalProgress(g, marks, books, shapes);
  const title = year
    ? firstName
      ? `${firstName}’s ${year}`
      : `My ${year}`
    : firstName
      ? `${firstName}’s Reading Atlas`
      : 'My Reading Atlas';
  const color = options.color ?? (year ? 'green' : KINDS[options.kind].color);
  const which = goal ? `goal:${goal.id}` : year ? `year:${year}` : 'atlas';

  const set = (change: Partial<CardOptions>) => {
    setStatus('');
    setOptions((o) => ({ ...o, ...change }));
  };

  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  // the link's choice is in the options now; the address goes back to plain /app/postcard
  useEffect(() => {
    if (search.goal !== undefined || search.year)
      navigate({ to: '/app/postcard', search: {}, replace: true });
  }, [search, navigate]);

  // the set-up saves with the reader's profile, a moment after the last change
  const savedJson = useRef(JSON.stringify(options));
  useEffect(() => {
    const json = JSON.stringify(options);
    if (json === savedJson.current || !user) return;
    const t = setTimeout(() => {
      savedJson.current = json;
      updateProfile(user.id, { postcard: options }).then(
        (problem) => problem && console.error(problem)
      );
    }, 600);
    return () => clearTimeout(t);
  }, [options, user]);

  useEffect(() => {
    const cv = canvas.current;
    const svg = logoRef.current?.querySelector('svg');
    if (!cv || !countries) return;
    let stale = false;
    (svg ? logoImage(svg) : Promise.resolve(null)).then((logo) => {
      if (stale) return;
      if (goal)
        drawGoalCard({
          canvas: cv,
          goal,
          progress: goalProgress(goal, marks, books, shapes),
          books,
          marks,
          names,
          countries,
          paper: options.paper,
          first: firstName,
          logo,
        });
      else
        drawPostcard({
          canvas: cv,
          books,
          marks,
          names,
          countries,
          options,
          title,
          logo,
          year: Y,
        });
    });
    return () => {
      stale = true;
    };
  }, [
    books,
    marks,
    names,
    options,
    title,
    countries,
    shapes,
    goal,
    Y,
    firstName,
  ]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) =>
      canvas.current
        ? canvas.current.toBlob(resolve, 'image/png')
        : resolve(null)
    );
  const fileName = () =>
    goal
      ? goalCardName(goal)
      : year
        ? `read-the-globe-${year}-postcard.png`
        : `read-the-globe-postcard-${new Date().toISOString().slice(0, 10)}.png`;
  const save = (blob: Blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
  };

  const onSave = async () => {
    setBusy('save');
    const blob = await toBlob();
    setBusy(null);
    if (!blob) return;
    save(blob);
    setStatus('Postcard saved to your downloads.');
  };

  // the device's own share sheet, which lists every app the reader has; without one, the card saves instead
  const onShare = async () => {
    setBusy('share');
    const blob = await toBlob();
    setBusy(null);
    if (!blob) return;
    const file = new File([blob], fileName(), { type: 'image/png' });
    if (!navigator.canShare?.({ files: [file] })) {
      save(blob);
      setStatus(
        'This browser can’t open a share sheet, so the postcard saved to your downloads. Attach it in any app.'
      );
      return;
    }
    try {
      await navigator.share({
        files: [file],
        title: goal ? `Goal reached: ${goal.name}` : 'My reading atlas',
        text: goal
          ? `I reached ${goal.name} on my reading atlas.`
          : Y
            ? `My ${Y.line}`
            : KINDS[options.kind].share(stats.countries),
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus(
          'That app couldn’t take the postcard. Try Save postcard instead.'
        );
    }
  };

  if (!books.length) {
    return (
      <>
        <PageTitle>Your postcard</PageTitle>
        <div className={s.empty}>
          <h2>Your postcard is blank</h2>
          <p>
            Every country your authors come from, or your stories are set in,
            becomes a stamp here. Log the last book you loved and the postcard
            is ready to send.
          </p>
          <Link
            className={s.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            Log a book
          </Link>
        </div>
      </>
    );
  }

  const label = () => {
    if (goal) {
      const p = progress(goal);
      return `A postcard: Greetings from ${goal.name}. ${p.done} of ${goal.kind === 'theme' ? plural(p.total, 'book') : plural(p.total, 'country', 'countries')}, postmarked Goal reached.`;
    }
    if (Y)
      return `Your year-end postcard. ${Y.line} ${plural(Y.books.length, 'book')}, with a stamp for each country.`;
    return `Your postcard: ${KINDS[options.kind].name.toLowerCase()}. ${stats.countries} of 195 countries, ${stats.books} books, ${stats.continents} continents, with a stamp for each country.`;
  };

  return (
    <>
      <PageTitle>Your Postcard</PageTitle>
      {/* the logo the card draws in its header */}
      <div ref={logoRef} hidden>
        <Logo />
      </div>

      <div className={s.layout}>
        <div className={s.stage}>
          <div className={s.card}>
            <canvas
              ref={canvas}
              className={s.canvas}
              width={goal ? GOAL_W : SIZE}
              height={goal ? GOAL_H : SIZE}
              role="img"
              aria-label={label()}
            />
          </div>
          <p className={s.foot}>
            {goal
              ? 'Saved as a 1500 × 1000 picture.'
              : 'Saved as a 1080 × 1080 picture.'}
          </p>
        </div>

        <div>
          <section aria-labelledby="pc-setup-title">
            <h2 className={s.h2} id="pc-setup-title">
              Set up your postcard
            </h2>
            <div className={s.fields}>
              <div>
                <label className={s.label} htmlFor="pc-card">
                  Postcard
                </label>
                <select
                  id="pc-card"
                  className={s.select}
                  value={which}
                  onChange={(e) => {
                    const [card, v] = e.target.value.split(':');
                    set({
                      goal: card === 'goal' ? Number(v) : null,
                      year: card === 'year' ? v : null,
                    });
                  }}
                >
                  <option value="atlas">Your reading atlas</option>
                  {years.map((y) => (
                    <option key={y} value={`year:${y}`}>
                      {`${y} in books`}
                    </option>
                  ))}
                  {reached.map((g) => (
                    <option key={g.id} value={`goal:${g.id}`}>
                      {`Goal: ${g.name}`}
                    </option>
                  ))}
                </select>
                {!reached.length && (
                  <Hint>Reach a goal and its postcard joins the list.</Hint>
                )}
              </div>
              {/* a year card takes both kinds of country; a goal's card has none */}
              {!year && !goal && (
                <div>
                  <span className={s.label} id="pc-kind-label">
                    Countries
                  </span>
                  <div
                    className={s.kinds}
                    role="group"
                    aria-labelledby="pc-kind-label"
                  >
                    {(Object.keys(KINDS) as Kind[]).map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        className={s.kind}
                        data-kind={kind}
                        aria-pressed={options.kind === kind}
                        onClick={() => set({ kind })}
                      >
                        <span className={s.kindStamp} aria-hidden="true" />
                        <b className={s.kindN}>{counts[kind]}</b>
                        <span className={s.kindName}>{KINDS[kind].name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className={s.label} id="pc-paper-label">
                  Background
                </span>
                <div
                  className={s.papers}
                  role="group"
                  aria-labelledby="pc-paper-label"
                >
                  {(Object.keys(PAPERS) as Options['paper'][]).map((paper) => (
                    <button
                      key={paper}
                      type="button"
                      className={s.paper}
                      aria-pressed={options.paper === paper}
                      onClick={() => set({ paper })}
                    >
                      <span
                        className={s.paperChip}
                        style={{ background: PAPERS[paper].fill }}
                        aria-hidden="true"
                      />
                      {PAPERS[paper].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!goal && (
              <details className={s.options}>
                <summary className={s.summary}>
                  Style{' '}
                  <span className={s.summaryNote}>
                    · {options.count ? `Top ${options.count}` : 'All'} stamps,{' '}
                    {options.frame}, {COLORS[color].name.toLowerCase()}
                  </span>
                </summary>
                <div
                  className={s.row}
                  role="group"
                  aria-labelledby="pc-count-label"
                >
                  <span className={s.rowLabel} id="pc-count-label">
                    Stamps
                  </span>
                  <div className={s.pills}>
                    {COUNTS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={s.pill}
                        aria-pressed={options.count === c.value}
                        onClick={() => set({ count: c.value })}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className={s.row}
                  role="group"
                  aria-labelledby="pc-frame-label"
                >
                  <span className={s.rowLabel} id="pc-frame-label">
                    Frame
                  </span>
                  <div className={s.pills}>
                    {FRAMES.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        className={s.pill}
                        aria-pressed={options.frame === f.value}
                        onClick={() => set({ frame: f.value })}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className={s.row}
                  role="group"
                  aria-labelledby="pc-color-label"
                >
                  <span className={s.rowLabel} id="pc-color-label">
                    Colour
                  </span>
                  <div className={s.swatches}>
                    {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map(
                      (key) => (
                        <button
                          key={key}
                          type="button"
                          className={s.swatch}
                          style={{ background: COLORS[key].fill }}
                          aria-pressed={color === key}
                          aria-label={COLORS[key].name}
                          title={COLORS[key].name}
                          onClick={() => set({ color: key })}
                        />
                      )
                    )}
                  </div>
                  <span className={s.colorName} aria-hidden="true">
                    {COLORS[color].name}
                  </span>
                </div>
              </details>
            )}
          </section>

          <section className={s.send} aria-label="Send your postcard">
            <div className={s.actions}>
              <button
                type="button"
                className={s.primary}
                onClick={onSave}
                disabled={!!busy}
                aria-busy={busy === 'save' || undefined}
              >
                <DownloadSimpleIcon aria-hidden="true" />
                {busy === 'save' ? 'Drawing…' : 'Save postcard'}
              </button>
              <button
                type="button"
                className={s.quiet}
                onClick={onShare}
                disabled={!!busy}
                aria-busy={busy === 'share' || undefined}
              >
                <ShareFatIcon aria-hidden="true" />
                {busy === 'share' ? 'Drawing…' : 'Share postcard'}
              </button>
            </div>
            <p className={s.status} role="status">
              {status}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PostcardPage;
