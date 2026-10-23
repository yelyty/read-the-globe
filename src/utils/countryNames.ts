const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

let cache: Record<string, string> | null = null;

export async function getCountryNames(): Promise<Record<string, string>> {
  if (cache) return cache;
  const topo = (await fetch(GEO_URL).then((r) => r.json())) as {
    objects: {
      countries: {
        geometries: Array<{ id: string; properties: { name: string } }>;
      };
    };
  };
  const geometries = topo.objects.countries.geometries;
  cache = Object.fromEntries(
    geometries.filter((g) => g.id).map((g) => [g.id, g.properties.name]),
  );
  return cache;
}
