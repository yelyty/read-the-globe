import { useRef } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';

import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { useBooks, useGoals, useProfile } from '../../hooks/useReader';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import Logo from '../../components/Logo/Logo';
import ButtonLink from '../../components/Button/ButtonLink';
import EmptyState from '../../components/EmptyState/EmptyState';
import * as styles from './PostcardPage.css';
import { cardFileName, cardShare } from './utils/cardText';
import { GOAL_H, GOAL_W } from './utils/drawGoalCard';
import { SIZE } from './utils/drawPostcard';
import { useCardChoice } from './features/CardSetup/useCardChoice';
import { useCardDrawing } from './hooks/useCardDrawing';
import CardSend from './features/CardSend';
import CardSetup from './features/CardSetup/CardSetup';

/**
 * Shows the Postcard page.
 * The page shows the card on a canvas, and the controls for its set-up.
 * The reader can save the card or share it.
 */
const PostcardPage = () => {
  const books = useBooks();
  const goals = useGoals();
  const profile = useProfile();
  const { user } = useAuth();
  const names = useCountryNames();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const {
    options,
    change,
    marks,
    counts,
    stats,
    firstName,
    years,
    reached,
    goal,
    year,
    yearSummary,
    title,
    color,
    label,
  } = useCardChoice({ books, goals, profile, user });

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

  return (
    <>
      <PageTitle>{m.title_postcard()}</PageTitle>
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
