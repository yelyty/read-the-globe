import { useEffect, useState } from 'react';

import { countryStamp, loadCountries } from '../../utils/countryStamps';

type Stamp = ReturnType<typeof countryStamp> & { code: string };

// a country's outline, from the same map file as Home and the postcard; null until it loads
export function useCountryStamp(country: string) {
  const [stamp, setStamp] = useState<Stamp | null>(null);

  useEffect(() => {
    let live = true;

    loadCountries().then((all) => {
      const shape = all.get(country);

      if (live && shape) setStamp({ ...countryStamp(shape), code: country });
    });

    return () => {
      live = false;
    };
  }, [country]);

  // a stamp left from the country before shows nothing
  return stamp?.code === country ? stamp : null;
}
