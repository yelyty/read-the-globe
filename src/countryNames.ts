// countryNames.ts
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

let cache: Record<string, string> | null = null;

export async function getCountryNames(): Promise<Record<string, string>> {
	if (cache) return cache;
	const topo = await fetch(GEO_URL).then((r) => r.json());
	const geometries = topo.objects.countries.geometries as Array<{
		id: string;
		properties: { name: string };
	}>;
	cache = Object.fromEntries(geometries.map((g) => [g.id, g.properties.name]));
	return cache;
}