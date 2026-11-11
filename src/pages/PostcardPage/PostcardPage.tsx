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
import { goalName, goalProgress } from '../GoalsPage/goals';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import * as styles from './PostCardPage.css';
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
const oneOf = <T,>(values: readonly T[], value: unknown, fallback: T) =>
  values.find((item) => item === value) ?? fallback;

const keys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[];

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

const countLabel = (count: number) =>
  count ? m.postcard_top({ n: count }) : m.postcard_all();

const COUNTS = [3, 6, 0] as const;

const FRAMES = {
  perforated: m.postcard_frame_perforated,
  framed: m.postcard_frame_framed,
  plain: m.postcard_frame_plain,
} as const;

const lower = (text: string) => text.toLocaleLowerCase(getLocale());

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
  const reached = goals.filter((candidate) => candidate.reachedOn);
  const goal = reached.find((item) => item.id === options.goal) ?? null;

  const year =
    !goal && options.year && years.includes(options.year) ? options.year : null;

  const yearSummary = useMemo(
    () => (year ? yearSum(year, books, goals) : null),
    [year, books, goals]
  );

  const shapes = useMemo(
    () =>
      Object.fromEntries(
        [...(countries ?? [])].map(([code, country]) => [code, country.shape])
      ),
    [countries]
  );

  const progress = (target: Goal) => goalProgress(target, marks, books, shapes);

  const title = year
    ? firstName
      ? m.postcard_year_named({ name: firstName, year })
      : m.postcard_my({ what: year })
    : firstName
      ? m.postcard_atlas_named({ name: firstName })
      : m.postcard_atlas_mine();

  const color = options.color ?? (year ? 'green' : KINDS[options.kind].color);
  const which = goal ? `goal:${goal.id}` : year ? `year:${year}` : 'atlas';

  const set = (change: Partial<CardOptions>) => {
    setStatus('');
    setOptions((prev) => ({ ...prev, ...change }));
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

    const timer = setTimeout(() => {
      savedJson.current = json;

      updateProfile(user.id, { postcard: options }).then(
        (problem) => problem && console.error(problem)
      );
    }, 600);

    return () => clearTimeout(timer);
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
          year: yearSummary,
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
    yearSummary,
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
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = fileName();
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  };

  const onSave = async () => {
    setBusy('save');
    const blob = await toBlob();

    setBusy(null);
    if (!blob) return;
    save(blob);
    setStatus(m.postcard_saved());
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
      setStatus(m.postcard_no_share_sheet());

      return;
    }

    try {
      await navigator.share({
        files: [file],
        title: goal
          ? m.postcard_share_title_goal({ goal: goalName(goal.name) })
          : m.postcard_share_title(),
        text: goal
          ? m.postcard_share_goal({ goal: goalName(goal.name) })
          : yearSummary
            ? m.postcard_my({ what: yearSummary.line })
            : KINDS[options.kind].share(stats.countries),
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus(m.postcard_share_failed());
    }
  };

  if (!books.length) {
    return (
      <>
        <PageTitle>{m.title_postcard()}</PageTitle>
        <div className={styles.empty}>
          <h2>{m.postcard_blank_title()}</h2>
          <p>{m.postcard_blank_text()}</p>
          <Link
            className={styles.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            {m.log_a_book()}
          </Link>
        </div>
      </>
    );
  }

  const label = () => {
    if (goal) {
      const goalStats = progress(goal);

      const of =
        goal.kind === 'theme' ? m.postcard_of_books : m.postcard_of_countries;

      return m.postcard_label_goal({
        goal: goalName(goal.name),
        progress: of({ done: goalStats.done, count: goalStats.total }),
      });
    }

    if (yearSummary)
      return m.postcard_label_year({
        line: yearSummary.line,
        books: m.count_book({ count: yearSummary.books.length }),
      });

    return m.postcard_label_atlas({
      kind: lower(KINDS[options.kind].name()),
      countries: stats.countries,
      books: m.count_book({ count: stats.books }),
      continents: m.count_continent({ count: stats.continents }),
    });
  };

  return (
    <>
      <PageTitle>{m.title_postcard()}</PageTitle>
      {/* the logo the card draws in its header */}
      <div ref={logoRef} hidden>
        <Logo />
      </div>

      <div className={styles.layout}>
        <div className={styles.stage}>
          <div className={styles.card}>
            <canvas
              ref={canvas}
              className={styles.canvas}
              width={goal ? GOAL_W : SIZE}
              height={goal ? GOAL_H : SIZE}
              role="img"
              aria-label={label()}
            />
          </div>
          <p className={styles.foot}>
            {goal ? m.postcard_size_wide() : m.postcard_size_square()}
          </p>
        </div>

        <div>
          <section aria-labelledby="pc-setup-title">
            <h2 className={styles.h2} id="pc-setup-title">
              {m.postcard_setup()}
            </h2>
            <div className={styles.fields}>
              <div>
                <label className={styles.label} htmlFor="pc-card">
                  {m.nav_postcard()}
                </label>
                <select
                  id="pc-card"
                  className={styles.select}
                  value={which}
                  onChange={(changeEvent) => {
                    const [card, value] = changeEvent.target.value.split(':');

                    set({
                      goal: card === 'goal' ? Number(value) : null,
                      year: card === 'year' ? value : null,
                    });
                  }}
                >
                  <option value="atlas">
                    {m.postcard_your_reading_atlas()}
                  </option>
                  {years.map((yearOption) => (
                    <option key={yearOption} value={`year:${yearOption}`}>
                      {m.postcard_in_books({ year: yearOption })}
                    </option>
                  ))}
                  {reached.map((reachedGoal) => (
                    <option
                      key={reachedGoal.id}
                      value={`goal:${reachedGoal.id}`}
                    >
                      {m.postcard_goal_option({
                        goal: goalName(reachedGoal.name),
                      })}
                    </option>
                  ))}
                </select>
                {!reached.length && <Hint>{m.postcard_reach_hint()}</Hint>}
              </div>
              {/* a year card takes both kinds of country; a goal's card has none */}
              {!year && !goal && (
                <div>
                  <span className={styles.label} id="pc-kind-label">
                    {m.postcard_countries()}
                  </span>
                  <div
                    className={styles.kinds}
                    role="group"
                    aria-labelledby="pc-kind-label"
                  >
                    {(Object.keys(KINDS) as Kind[]).map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        className={styles.kind}
                        data-kind={kind}
                        aria-pressed={options.kind === kind}
                        onClick={() => set({ kind })}
                      >
                        <span className={styles.kindStamp} aria-hidden="true" />
                        <b className={styles.kindN}>{counts[kind]}</b>
                        <span className={styles.kindName}>
                          {KINDS[kind].name()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className={styles.label} id="pc-paper-label">
                  {m.postcard_background()}
                </span>
                <div
                  className={styles.papers}
                  role="group"
                  aria-labelledby="pc-paper-label"
                >
                  {(Object.keys(PAPERS) as Options['paper'][]).map((paper) => (
                    <button
                      key={paper}
                      type="button"
                      className={styles.paper}
                      aria-pressed={options.paper === paper}
                      onClick={() => set({ paper })}
                    >
                      <span
                        className={styles.paperChip}
                        style={{ background: PAPERS[paper].fill }}
                        aria-hidden="true"
                      />
                      {PAPERS[paper].name()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!goal && (
              <details className={styles.options}>
                <summary className={styles.summary}>
                  {m.postcard_style()}{' '}
                  <span className={styles.summaryNote}>
                    {m.postcard_style_note({
                      count: countLabel(options.count),
                      frame: lower(FRAMES[options.frame]()),
                      color: lower(COLORS[color].name()),
                    })}
                  </span>
                </summary>
                <div
                  className={styles.row}
                  role="group"
                  aria-labelledby="pc-count-label"
                >
                  <span className={styles.rowLabel} id="pc-count-label">
                    {m.postcard_stamps()}
                  </span>
                  <div className={styles.pills}>
                    {COUNTS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        className={styles.pill}
                        aria-pressed={options.count === count}
                        onClick={() => set({ count: count })}
                      >
                        {countLabel(count)}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className={styles.row}
                  role="group"
                  aria-labelledby="pc-frame-label"
                >
                  <span className={styles.rowLabel} id="pc-frame-label">
                    {m.postcard_frame()}
                  </span>
                  <div className={styles.pills}>
                    {(Object.keys(FRAMES) as Options['frame'][]).map(
                      (frame) => (
                        <button
                          key={frame}
                          type="button"
                          className={styles.pill}
                          aria-pressed={options.frame === frame}
                          onClick={() => set({ frame: frame })}
                        >
                          {FRAMES[frame]()}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div
                  className={styles.row}
                  role="group"
                  aria-labelledby="pc-color-label"
                >
                  <span className={styles.rowLabel} id="pc-color-label">
                    {m.postcard_colour()}
                  </span>
                  <div className={styles.swatches}>
                    {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map(
                      (key) => (
                        <button
                          key={key}
                          type="button"
                          className={styles.swatch}
                          style={{ background: COLORS[key].fill }}
                          aria-pressed={color === key}
                          aria-label={COLORS[key].name()}
                          title={COLORS[key].name()}
                          onClick={() => set({ color: key })}
                        />
                      )
                    )}
                  </div>
                  <span className={styles.colorName} aria-hidden="true">
                    {COLORS[color].name()}
                  </span>
                </div>
              </details>
            )}
          </section>

          <section className={styles.send} aria-label={m.postcard_send()}>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={onSave}
                disabled={!!busy}
                aria-busy={busy === 'save' || undefined}
              >
                <DownloadSimpleIcon aria-hidden="true" />
                {busy === 'save' ? m.postcard_drawing() : m.postcard_save()}
              </button>
              <button
                type="button"
                className={styles.quiet}
                onClick={onShare}
                disabled={!!busy}
                aria-busy={busy === 'share' || undefined}
              >
                <ShareFatIcon aria-hidden="true" />
                {busy === 'share' ? m.postcard_drawing() : m.postcard_share()}
              </button>
            </div>
            <p className={styles.status} role="status">
              {status}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PostcardPage;
