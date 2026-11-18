import { Geography } from 'react-simple-maps';

import type { Geo } from '../../types';
import type { Mark } from '../../utils/atlasMarks';
import * as styles from './AtlasMap.css';

type MapCountryProps = {
  geo: Geo;
  mark?: Mark;
  /** unmarked, and invites a book (every country but Antarctica, when the map is open) */
  open: boolean;
  /** a pin just landed on it */
  landed: boolean;
};

/**
 * Shows one country on the map, colored by its marks.
 * @param open - If true, an unmarked country lifts under the pointer, to invite a book set there.
 * @param landed - If true, a pin has just landed on the country.
 */
const MapCountry = ({ geo, mark, open, landed }: MapCountryProps) => {
  const classes = [
    styles.land,
    mark?.set.length && styles.set,
    mark?.author.length && styles.author,
    mark && styles.marked,
    !mark && open && styles.open,
    landed && styles.landed,
  ];

  return (
    <Geography
      geography={geo}
      data-code={geo.id} // Home reads it for the tooltip, a click and the pin's flight
      tabIndex={-1} // the country list under the map is the keyboard way in
      className={classes.filter(Boolean).join(' ')}
    />
  );
};

export default MapCountry;
