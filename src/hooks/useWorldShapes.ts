import { useQuery } from '@tanstack/react-query';

import { worldShapesQuery } from '../api/queries';

/** every country's map shape, by numeric code; undefined until the map file loads.
    The file is big: pass `load: false` to hold off fetching it until it's needed (the landing page's maps). */
export function useWorldShapes(load = true) {
  return useQuery({ ...worldShapesQuery, enabled: load }).data;
}
