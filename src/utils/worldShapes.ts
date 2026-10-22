import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Feature } from "geojson";
import { GEO_URL } from "../components/AtlasMap/AtlasMap";

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