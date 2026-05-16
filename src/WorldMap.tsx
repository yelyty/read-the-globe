import { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { CountryData } from "./types";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  countryData: CountryData;
  onCountryClick: (code: string, name: string) => void;
}

const WorldMap = memo(({ countryData, onCountryClick }: WorldMapProps) => {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="relative w-full">
      {/* {tooltip && <div className="">{tooltip}</div>} */}
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
        className="w-full h-auto"
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = geo.id;
                console.log(code);
                const name = geo.properties.name;
                const isRead = !!countryData[code];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onCountryClick(code, name)}
                    onMouseEnter={() => {
                      const book = countryData[code];
                      setTooltip(
                        book
                          ? `${name} — "${book.title}" by ${book.author}`
                          : name,
                      );
                    }}
                    onMouseLeave={() => setTooltip("")}
                    style={{
                      default: {
                        fill: isRead
                          ? "hsl(152, 45%, 30%)"
                          : "hsl(39, 20%, 88%)",
                        stroke: "hsl(33, 20%, 80%)",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "fill 0.2s ease",
                      },
                      hover: {
                        fill: isRead
                          ? "hsl(152, 45%, 38%)"
                          : "hsl(152, 30%, 75%)",
                        stroke: "hsl(33, 20%, 70%)",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "hsl(152, 45%, 25%)",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
});

WorldMap.displayName = "WorldMap";

export default WorldMap;
