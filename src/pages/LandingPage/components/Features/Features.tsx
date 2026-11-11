import { useTheme } from '../../../../hooks/useTheme';
import * as s from './Features.css';

const PANELS = [
  {
    tone: 'green',
    shot: 'log',
    title: 'Two marks for every book',
    text: 'Give a book its title, its author and the author’s country, then the places the story visits. Before you pin it, the form shows which countries it will mark: olive for the setting, rust for the author.',
    alt: 'Logging a book in the app: The Sympathizer by Viet Thanh Nguyen, author’s country the United States, set in Saigon, Vietnam and Los Angeles. The form shows it will mark the United States and Vietnam.',
  },
  {
    tone: 'clay',
    shot: 'goals',
    title: 'Goals that fill in as you read',
    text: 'Pick a region, a set of countries or a theme. A book set there, or by an author from there, moves you along the route until you reach the flag.',
    alt: 'Mira’s goals in the app: Around South America, Stories set in the Arctic, The Nordics, Every corner of Europe and Across Africa, each with its map or shelf and its route.',
  },
  {
    tone: 'ochre',
    shot: 'shelf',
    title: 'A shelf that remembers every place',
    text: 'Search by title, author, place or country. Bring a reading list in as a CSV, or start with the book on your nightstand.',
    alt: 'Mira’s 2025 shelf in the app: 29 books, each with its cover, author, date, where it is set and where its author is from.',
  },
] as const;

// Three colour panels that pile up as you scroll, each with the app's own screen (phone-sized on phones).
const Features = () => {
  const night = useTheme() === 'dark' ? '-night' : '';
  return (
    <section className={s.band} id="features" aria-labelledby="band-h">
      <svg
        className={s.wave}
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 72V44C180 6 420 -6 720 26s560 38 720 0v46Z"
          fill="currentColor"
        />
      </svg>
      <div className={s.bandIn}>
        <h2 className={s.title} id="band-h">
          Every book you log goes on the map.
        </h2>
        <p className={s.sub}>
          One minute per book. The atlas does the rest, from the first pin to
          the last country on a goal.
        </p>
        <div className={s.panels}>
          {PANELS.map((panel) => (
            <article key={panel.shot} className={s.panel[panel.tone]}>
              <div className={s.panelText}>
                <h3>{panel.title}</h3>
                <p>{panel.text}</p>
              </div>
              <div className={s.shot}>
                <picture>
                  <source
                    srcSet={`/landing/app-${panel.shot}-phone${night}.webp`}
                    media="(max-width: 799px)"
                  />
                  <img
                    src={`/landing/app-${panel.shot}-desktop${night}.webp`}
                    alt={panel.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
