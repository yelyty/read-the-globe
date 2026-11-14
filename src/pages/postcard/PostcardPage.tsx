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
import type { Goal } from '../../types';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import Logo from '../../components/Logo/Logo';
import Hint from '../../components/Hint/Hint';
import Select from '../../components/Select/Select';
import { isoDay } from '../../utils/isoDate';
import { lower } from '../../utils/text';
import { goalName, goalProgress } from '../goals/goals';
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
import * as styles from './PostCardPage.css';
import { logoImage } from './logoImage';
import {
  type CardOptions,
  countLabel,
  COUNTS,
  readOptions,
} from './cardOptions';

const app = getRouteApi('/app');
const route = getRouteApi('/app/postcard');
// the set-up is saved once the reader stops changing it for this long
const SAVE_DELAY_MS = 600;

const FRAMES = {
  perforated: m.postcard_frame_perforated,
  framed: m.postcard_frame_framed,
  plain: m.postcard_frame_plain,
} as const;

// the choices in the order they're offered
const KIND_KEYS = Object.keys(KINDS) as Kind[];
const PAPER_KEYS = Object.keys(PAPERS) as Options['paper'][];
const FRAME_KEYS = Object.keys(FRAMES) as Options['frame'][];
const COLOR_KEYS = Object.keys(COLORS) as (keyof typeof COLORS)[];

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
    }, SAVE_DELAY_MS);

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
        : `read-the-globe-postcard-${isoDay(new Date().toISOString())}.png`;

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

  // the card picker's value is 'atlas', 'year:<year>' or 'goal:<id>'
  const handleCardChange = (next: string) => {
    const [card, value] = next.split(':');

    set({
      goal: card === 'goal' ? Number(value) : null,
      year: card === 'year' ? value : null,
    });
  };

  // one of the set-up's buttons: kind, paper, count, frame or colour
  const handleSet = (change: Partial<CardOptions>) => () => set(change);

  /* ---------- lists ---------- */
  // the card picker: the reading atlas, then each year with books, then each goal reached
  const cardChoices = [
    { value: 'atlas', label: m.postcard_your_reading_atlas() },
    ...years.map((yearOption) => ({
      value: `year:${yearOption}`,
      label: m.postcard_in_books({ year: yearOption }),
    })),
    ...reached.map((reachedGoal) => ({
      value: `goal:${reachedGoal.id}`,
      label: m.postcard_goal_option({ goal: goalName(reachedGoal.name) }),
    })),
  ];

  const renderKind = (kind: Kind) => (
    <button
      key={kind}
      type="button"
      className={styles.kind}
      data-kind={kind}
      aria-pressed={options.kind === kind}
      onClick={handleSet({ kind })}
    >
      <span className={styles.kindStamp} aria-hidden="true" />
      <b className={styles.kindN}>{counts[kind]}</b>
      <span className={styles.kindName}>{KINDS[kind].name()}</span>
    </button>
  );

  const renderPaper = (paper: Options['paper']) => (
    <button
      key={paper}
      type="button"
      className={styles.paper}
      aria-pressed={options.paper === paper}
      onClick={handleSet({ paper })}
    >
      <span
        className={styles.paperChip}
        style={{ background: PAPERS[paper].fill }}
        aria-hidden="true"
      />
      {PAPERS[paper].name()}
    </button>
  );

  const renderCount = (count: Options['count']) => (
    <button
      key={count}
      type="button"
      className={styles.pill}
      aria-pressed={options.count === count}
      onClick={handleSet({ count })}
    >
      {countLabel(count)}
    </button>
  );

  const renderFrame = (frame: Options['frame']) => (
    <button
      key={frame}
      type="button"
      className={styles.pill}
      aria-pressed={options.frame === frame}
      onClick={handleSet({ frame })}
    >
      {FRAMES[frame]()}
    </button>
  );

  const renderColor = (key: keyof typeof COLORS) => (
    <button
      key={key}
      type="button"
      className={styles.swatch}
      style={{ background: COLORS[key].fill }}
      aria-pressed={color === key}
      aria-label={COLORS[key].name()}
      title={COLORS[key].name()}
      onClick={handleSet({ color: key })}
    />
  );

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
                <label
                  className={styles.label}
                  htmlFor="pc-card"
                  id="pc-card-label"
                >
                  {m.nav_postcard()}
                </label>
                <Select
                  id="pc-card"
                  labelId="pc-card-label"
                  className={styles.select}
                  value={which}
                  onChange={handleCardChange}
                  options={cardChoices}
                />
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
                    {KIND_KEYS.map(renderKind)}
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
                  {PAPER_KEYS.map(renderPaper)}
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
                  <div className={styles.pills}>{COUNTS.map(renderCount)}</div>
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
                    {FRAME_KEYS.map(renderFrame)}
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
                    {COLOR_KEYS.map(renderColor)}
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
