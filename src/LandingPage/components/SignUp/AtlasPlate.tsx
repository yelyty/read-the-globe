import { memo, type ReactNode } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { GEO_URL } from "../../config";
import * as s from "./SignUp.css";

type AtlasPlateProps = {
  landClassName: string;
  children?: ReactNode;
};

const MAP = { width: 800, height: 400, scale: 145 } as const;
const ANTARCTICA = "010";

const AtlasPlate = memo(({ landClassName, children }: AtlasPlateProps) => {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      width={MAP.width}
      height={MAP.height}
      projectionConfig={{ scale: MAP.scale }}
      className={s.atlasSvg}
      aria-hidden="true"
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter((geo) => geo.id !== ANTARCTICA)
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                tabIndex={-1}
                role={undefined}
                className={landClassName}
              />
            ))
        }
      </Geographies>
      {children}
    </ComposableMap>
  );
});

AtlasPlate.displayName = "AtlasPlate";

export default AtlasPlate;
