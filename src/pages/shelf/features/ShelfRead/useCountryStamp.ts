import { useMemo } from 'react';

import { useCountries } from '../../../../hooks/useCountries';
import { countryStamp } from '../../../../utils/countryStamps';

/**
 * Gets the outline of a country, from the same map file as Home and the Postcard.
 * @returns The outline, or null until the map loads.
 */
export const useCountryStamp = (country: string) => {
  const shape = useCountries()?.get(country);

  return useMemo(() => (shape ? countryStamp(shape) : null), [shape]);
};
