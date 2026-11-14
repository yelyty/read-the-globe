import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { Feature, Polygon } from 'geojson';
import { geoArea } from 'd3-geo';

import { GEO_URL } from '../components/AtlasMap/AtlasMap';

let shapes: Promise<Record<string, Feature>> | undefined;

export function worldShapes() {
  shapes ??= fetch(GEO_URL)
    .then((response) => response.json() as Promise<Topology>)
    .then((topo) => {
      const all = feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
      const byCode: Record<string, Feature> = {};

      // a code can come twice (Australia's 036 also tags the Ashmore and Cartier reef): the bigger shape is the country
      if (all.type === 'FeatureCollection')
        for (const shape of all.features) {
          if (shape.id == null) continue;

          const code = String(shape.id);
          const kept = byCode[code];

          if (!kept || (geoArea(shape) || 0) > (geoArea(kept) || 0))
            byCode[code] = shape;
        }

      return byCode;
    });

  return shapes;
}

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
