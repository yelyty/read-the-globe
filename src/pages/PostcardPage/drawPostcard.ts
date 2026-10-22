import { geoEquirectangular, geoPath } from "d3-geo";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";
import type { BookEntry } from "../../types";
import type { Marks } from "../../utils/atlasMarks";
import { CONTINENT_OF } from "../../utils/continents";
import { light } from "../../styles/theme.css";

export const SIZE = 1080;

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const projection = geoEquirectangular().scale(1000 / (2 * Math.PI)).translate([500, 250]);

const C = light.color;
const SERIF = light.font.display;
const SANS = light.font.sans;

export const PAPERS = {
	paper: { name: "Paper", fill: C.surface },
	parchment: { name: "Parchment", fill: C.backgroundDeep },
	sage: { name: "Sage", fill: C.oliveWash },
	rose: { name: "Rose", fill: C.rustWash },
} as const;

export const COLORS = {
	rust: { name: "Rust", fill: C.markerAuthor },
	olive: { name: "Olive", fill: C.markerSetting },
	green: { name: "Green", fill: C.accent },
	gold: { name: "Gold", fill: C.secondary },
	ink: { name: "Ink", fill: C.text },
} as const;

/* A postcard collects one kind of country, never both: where the authors come from, or where the stories are set.
   Its words, colour and numbers all follow that choice. */
export const KINDS = {
	authors: {
		codes: (b: BookEntry) => [b.author?.country?.code],
		count: (m: Marks[string]) => m.author.length,
		color: "rust",
		caption: "WHERE MY AUTHORS COME FROM",
		stat: ["AUTHOR’S COUNTRY", "AUTHORS’ COUNTRIES"],
		name: "Where your authors are from",
		share: (n: number) => `Authors from ${n} of 195 countries so far, on my reading atlas.`,
	},
	settings: {
		codes: (b: BookEntry) => (b.places ?? []).map((p) => p.countryCode),
		count: (m: Marks[string]) => m.set.length,
		color: "olive",
		caption: "WHERE MY BOOKS ARE SET",
		stat: ["STORY COUNTRY", "STORY COUNTRIES"],
		name: "Where your books are set",
		share: (n: number) => `Stories set in ${n} of 195 countries so far, on my reading atlas.`,
	},
} as const;

export type Kind = keyof typeof KINDS;
export type Options = {
	kind: Kind;
	count: 0 | 3 | 6; // 0: every stamp
	frame: "perforated" | "framed" | "plain";
	color: keyof typeof COLORS | null; // null: the kind's own mark, rust for authors, olive for settings
	paper: keyof typeof PAPERS;
};

const plural = (n: number, [one, many]: readonly [string, string]) => (n === 1 ? one : many);

// the kind's countries, newest book first, and the numbers under the stamps
export function postcardStats(books: BookEntry[], marks: Marks, kind: Kind) {
	const K = KINDS[kind];
	const known = (c: string | null | undefined): c is string => !!c && !!marks[c] && K.count(marks[c]) > 0;
	const order: string[] = [];
	for (const b of books) for (const c of K.codes(b)) if (known(c) && !order.includes(c)) order.push(c);
	return {
		order,
		countries: order.length,
		continents: new Set(order.map((c) => CONTINENT_OF[c]).filter(Boolean)).size,
		books: books.filter((b) => K.codes(b).some(known)).length,
	};
}

/* ---------- the world, decoded once from the map's TopoJSON ---------- */
type Topology = {
	transform: { scale: [number, number]; translate: [number, number] };
	arcs: [number, number][][];
	objects: { countries: { geometries: { id?: string; type: string; arcs?: number[][] | number[][][] }[] } };
};
type Box = [[number, number], [number, number]];
type Country = { shape: Feature<Polygon | MultiPolygon>; main: Box };

let world: Promise<Map<string, Country>> | null = null;

