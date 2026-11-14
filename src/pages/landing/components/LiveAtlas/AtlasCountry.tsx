import * as styles from './LiveAtlas.css';

type AtlasCountryProps = {
  /** its outline on the map */
  d: string;
  /** a story of Mira's is set there */
  set: boolean;
  /** an author of hers is from there */
  author: boolean;
};

// one country on Mira's map, coloured by the marks her books have given it so far
const AtlasCountry = ({ d, set, author }: AtlasCountryProps) => {
  const className =
    set && author
      ? styles.both
      : set
        ? styles.set
        : author
          ? styles.author
          : styles.land;

  return <path d={d} className={className} />;
};

export default AtlasCountry;
