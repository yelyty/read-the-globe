import { useQuery } from '@tanstack/react-query';

import { countriesQuery } from '../api/queries';

/** the world's countries framed as stamps, by code; undefined until the map file loads */
export function useCountries() {
  return useQuery(countriesQuery).data;
}
