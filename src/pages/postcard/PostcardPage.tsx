import { useEffect, useMemo, useRef, useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { PushPinIcon } from '@phosphor-icons/react';

import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { atlasMarks } from '../../utils/atlasMarks';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import Logo from '../../components/Logo/Logo';
import ButtonLink from '../../components/Button/ButtonLink';
import EmptyState from '../../components/EmptyState/EmptyState';
import { goalProgress } from '../goals/utils/goalProgress';
import * as styles from './PostCardPage.css';
import { readOptions, type CardOptions } from './utils/cardOptions';
import {
  cardFileName,
  cardLabel,
  cardShare,
  cardTitle,
} from './utils/cardText';
import { GOAL_H, GOAL_W } from './utils/drawGoalCard';
import { KINDS, SIZE, postcardStats } from './utils/drawPostcard';
import { useCardDrawing } from './hooks/useCardDrawing';
import { useSavedSetup } from './hooks/useSavedSetup';
import { bookYears, yearSum } from './utils/yearSum';
import CardSend from './features/CardSend';
import CardSetup from './features/CardSetup/CardSetup';

const app = getRouteApi('/app');
const route = getRouteApi('/app/postcard');

// the Postcard: a card of the reader's atlas, a year, or a reached goal, to save or share
const PostcardPage = () => {
  const { books, goals } = app.useLoaderData();
  const profile = route.useLoaderData();
  const search = route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const names = useCountryNames();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // a reached goal's Postcard link (?goal=) or a year link (?year=) chooses that card over the saved one
  const [options, setOptions] = useState<CardOptions>(() => ({
    ...readOptions(profile?.postcard ?? null),
    ...(search.goal !== undefined && { goal: search.goal, year: null }),
    ...(search.year && { year: search.year, goal: null }),
  }));

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

  const title = cardTitle(firstName, year);
  const color = options.color ?? (year ? 'green' : KINDS[options.kind].color);

  const change = (next: Partial<CardOptions>) =>
    setOptions((prev) => ({ ...prev, ...next }));

  // the link's choice is in the options now; the address goes back to plain /app/postcard
  useEffect(() => {
    if (search.goal !== undefined || search.year)
      navigate({ to: '/app/postcard', search: {}, replace: true });
  }, [search, navigate]);

  useSavedSetup(options, user?.id);

  useCardDrawing({
    canvasRef,
    logoRef,
    books,
    marks,
    names,
    options,
    title,
    firstName,
    goal,
    yearSummary,
  });

  if (!books.length) {
    return (
      <>
        <PageTitle>{m.title_postcard()}</PageTitle>
        <EmptyState
          className={styles.empty}
          title={m.postcard_blank_title()}
          text={m.postcard_blank_text()}
          actions={
            <ButtonLink
              variant="primary"
              to="."
              search={(prev) => ({ ...prev, log: true })}
            >
              <PushPinIcon weight="fill" aria-hidden="true" />
              {m.log_a_book()}
            </ButtonLink>
          }
        />
      </>
    );
  }

  const label = cardLabel({
    goal,
    progress: goal && goalProgress(goal, marks, books),
    yearSummary,
    kind: options.kind,
    stats,
  });

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
              ref={canvasRef}
              className={styles.canvas}
              width={goal ? GOAL_W : SIZE}
              height={goal ? GOAL_H : SIZE}
              role="img"
              aria-label={label}
            />
          </div>
          <p className={styles.foot}>
            {goal ? m.postcard_size_wide() : m.postcard_size_square()}
          </p>
        </div>

        <div>
          <CardSetup
            options={options}
            color={color}
            counts={counts}
            years={years}
            reached={reached}
            goal={goal}
            year={year}
            onChange={change}
          />
          {/* a new set-up remounts it, which clears what it last said */}
          <CardSend
            key={JSON.stringify(options)}
            canvasRef={canvasRef}
            fileName={cardFileName(goal, year)}
            share={cardShare({
              goal,
              yearSummary,
              kind: options.kind,
              stats,
            })}
          />
        </div>
      </div>
    </>
  );
};

export default PostcardPage;
