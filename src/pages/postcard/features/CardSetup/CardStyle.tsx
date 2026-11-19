import { m } from '../../../../paraglide/messages.js';
import { lower } from '../../../../utils/text';
import ToggleGroup, {
  type ToggleOption,
} from '../../../../components/ToggleGroup/ToggleGroup';
import {
  COLOR_KEYS,
  COUNTS,
  FRAME_KEYS,
  FRAMES,
  countLabel,
  type CardOptions,
  type ColorKey,
} from '../../utils/cardOptions';
import { COLORS, type Options } from '../../utils/drawPostcard';
import * as styles from './CardStyle.css';

type CardStyleProps = {
  options: CardOptions;
  /** the colour the card is drawn in: the chosen one, or the card's own */
  color: ColorKey;
  onChange: (change: Partial<CardOptions>) => void;
};

/**
 * Shows the Style controls of an atlas card or a year-end card.
 * The controls set the number of stamps, the frame, and the color.
 * The reader can open and close this section.
 */
const CardStyle = ({ options, color, onChange }: CardStyleProps) => {
  const handleCount = (count: Options['count']) => onChange({ count });
  const handleFrame = (frame: Options['frame']) => onChange({ frame });
  const handleColor = (key: ColorKey) => onChange({ color: key });

  /* ---------- lists ---------- */
  const countOption = (
    count: Options['count']
  ): ToggleOption<Options['count']> => ({
    value: count,
    content: countLabel(count),
  });

  const frameOption = (
    frame: Options['frame']
  ): ToggleOption<Options['frame']> => ({
    value: frame,
    content: FRAMES[frame](),
  });

  const colorOption = (key: ColorKey): ToggleOption<ColorKey> => ({
    value: key,
    content: null,
    style: { background: COLORS[key].fill },
    ariaLabel: COLORS[key].name(),
    title: COLORS[key].name(),
  });

  const countOptions = COUNTS.map(countOption);
  const frameOptions = FRAME_KEYS.map(frameOption);
  const colorOptions = COLOR_KEYS.map(colorOption);

  return (
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
      <div className={styles.row}>
        <span className={styles.rowLabel} id="pc-count-label">
          {m.postcard_stamps()}
        </span>
        <ToggleGroup
          className={styles.pills}
          optionClassName={styles.pill}
          labelledBy="pc-count-label"
          value={options.count}
          options={countOptions}
          onChange={handleCount}
        />
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel} id="pc-frame-label">
          {m.postcard_frame()}
        </span>
        <ToggleGroup
          className={styles.pills}
          optionClassName={styles.pill}
          labelledBy="pc-frame-label"
          value={options.frame}
          options={frameOptions}
          onChange={handleFrame}
        />
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel} id="pc-color-label">
          {m.postcard_colour()}
        </span>
        <ToggleGroup
          className={styles.swatches}
          optionClassName={styles.swatch}
          labelledBy="pc-color-label"
          value={color}
          options={colorOptions}
          onChange={handleColor}
        />
        <span className={styles.colorName} aria-hidden="true">
          {COLORS[color].name()}
        </span>
      </div>
    </details>
  );
};

export default CardStyle;
