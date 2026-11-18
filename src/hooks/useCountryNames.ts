import { useQuery } from '@tanstack/react-query';

import { countryNamesQuery } from '../api/queries';

const NONE: Record<string, string> = {};

/** code → country name in the reader's language; empty until the map's names load */
export const useCountryNames = () => {
  return useQuery(countryNamesQuery).data ?? NONE;
};