// ponytail: a 20-line TopoJSON reader instead of topojson-client; world-atlas is always quantized, so only that case is handled
export function loadCountries() {
	world ??= fetch(GEO_URL)
		.then((r) => r.json() as Promise<Topology>)
		.then((topo) => {
			const [sx, sy] = topo.transform.scale;
			const [tx, ty] = topo.transform.translate;
			const arcs = topo.arcs.map((arc) => {
				let x = 0;
				let y = 0;
				return arc.map(([dx, dy]): Position => [(x += dx) * sx + tx, (y += dy) * sy + ty]);
			});
			const ring = (ids: number[]) =>
				ids.flatMap((i, n) => {
					const a = i < 0 ? [...arcs[~i]].reverse() : arcs[i];
					return n ? a.slice(1) : a;
				});
			const countries = new Map<string, Country>();
			for (const g of topo.objects.countries.geometries) {
				if (!g.id || !g.arcs) continue;
				const polygons = g.type === "Polygon" ? [g.arcs as number[][]] : (g.arcs as number[][][]);
				const coordinates = polygons.map((p) => p.map(ring));
				// a stamp frames the country's main landmass, not the islands far out at sea
				const main = coordinates.map(flatBox).reduce((a, b) => (b.area > a.area ? b : a)).box;
				countries.set(g.id, {
					shape: { type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates } },
					main,
				});
			}
			return countries;
		});
	return world;
}

// a ring's size and frame on the flat map. ponytail: planar on purpose; d3's spherical area and bounds read
// a ring that wraps the date line (Russia's mainland) as nearly the whole globe. A ring that runs on past 180°
// (into Chukotka) is unwrapped first, so its frame sits on the mainland and the far end is clipped by the stamp.
function flatBox([outer]: Position[][]) {
	const lons = outer.map((p) => p[0]);
	const wraps = Math.max(...lons) - Math.min(...lons) > 180;
	// the projection's own arithmetic: 1000 / 360 units a degree, centred on [500, 250]
	const pts = outer.map(([lon, lat]) => [500 + ((wraps && lon < 0 ? lon + 360 : lon) * 1000) / 360, 250 - (lat * 1000) / 360]);
	let area = 0;
	pts.forEach(([x, y], i) => {
		const [nx, ny] = pts[(i + 1) % pts.length];
		area += x * ny - nx * y;
	});
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const box: Box = [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]];
	return { area: Math.abs(area) / 2, box };
}

/* ---------- the card ---------- */
type Draw = {
	canvas: HTMLCanvasElement;
	books: BookEntry[];
	marks: Marks;
	names: Record<string, string>;
	countries: Map<string, Country>;
	options: Options;
	title: string;
	logo: HTMLImageElement | null;
};

