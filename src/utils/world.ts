import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { Feature, Polygon } from 'geojson';
import { geoArea } from 'd3-geo';

/** The one map of the world everything draws from: the atlas, the country names, goal plates, stamps and postcards.
    A local copy of world-atlas@2.0.2 countries-50m with Crimea moved from Russia back into Ukraine.
    50m, not 110m: the low-detail map leaves out small countries (Malta, Singapore…), which then could never be marked. */
export const GEO_URL = '/countries-50m.json';

/** The numeric code of every country the map draws (and so the reader can mark), without loading the map:
    a region goal counts these. world.test.ts checks the list against the map file. */
export const MAP_CODES: readonly string[] = `
004 008 010 012 016 020 024 028 031 032 036 040 044 048 050 051 052 056
060 064 068 070 072 076 084 086 090 092 096 100 104 108 112 116 120 124
132 136 140 144 148 152 156 158 170 174 178 180 184 188 191 192 196 203
204 208 212 214 218 222 226 231 232 233 234 238 239 242 246 248 250 258
260 262 266 268 270 275 276 288 296 300 304 308 316 320 324 328 332 334
336 340 344 348 352 356 360 364 368 372 376 380 384 388 392 398 400 404
408 410 414 417 418 422 426 428 430 434 438 440 442 446 450 454 458 462
466 470 478 480 484 492 496 498 499 500 504 508 512 516 520 524 528 531
533 534 540 548 554 558 562 566 570 574 578 580 583 584 585 586 591 598
600 604 608 612 616 620 624 626 630 634 642 643 646 652 654 659 660 662
663 666 670 674 678 682 686 688 690 694 702 703 704 705 706 710 716 724
728 729 732 740 748 752 756 760 762 764 768 776 780 784 788 792 795 796
800 804 807 818 826 831 832 833 834 840 850 854 858 860 862 876 882 887
894
`
  .trim()
  .split(/\s+/);

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
      if (shape.id === null || shape.id === undefined) continue;

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

/**
 * Gets the biggest landmass of a country, so islands far away do not make the frame smaller.
 */
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
