import type { Goal } from '../../../../types';
import { m } from '../../../../paraglide/messages.js';
import Hint from '../../../../components/Hint/Hint';
import Select from '../../../../components/Select/Select';
import ToggleGroup, {
  type ToggleOption,
} from '../../../../components/ToggleGroup/ToggleGroup';
import { goalName } from '../../../goals/utils/catalogue';
import {
  KIND_KEYS,
  PAPER_KEYS,
  type CardOptions,
  type ColorKey,
} from '../../utils/cardOptions';
import {
  KINDS,
  PAPERS,
  type Kind,
  type Options,
} from '../../utils/drawPostcard';
import * as styles from './CardSetup.css';
import CardStyle from './CardStyle';

type CardSetupProps = {
  options: CardOptions;
  color: ColorKey;
  /** how many countries each kind of atlas card would show */
  counts: Record<Kind, number>;
  /** the years with books, for a year's card */
  years: string[];
  /** the goals reached, for a goal's card */
  reached: Goal[];
  /** the card being made: a reached goal's, a year's, or (both null) the atlas */
  goal: Goal | null;
  year: string | null;
  onChange: (change: Partial<CardOptions>) => void;
};

/**
 * Shows the set-up controls of the card.
 * The reader selects the card and the paper.
 * For an atlas card, the reader also selects the type of countries.
 * For all cards except a goal card, the Style controls are also available.
 */
const CardSetup = ({
  options,
  color,
  counts,
  years,
  reached,
  goal,
  year,
  onChange,
}: CardSetupProps) => {
  const which = goal ? `goal:${goal.id}` : year ? `year:${year}` : 'atlas';

  const handleCardChange = (next: string) => {
    const [card, value] = next.split(':');

    onChange({
      goal: card === 'goal' ? Number(value) : null,
      year: card === 'year' ? value : null,
    });
  };

  const handleKind = (kind: Kind) => onChange({ kind });
  const handlePaper = (paper: Options['paper']) => onChange({ paper });

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

  const kindOption = (kind: Kind): ToggleOption<Kind> => ({
    value: kind,
    data: { 'data-kind': kind },
    content: (
      <>
        <span className={styles.kindStamp} aria-hidden="true" />
        <b className={styles.kindN}>{counts[kind]}</b>
        <span className={styles.kindName}>{KINDS[kind].name()}</span>
      </>
    ),
  });

  const paperOption = (
    paper: Options['paper']
  ): ToggleOption<Options['paper']> => ({
    value: paper,
    content: (
      <>
        <span
          className={styles.paperChip}
          style={{ background: PAPERS[paper].fill }}
          aria-hidden="true"
        />
        {PAPERS[paper].name()}
      </>
    ),
  });

  const kindOptions = KIND_KEYS.map(kindOption);
  const paperOptions = PAPER_KEYS.map(paperOption);

  return (
    <section aria-labelledby="pc-setup-title">
      <h2 className={styles.h2} id="pc-setup-title">
        {m.postcard_setup()}
      </h2>
      <div className={styles.fields}>
        <div>
          <label className={styles.label} htmlFor="pc-card" id="pc-card-label">
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
            <ToggleGroup
              className={styles.kinds}
              optionClassName={styles.kind}
              labelledBy="pc-kind-label"
              value={options.kind}
              options={kindOptions}
              onChange={handleKind}
            />
          </div>
        )}

        <div>
          <span className={styles.label} id="pc-paper-label">
            {m.postcard_background()}
          </span>
          <ToggleGroup
            className={styles.papers}
            optionClassName={styles.paper}
            labelledBy="pc-paper-label"
            value={options.paper}
            options={paperOptions}
            onChange={handlePaper}
          />
        </div>
      </div>

      {!goal && (
        <CardStyle options={options} color={color} onChange={onChange} />
      )}
    </section>
  );
};

export default CardSetup;
