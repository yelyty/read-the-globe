import { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
} from "react-simple-maps";
import type { CountryData } from "./types";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type WorldMapProps = {
  countryData: CountryData;
  onCountryClick: (code: string, name: string) => void;
};

const WorldMap = memo(({ countryData, onCountryClick }: WorldMapProps) => {
  const [tooltip, setTooltip] = useState("");

  const displayTooltip = (code: string, name: string) => {
    const book = countryData[code];
    setTooltip(book ? `${name} — "${book.title}" by ${book.author}` : name);
  };

  const clearTooltip = () => {
    setTooltip("");
  };

  return (
    <div className="map-wrapper">
      <ComposableMap
        projection="geoEqualEarth"
        width={800}
        height={400}
        projectionConfig={{ scale: 145 }}
      >
        <Graticule stroke="var(--map-ink)" />
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = geo.id;
              const name = geo.properties.name;
              const isRead = !!countryData[code];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onCountryClick(code, name)}
                  onMouseEnter={() => displayTooltip(code, name)}
                  onMouseLeave={clearTooltip}
                  style={{
                    default: {
                      fill: isRead
                        ? "var(--color-marker-author)"
                        : "var(--map-land)",
                      stroke: "var(--map-ink)",
                      strokeWidth: 0.5,
                      outline: "none",
                      transition: "fill 0.2s ease",
                    },
                    hover: {
                      fill: isRead
                        ? "var(--color-marker-author)"
                        : "var(--color-marker-author)",
                      stroke: "var(--color-stroke)",
                      strokeWidth: 0.75,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "var(--color-primary)",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
});

WorldMap.displayName = "WorldMap";

export default WorldMap;