export async function drawPostcard({ canvas, books, marks, names, countries, options: opt, title, logo }: Draw) {
	await Promise.all(
		[`400 60px ${SERIF}`, `italic 400 60px ${SERIF}`, `500 20px ${SANS}`].map((f) => document.fonts.load(f).catch(() => { })),
	);
	canvas.width = SIZE;
	canvas.height = SIZE;
	const c = canvas.getContext("2d");
	if (!c) return;
	const K = KINDS[opt.kind];
	const s = postcardStats(books, marks, opt.kind);
	const paper = PAPERS[opt.paper].fill;
	const ink = COLORS[opt.color ?? K.color].fill;

	const text = (str: string, x: number, y: number, font: string, color: string, o: { align?: CanvasTextAlign; ls?: string } = {}) => {
		c.font = font;
		c.fillStyle = color;
		c.textAlign = o.align ?? "left";
		c.textBaseline = "alphabetic";
		c.letterSpacing = o.ls ?? "0px";
		c.fillText(str, x, y);
		const w = c.measureText(str).width;
		c.letterSpacing = "0px";
		return w;
	};
	// the largest size, in 2px steps, at which the line still fits
	const fit = (str: string, font: string, max: number, px: number, min: number) => {
		while (px > min) {
			c.font = font.replace("{s}", String(px));
			if (c.measureText(str).width <= max) break;
			px -= 2;
		}
		return font.replace("{s}", String(px));
	};
	const rule = (y: number) => {
		c.strokeStyle = C.textMuted;
		c.lineWidth = 2;
		c.beginPath();
		c.moveTo(0, y);
		c.lineTo(SIZE, y);
		c.stroke();
	};

	// one postage stamp: perforated paper, the country's own shape in the card's colour, its name beneath
	const stamp = (code: string, x: number, y: number, sw: number, sh: number, sub: string) => {
		c.save();
		c.translate(x, y);
		c.fillStyle = C.field;
		c.fillRect(0, 0, sw, sh);
		if (opt.frame === "framed") {
			// a picture frame: a Line band between two Mark rules
			const bw = sw * 0.045;
			c.strokeStyle = C.border;
			c.lineWidth = bw;
			c.strokeRect(bw / 2, bw / 2, sw - bw, sh - bw);
			c.strokeStyle = C.mark;
			c.lineWidth = 2;
			c.strokeRect(1, 1, sw - 2, sh - 2);
			c.strokeRect(bw, bw, sw - bw * 2, sh - bw * 2);
		} else if (opt.frame === "plain") {
			c.strokeStyle = C.border;
			c.lineWidth = 2;
			c.strokeRect(1, 1, sw - 2, sh - 2);
		} else {
			// perforated: the card's colour punched round the edge
			c.fillStyle = paper;
			const r = sw * 0.032;
			const step = sw * 0.1;
			for (let p = step / 2; p < sw; p += step) {
				c.beginPath();
				c.arc(p, 0, r, 0, Math.PI * 2);
				c.arc(p, sh, r, 0, Math.PI * 2);
				c.fill();
			}
			for (let p = step / 2; p < sh; p += step) {
				c.beginPath();
				c.arc(0, p, r, 0, Math.PI * 2);
				c.arc(sw, p, r, 0, Math.PI * 2);
				c.fill();
			}
		}
		const ip = sw * 0.075;
		const iw = sw - ip * 2;
		const ih = sh - ip - sw * 0.3;
		c.fillStyle = C.background;
		c.fillRect(ip, ip, iw, ih);
		c.strokeStyle = C.border;
		c.lineWidth = 1.5;
		c.strokeRect(ip, ip, iw, ih);

		const country = countries.get(code);
		if (country) {
			const [[x0, y0], [x1, y1]] = country.main;
			const k = Math.min((iw - sw * 0.1) / (x1 - x0 || 1), (ih - sw * 0.1) / (y1 - y0 || 1));
			c.save();
			c.beginPath();
			c.rect(ip, ip, iw, ih);
			c.clip();
			c.translate(ip + iw / 2 - ((x0 + x1) / 2) * k, ip + ih / 2 - ((y0 + y1) / 2) * k);
			c.scale(k, k);
			c.beginPath();
			geoPath(projection, c)(country.shape);
			c.fillStyle = ink;
			c.fill();
			c.strokeStyle = C.text;
			c.lineWidth = 1 / k;
			c.stroke();
			c.restore();
		}
		const fb = opt.frame === "framed" ? sw * 0.045 : 0; // names sit above the frame's band
		if (sub) text(sub, sw / 2, sh - fb - sw * 0.05, `500 ${Math.min(32, Math.round(sw * 0.1))}px ${SANS}`, C.text, { align: "center" });
		const name = names[code] ?? "";
		text(name, sw / 2, sh - fb - (sub ? sw * 0.15 : sw * 0.1), fit(name, `500 {s}px ${SANS}`, sw - ip * 2, Math.min(40, Math.round(sw * 0.13)), 12), C.text, { align: "center" });
		c.restore();
	};

	// a big number with its label under it; the label clears the serif's descending 3, 5, 7, 9
	const stat = (n: number, label: string, x: number, y: number, px: number, lab: number, o: { align?: CanvasTextAlign; of?: boolean } = {}) => {
		const nw = text(String(n), x, y, `400 ${px}px ${SERIF}`, C.text, o);
		if (o.of) text("/ 195", x + nw + px * 0.1, y, `400 ${Math.round(px * 0.3)}px ${SANS}`, C.textSecondary);
		text(label, x + (o.align === "right" ? 0 : 3), y + Math.round(Math.max(lab * 1.5, px * 0.33)), `500 ${lab}px ${SANS}`, C.textSecondary, { ls: "3px", align: o.align });
	};

	// the page: the header band, the stamp sheet, the numbers
	c.fillStyle = paper;
	c.fillRect(0, 0, SIZE, SIZE);
	const mg = 52;
	const headH = 156;
	const markW = logo ? 62 : 0;
	if (logo) c.drawImage(logo, mg, 46, markW, Math.round((markW * 610) / 604)); // the logo's own proportions
	const tx = mg + (logo ? markW + 18 : 0);
	text(title, tx, 100, fit(title, `italic 400 {s}px ${SERIF}`, SIZE - tx - mg, 62, 36), C.text);
	rule(headH);
	text(K.caption, SIZE / 2, headH + 52, `500 28px ${SANS}`, C.textSecondary, { align: "center", ls: "5px" });

	// all: up to 18 stamps in rows of six, bigger when there are few; top 3 or 6: the most-read countries
	const top = headH + 82;
	const sheetB = 752;
	const booksIn = (code: string) => K.count(marks[code]);
	const list = opt.count
		? [...s.order].sort((a, b) => booksIn(b) - booksIn(a) || s.order.indexOf(a) - s.order.indexOf(b)).slice(0, opt.count)
		: s.order;
	const n = list.length;
	const cols = opt.count ? 3 : n <= 2 ? 2 : n <= 6 ? 3 : n <= 12 ? 4 : 6;
	const rows = Math.min(3, Math.max(1, Math.ceil(n / cols)));
	const gap = cols === 6 ? 14 : 22;
	let sw = (SIZE - mg * 2 - gap * (cols - 1)) / cols;
	let sh = sw * 1.12;
	const room = sheetB - top - (n > cols * rows ? 34 : 0);
	if (rows * sh + (rows - 1) * gap > room) {
		sh = (room - (rows - 1) * gap) / rows;
		sw = sh / 1.12;
	}
	const shown = list.slice(0, cols * rows);
	const gridW = cols * sw + (cols - 1) * gap;
	const gx = (SIZE - gridW) / 2;
	const gy = top + (room - (rows * sh + (rows - 1) * gap)) / 2;
	if (!n) {
		// an empty sheet: one dashed space waiting for the first stamp
		const ew = 460;
		const eh = 360;
		const ex = (SIZE - ew) / 2;
		const ey = top + (sheetB - top - eh) / 2;
		c.setLineDash([10, 8]);
		c.strokeStyle = C.textMuted;
		c.lineWidth = 2.5;
		c.strokeRect(ex, ey, ew, eh);
		c.setLineDash([]);
		text("Your first stamp", SIZE / 2, ey + eh / 2 - 6, `italic 400 38px ${SERIF}`, C.textSecondary, { align: "center" });
		text("lands here with your first book", SIZE / 2, ey + eh / 2 + 40, `500 26px ${SANS}`, C.textMuted, { align: "center" });
	}
	const lastRow = Math.floor((shown.length - 1) / cols);
	const inLast = shown.length - lastRow * cols;
	shown.forEach((code, i) => {
		const ox = Math.floor(i / cols) === lastRow ? ((cols - inLast) * (sw + gap)) / 2 : 0; // the last row centres
		const k = booksIn(code);
		stamp(code, gx + ox + (i % cols) * (sw + gap), gy + Math.floor(i / cols) * (sh + gap), sw, sh, opt.count ? `${k} ${plural(k, ["book", "books"])}` : "");
	});
	if (!opt.count && n > shown.length)
		text(`and ${n - shown.length} more`, gx + gridW, gy + rows * sh + (rows - 1) * gap + 34, `italic 400 28px ${SERIF}`, C.textSecondary, { align: "right" });
	rule(sheetB + 20);

	const footY = SIZE - 44;
	const base = Math.round(sheetB + 20 + (footY - 28 - sheetB - 20) * 0.62);
	stat(s.countries, plural(s.countries, K.stat), mg - 6, base, 230, 32, { of: true });
	c.font = `400 132px ${SERIF}`;
	const cw = Math.max(c.measureText(String(s.continents)).width, 220);
	stat(s.continents, plural(s.continents, ["CONTINENT", "CONTINENTS"]), SIZE - mg, base, 132, 28, { align: "right" });
	stat(s.books, plural(s.books, ["BOOK", "BOOKS"]), SIZE - mg - cw - 44, base, 132, 28, { align: "right" });
	text("readtheglobe.app", SIZE - mg, footY, `500 34px ${SANS}`, C.text, { align: "right" }); // full Ink: it has to survive the card being shrunk in a feed
}