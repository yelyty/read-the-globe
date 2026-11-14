import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { Feature, Polygon } from 'geojson';
import { geoArea } from 'd3-geo';

/** The one map of the world everything draws from: the atlas, the country names, goal plates, stamps and postcards.
    A local copy of world-atlas@2.0.2 countries-50m with Crimea moved from Russia back into Ukraine.
    50m, not 110m: the low-detail map leaves out small countries (Malta, Singapore…), which then could never be marked. */
export const GEO_URL = '/countries-50m.json';

type World = {
  /** each country's shape, by its numeric code */
  shapes: Record<string, Feature>;
  /** each country's English name on the map, by the same code */
  names: Record<string, string>;
};

let world: Promise<World> | undefined;

const decode = (topo: Topology): World => {
  const all = feature(topo, topo.objects.countries);
  const shapes: Record<string, Feature> = {};
  const names: Record<string, string> = {};

  // a code can come twice (Australia's 036 also tags the Ashmore and Cartier reef): the bigger shape is the country.
  // A few areas have no code (Somaliland, Kosovo, N. Cyprus…): they're drawn by the map but can't be marked
  if (all.type === 'FeatureCollection')
    for (const shape of all.features) {
      if (shape.id == null) continue;

      const code = String(shape.id);
      const kept = shapes[code];

      if (kept && (geoArea(shape) || 0) <= (geoArea(kept) || 0)) continue;
      shapes[code] = shape;

      names[code] =
        (shape.properties as { name?: string } | null)?.name ?? code;
    }

  return { shapes, names };
};

// fetched and decoded once, however many parts of the app ask
const loadWorld = () =>
  (world ??= fetch(GEO_URL)
    .then((response) => response.json() as Promise<Topology>)
    .then(decode));

/** every country's shape, by numeric code */
export const worldShapes = () => loadWorld().then(({ shapes }) => shapes);

/** every country's English name on the map, by numeric code: the same countries as worldShapes(), always */
export const worldNames = () => loadWorld().then(({ names }) => names);

// a country's biggest landmass, so islands far away don't shrink the frame
export const mainPiece = (shape: Feature): Feature => {
  if (shape.geometry.type !== 'MultiPolygon') return shape;

  const pieces = shape.geometry.coordinates.map(
    (coordinates): Feature<Polygon> => ({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates },
    })
  );

  return pieces.reduce((largest, piece) =>
    geoArea(piece) > geoArea(largest) ? piece : largest
  );
};
