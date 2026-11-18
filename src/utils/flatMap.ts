import { geoEquirectangular } from 'd3-geo';

// The app's flat latitude/longitude grid, as in the mock: 360° across, 83°N to 57°S down (no Antarctica)
const DEGREES_ACROSS = 360;
const NORTH = 83;
const SOUTH = 57;

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = Math.round(
  (MAP_WIDTH * (NORTH + SOUTH)) / DEGREES_ACROSS
);

/**
 * Makes a new projection onto the flat MAP_WIDTH × MAP_HEIGHT map.
 */
export const flatProjection = () =>
  geoEquirectangular()
    .scale(MAP_WIDTH / (2 * Math.PI))
    .center([0, (NORTH - SOUTH) / 2])
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
