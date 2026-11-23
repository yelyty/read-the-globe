import { markWhich } from '../../../../utils/atlasMarks';
import * as styles from './LiveAtlas.css';

type AtlasCountryProps = {
  /** its outline on the map */
  d: string;
  /** a story of the example user's is set there */
  set: boolean;
  /** an author of hers is from there */
  author: boolean;
};

/**
 * Shows one country on the example user's map, colored by the marks their books have given it so far.
 */
const AtlasCountry = ({ d, set, author }: AtlasCountryProps) => {
  const className =
    set || author ? styles[markWhich(set, author)] : styles.land;

  return <path d={d} className={className} />;
};

export default AtlasCountry;
