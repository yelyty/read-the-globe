/* a place: a name and its country, or (imagined) a world's name and no country.
   pick: the country chosen for a state that split; open: its choice unfolded again by Change */
export type Row = {
  key: number;
  name: string;
  country: string;
  imagined: boolean;
  pick: string;
  open: boolean;
};

let rowKey = 0;

/**
 * Makes a place row of the log form. Each row gets its own key.
 * @param imagined - If true, the place is an imagined world and has no country.
 */
export const row = (name = '', country = '', imagined = false): Row => ({
  key: ++rowKey,
  name,
  country,
  imagined,
  pick: '',
  open: false,
});

/**
 * Gets the rows a log form starts with: the places of an edited book, or one row from where Log a book was opened.
 * A place saved as only its country shows as an empty name beside that country.
 * @param start - The country or the imagined world where Log a book was opened.
 * @param name - Gets the name of a country from its code.
 */
export const startRows = (
  places: { name: string; countryCode?: string | null; imagined?: boolean }[],
  start: { world?: string; country: string },
  name: (code?: string | null) => string
): Row[] =>
  places.length
    ? places.map((place) =>
        place.imagined
          ? row(place.name, '', true)
          : // a place saved as just its country shows as an empty name beside that country
            row(
              place.name === name(place.countryCode) ? '' : place.name,
              name(place.countryCode)
            )
      )
    : [start.world ? row(start.world, '', true) : row('', start.country)];
