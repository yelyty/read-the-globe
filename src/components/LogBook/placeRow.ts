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

export const row = (name = '', country = '', imagined = false): Row => ({
  key: ++rowKey,
  name,
  country,
  imagined,
  pick: '',
  open: false,
});
