import { useMemo } from 'react';

import { useCountries } from '../../../../hooks/useCountries';
import { countryStamp } from '../../../../utils/countryStamps';

// a country's outline, from the same map file as Home and the postcard; null until it loads
export function useCountryStamp(country: string) {
  const shape = useCountries()?.get(country);

  return useMemo(() => (shape ? countryStamp(shape) : null), [shape]);
}
