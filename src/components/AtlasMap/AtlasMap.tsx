import { memo, useEffect, useRef, type ReactNode } from "react";
import { geoEquirectangular } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  type ProjectionFunction,
} from "react-simple-maps";
import type { Marks } from "../../utils/atlasMarks";
import * as s from "./AtlasMap.css";

// 50m, not 110m: the low-detail map leaves out small countries, which then could never be marked
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const ANTARCTICA = "010";

// A flat latitude/longitude grid, as in the mock: 360° across, 83°N to 57°S down (no Antarctica).
const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (83 + 57)) / 360);
const projection = geoEquirectangular()
  .scale(WIDTH / (2 * Math.PI))
  .center([0, (83 - 57) / 2])
  .translate([WIDTH / 2, HEIGHT / 2]);
// react-simple-maps 1.0.0 uses a projection passed as a function as-is; its @types describe a factory instead
const projectionProp = projection as unknown as ProjectionFunction;

export type Show = "all" | "set" | "author";

type AtlasMapProps = {
  marks: Marks;
  dots: { id: string; lon: number; lat: number }[];
  show?: Show;
  onCountryClick?: (code: string) => void; // only marked countries are clickable
  caption: string; // what the map shows, for screen readers
  children?: ReactNode; // laid over the map: the cartouche
};

// The atlas plate: every country, olive where a story is set, rust where an author is from,
// olive with a rust edge for both, and a dot for each place.
const AtlasMap = memo(
  ({
    marks,
    dots,
    show = "all",
    onCountryClick,
    caption,
    children,
  }: AtlasMapProps) => {
    // on phones the map scrolls sideways: start it centred, on Europe and Africa, not on the Pacific
    const scroll = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const el = scroll.current;
      if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }, []);

    return (
      <figure className={s.plate} data-show={show}>
        <div className={s.scroll} ref={scroll}>
          <ComposableMap
            className={s.map}
            projection={projectionProp}
            width={WIDTH}
            height={HEIGHT}
            aria-hidden="true"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => geo.id !== ANTARCTICA)
                  .map((geo) => {
                    const mark = marks[geo.id];
                    const classes = [
                      s.land,
                      mark?.set.length && s.set,
                      mark?.author.length && s.author,
                      mark && s.marked,
                    ];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={-1} // the country list under the map is the keyboard way in
                        className={classes.filter(Boolean).join(" ")}
                        onClick={
                          mark && onCountryClick
                            ? () => onCountryClick(geo.id)
                            : undefined
                        }
                      />
                    );
                  })
              }
            </Geographies>
            <g className={s.dots}>
              {dots.map((d) => (
                <Marker key={d.id} coordinates={[d.lon, d.lat]}>
                  <circle r={2.6} className={s.dot} />
                </Marker>
              ))}
            </g>
          </ComposableMap>
        </div>
        <figcaption className={s.srOnly}>{caption}</figcaption>
        {children}
      </figure>
    );
  },
);

AtlasMap.displayName = "AtlasMap";

export default AtlasMap;
