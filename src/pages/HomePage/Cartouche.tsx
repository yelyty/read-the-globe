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
  title: string;
  stats: ReturnType<typeof atlasStats>;
  show: Show;
};

// The atlas's title panel, set into the map like the title of a printed map.
const Cartouche = ({ title, stats, show }: CartoucheProps) => {
  const count =
    show === "set"
      ? stats.set
      : show === "author"
        ? stats.authors
        : stats.countries;
  return (
    <div className={s.cartouche}>
      <p className={s.cartTitle} aria-hidden="true">
        {title}
      </p>
      <p className={s.cartBig}>
        <b>{count}</b>
        <span>/ 195</span>
        <span className={s.cartCap}>{CAPTION[show]}</span>
      </p>
      <p className={s.cartMeta}>
        {plural(stats.books, "book")} · {plural(stats.continents, "continent")}
      </p>
    </div>
  );
};

export default Cartouche;
