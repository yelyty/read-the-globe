import type { Show } from "../../components/AtlasMap/AtlasMap.tsx";
import type { atlasStats } from "../../utils/atlasMarks";
import * as s from "./HomePage.css";

const CAPTION: Record<Show, string> = {
  all: "countries",
  set: "countries where stories are set",
  author: "authors’ countries",
};
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

type CartoucheProps = {
  stats: ReturnType<typeof atlasStats>;
  show: Show;
};

// The count set into the plate like a printed map's title panel; the title itself is the page heading now.
const Cartouche = ({ stats, show }: CartoucheProps) => {
  const count =
    show === "set"
      ? stats.set
      : show === "author"
        ? stats.authors
        : stats.countries;
  return (
    <div className={s.cartouche}>
      <p className={s.cartBig}>
        <b>{count}</b>
        <span className={s.cartOf} tabIndex={0} aria-describedby="cart-why">
          / 195
          <span className={s.cartWhy} id="cart-why" role="tooltip">
            195 = the 193 UN member states, plus the Holy See (Vatican City) and
            Palestine. Territories count toward their country, so Greenland
            marks Denmark. Places outside the list, such as Taiwan or Kosovo,
            show on the map but aren’t added to the total.
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
