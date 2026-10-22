import { useEffect, useMemo, useState } from "react";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  PushPinIcon,
} from "@phosphor-icons/react";
import AtlasMap, { type Show } from "../../components/AtlasMap/AtlasMap.tsx";
import { marked } from "../../components/AtlasMap/AtlasMap.css";
import { atlasMarks, atlasStats } from "../../utils/atlasMarks";

import * as s from "./HomePage.css";
import { useAuth } from "../../auth/auth-context.ts";
import { useCountryNames } from "../../hooks/useCountryNames.ts";
import AtlasCountries from "./AtlasCountries.tsx";
import Cartouche from "./Cartouche.tsx";
import MapKey from "./MapKey.tsx";
import RecentReads from "./RecentReads.tsx";

const app = getRouteApi("/app");
const RECENT = 3;

// Home, as in the latest app mock: the atlas's title, the map with its count and key (full screen
// on a button or a click on the map), the three latest books, and the countries by continent.
const HomePage = () => {
  const { books } = app.useLoaderData();
  const { user } = useAuth();
  const names = useCountryNames();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show>("all");
  const [full, setFull] = useState(false);

  // Esc closes the full screen map, and the page under it stops scrolling while it is open
  useEffect(() => {
    if (!full) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    document.addEventListener("keydown", close);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.documentElement.style.overflow = "";
    };
  }, [full]);

  const marks = useMemo(() => atlasMarks(books), [books]);
  const stats = atlasStats(books, marks);
  const dots = books
    .flatMap((b) => b.places ?? [])
    .filter((p) => p.lon != null && p.lat != null);
  const firstName = String(user?.signUpName ?? "")
    .trim()
    .split(/\s+/)[0];
  const blank = !books.length;
  const title = blank
    ? "Your atlas is blank, for now."
    : firstName
      ? `${firstName}’s atlas`
      : "Your atlas";

  return (
    <div className={s.page}>
      <div className={s.viewHead} data-blank={blank || undefined}>
        <h1 className={s.title}>{title}</h1>
      </div>

      {blank && (
        <div className={s.firstRun}>
          <p>
            Every book you log marks this map twice: where its author is from,
            and every country its story is set in.
          </p>
          <Link
            className={s.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            Log your first book
          </Link>
        </div>
      )}

      {/* a click anywhere on the map but a marked country lays it over the whole window */}
      <div
        className={s.plate}
        data-full={full || undefined}
        onClick={(e) => {
          if (
            !full &&
            (e.target as Element).closest(".rsm-svg") &&
            !(e.target as Element).closest(`.${marked}`)
          )
            setFull(true);
        }}
      >
        <button
          type="button"
          className={s.fullBtn}
          aria-pressed={full}
          aria-label={
            full ? "Close the full screen map" : "Show the map full screen"
          }
          title={full ? "Close full screen" : "Full screen"}
          onClick={(e) => {
            e.stopPropagation();
            setFull(!full);
          }}
        >
          {full ? (
            <ArrowsInIcon aria-hidden="true" />
          ) : (
            <ArrowsOutIcon aria-hidden="true" />
          )}
        </button>
        <AtlasMap
          marks={marks}
          dots={dots}
          show={show}
          onCountryClick={(code) =>
            navigate({ to: "/app/shelf", search: { country: code } })
          }
          caption={
            stats.countries
              ? `Your map: ${stats.countries} of 195 countries marked, ${stats.set} where stories are set and ${stats.authors} where authors are from.`
              : "Your map: no countries marked yet."
          }
        >
          {!blank && <Cartouche stats={stats} show={show} />}
        </AtlasMap>
        {/* the key once there's a mark to explain; the filter once there's something to filter */}
        {!blank && (
          <MapKey show={show} onShow={setShow} canFilter={books.length > 1} />
        )}
      </div>

      {!blank && (
        <>
          <RecentReads books={books.slice(0, RECENT)} names={names} />
          <AtlasCountries marks={marks} names={names} />
        </>
      )}
    </div>
  );
};

export default HomePage;
