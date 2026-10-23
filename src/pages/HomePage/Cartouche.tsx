import { useId } from "react";
import type { Show } from "../../components/AtlasMap/AtlasMap.tsx";
import type { atlasStats } from "../../utils/atlasMarks";
import * as s from "./HomePage.css";

const CAPTION: Record<Show, string> = {
  all: "countries",
  set: "countries where stories are set",
  author: "authors’ countries",
};

const COUNTRY_TOTAL = 195;

const CARTOUCHE_EXPLANATION =
  "195 = the 193 UN member states, plus the Holy See (Vatican City) and Palestine. Territories count toward their country, so Greenland marks Denmark. Places outside the list, such as Taiwan or Kosovo, show on the map but aren't added to the total.";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

type CartoucheProps = {
  stats: ReturnType<typeof atlasStats>;
  show: Show;
};

const Cartouche = ({ stats, show }: CartoucheProps) => {
  const tooltipId = useId();

  const countByShow: Record<Show, number> = {
    all: stats.countries,
    set: stats.set,
    author: stats.authors,
  };

  const count = countByShow[show];

  return (
    <div className={s.cartouche}>
      <p className={s.cartBig}>
        <b>{count}</b>
        <span className={s.cartOf} tabIndex={0} aria-describedby={tooltipId}>
          / {COUNTRY_TOTAL}
          <span className={s.cartWhy} id={tooltipId} role="tooltip">
            {CARTOUCHE_EXPLANATION}
          </span>
        </span>
      </p>
      <p className={s.cartCap}>{CAPTION[show]}</p>
      <p className={s.cartMeta}>
        {plural(stats.books, "book")} · {plural(stats.continents, "continent")}
      </p>
    </div>
  );
};

export default Cartouche;
