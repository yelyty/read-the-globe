import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Feature, Polygon } from "geojson";
import { GEO_URL } from "../components/AtlasMap/AtlasMap";
import { geoArea } from "d3-geo";

let shapes: Promise<Record<string, Feature>> | undefined;
export function worldShapes() {
	shapes ??= fetch(GEO_URL)
		.then((r) => r.json() as Promise<Topology>)
		.then((topo) => {
			const all = feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
			const byCode: Record<string, Feature> = {};
			if (all.type === "FeatureCollection") for (const f of all.features) if (f.id != null) byCode[String(f.id)] = f;
			return byCode;
		});
	return shapes;
}

// a country's biggest landmass, so islands far away don't shrink the frame
export const mainPiece = (f: Feature): Feature => {
	if (f.geometry.type !== "MultiPolygon") return f;
	const pieces = f.geometry.coordinates.map(
		(coordinates): Feature<Polygon> => ({
			type: "Feature",
			properties: {},
			geometry: { type: "Polygon", coordinates },
		}),
	);
	return pieces.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
};