import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import Book from "../../Book";
import toCountryData from "../../helpers/toCountryData";
import ProgressBar from "../../ProgressBar";
import WorldMap from "../../WorldMap";
import * as s from "./HomePage.css";

const app = getRouteApi("/app");
const RECENT = 3; // books under "Recent pins"; the rest are on the shelf

const HomePage = () => {
  const { books, places } = app.useLoaderData();
  const navigate = useNavigate();
  const countryData = toCountryData(books);
  const recent = books.slice(0, RECENT);

  return (
    <>
      <div className={s.head}>
        <h1 className={s.title}>Your atlas</h1>
        <ProgressBar countriesCount={Object.keys(countryData).length} />
      </div>

      {books.length === 0 && (
        <div className={s.firstRun}>
          <p>
            Every book you log marks the country its author is from. Pin the
            last book you loved, and watch the first country fill in.
          </p>
          <Link
            className={s.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            Log your first book
          </Link>
        </div>
      )}

      <WorldMap
        countryData={countryData}
        places={places}
        onCountryClick={(code) =>
          navigate({
            to: ".",
            search: (prev) => ({ ...prev, log: true, country: code }),
          })
        }
      />

      {recent.length > 0 && (
        <section className={s.recent} aria-labelledby="recent-title">
          <div className={s.subHead}>
            <h2 id="recent-title" className={s.subTitle}>
              Recent pins
            </h2>
            {/* <Link className={s.more} to="/app/shelf">
              The whole shelf
            </Link> */}
          </div>
          <div className="book-list">
            {recent.map((book) => (
              <Book
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author?.name}
                countryCode={book.author?.country?.code}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;
