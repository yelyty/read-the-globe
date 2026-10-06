import { useMemo, useState } from "react";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { PushPinIcon } from "@phosphor-icons/react";
import AtlasMap, { type Show } from "../../components/AtlasMap/AtlasMap.tsx";
import { atlasMarks, atlasStats } from "../../utils/atlasMarks";

import * as s from "./HomePage.css";
import { useAuth } from "../../auth/auth-context.ts";
import { useCountryNames } from "../../hooks/useCountryNames.ts";
import AtlasCountries from "./AtlasCountries.tsx";
import Cartouche from "./Cartouche.tsx";
import MapKey from "./MapKey.tsx";
import RecentPins from "./RecentPins.tsx";

const app = getRouteApi("/app");
const RECENT = 5;

const HomePage = () => {
  const { books } = app.useLoaderData();
  const { user } = useAuth();
  const names = useCountryNames();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show>("all");

  const marks = useMemo(() => atlasMarks(books), [books]);
  const stats = atlasStats(books, marks);
  const dots = books
    .flatMap((b) => b.places ?? [])
    .filter((p) => p.lon != null && p.lat != null);
  const firstName = String(user?.user_metadata?.display_name ?? "")
    .trim()
    .split(/\s+/)[0];
  const title = firstName ? `${firstName}’s atlas` : "Your atlas";

  if (!books.length) {
    return (
      <div className={s.page}>
        <div className={s.firstRun}>
          <h1 className={s.title}>Your atlas is blank, for now.</h1>
          <p>
            Every book you log leaves two marks on this map: where its author is
            from, and every country the story goes.
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
        <AtlasMap
          marks={{}}
          dots={[]}
          caption="Your atlas: no countries marked yet."
        />
      </div>
    );
  }

  return (
    <div className={s.page}>
      <h1 className={s.srOnly}>{title}</h1>
      <AtlasMap
        marks={marks}
        dots={dots}
        show={show}
        onCountryClick={(code) =>
          navigate({ to: "/app/shelf", search: { country: code } })
        }
        caption={`${title}: ${stats.countries} of 195 countries marked, ${stats.set} where stories are set and ${stats.authors} where authors are from.`}
      >
        <Cartouche title={title} stats={stats} show={show} />
      </AtlasMap>
      <MapKey show={show} onShow={setShow} canFilter={books.length > 1} />
      <RecentPins books={books.slice(0, RECENT)} names={names} />
      <AtlasCountries marks={marks} names={names} />
    </div>
  );
};

export default HomePage;
