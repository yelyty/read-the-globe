import type { Feature } from 'geojson';
import { geoEquirectangular, geoPath } from 'd3-geo';

import { mainPiece } from '../../../../utils/world';

// a stamp is drawn on a 100×100 grid; its country sits inside this margin
const STAMP_SIZE = 100;
const OUTLINE_MARGIN = 12;

/**
 * Gets the outline of a country as an SVG path, fitted inside a 100 × 100 stamp.
 */
export const outline = (shape: Feature) =>
  geoPath(
    geoEquirectangular().fitExtent(
      [
        [OUTLINE_MARGIN, OUTLINE_MARGIN],
        [STAMP_SIZE - OUTLINE_MARGIN, STAMP_SIZE - OUTLINE_MARGIN],
      ],
      mainPiece(shape)
    )
  )(mainPiece(shape)) ?? '';
