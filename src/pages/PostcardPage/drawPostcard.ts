import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson';
import type { BookEntry } from '../../types';
import { atlasMarks, type Marks } from '../../utils/atlasMarks';
import { CONTINENT_OF } from '../../utils/continents';
import { light } from '../../styles/theme.css';
import { bookCodes } from './yearSum';
import { m } from '../../paraglide/messages.js';

export const SIZE = 1080;

export type Country = { shape: Feature<Polygon | MultiPolygon>; main: Box };

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';

export const projection = geoEquirectangular()
  .scale(1000 / (2 * Math.PI))
  .translate([500, 250]);

export const PALETTE = light.color;
export const SERIF = light.font.display;
export const SANS = light.font.sans;

export const PAPERS = {
  paper: { name: m.postcard_paper_paper, fill: PALETTE.surface },
  parchment: { name: m.postcard_paper_parchment, fill: PALETTE.backgroundDeep },
  sage: { name: m.postcard_paper_sage, fill: PALETTE.oliveWash },
  rose: { name: m.postcard_paper_rose, fill: PALETTE.rustWash },
} as const;

export const COLORS = {
  rust: { name: m.postcard_color_rust, fill: PALETTE.markerAuthor },
  olive: { name: m.postcard_color_olive, fill: PALETTE.markerSetting },
  green: { name: m.postcard_color_green, fill: PALETTE.accent },
  gold: { name: m.postcard_color_gold, fill: PALETTE.secondary },
  ink: { name: m.postcard_color_ink, fill: PALETTE.text },
} as const;

/* A postcard collects one kind of country, never both: where the authors come from, or where the stories are set.
   Its words, colour and numbers all follow that choice. */
export const KINDS = {
  authors: {
    codes: (book: BookEntry) => [book.author?.country?.code],
    count: (mark: Marks[string]) => mark.author.length,
    color: 'rust',
    caption: m.postcard_caption_authors,
    stat: m.label_authors_country,
    name: m.postcard_kind_authors,
    share: (count: number) => m.postcard_share_authors({ n: count }),
  },
  settings: {
    codes: (book: BookEntry) =>
      (book.places ?? []).map((place) => place.countryCode),
    count: (mark: Marks[string]) => mark.set.length,
    color: 'olive',
    caption: m.postcard_caption_settings,
    stat: m.label_story_country,
    name: m.postcard_kind_settings,
    share: (count: number) => m.postcard_share_settings({ n: count }),
  },
} as const;

// a year-end card counts every country of that year's books, both marks, in the goal Green unless a colour is chosen
export const YEAR = {
  codes: bookCodes,
  count: (mark: Marks[string]) => new Set([...mark.set, ...mark.author]).size,
  color: 'green',
  stat: m.label_country,
} as const;
// what a card collects: the countries of each book, how many books a country has, its colour and its numbers' noun
type Spec = {
  codes: (b: BookEntry) => (string | null | undefined)[];
  count: (m: Marks[string]) => number;
  color: keyof typeof COLORS;
  /** the noun under the countries' big number, for a count */
  stat: (i: { count: number }) => string;
  caption?: () => string;
};

export type Kind = keyof typeof KINDS;
export type Options = {
  kind: Kind;
  count: 0 | 3 | 6; // 0: every stamp
  frame: 'perforated' | 'framed' | 'plain';
  color: keyof typeof COLORS | null; // null: the kind's own mark, rust for authors, olive for settings
  paper: keyof typeof PAPERS;
};

// the kind's countries, newest book first, and the numbers under the stamps
export function postcardStats(books: BookEntry[], marks: Marks, spec: Spec) {
  const known = (code: string | null | undefined): code is string =>
    !!code && !!marks[code] && spec.count(marks[code]) > 0;

  const order: string[] = [];

  for (const book of books)
    for (const code of spec.codes(book))
      if (known(code) && !order.includes(code)) order.push(code);

  return {
    order,
    countries: order.length,
    continents: new Set(order.map((code) => CONTINENT_OF[code]).filter(Boolean))
      .size,
    books: books.filter((book) => spec.codes(book).some(known)).length,
  };
}

/* ---------- the world, decoded once from the map's TopoJSON ---------- */
type Topology = {
  transform: { scale: [number, number]; translate: [number, number] };
  arcs: [number, number][][];
  objects: {
    countries: {
      geometries: {
        id?: string;
        type: string;
        arcs?: number[][] | number[][][];
      }[];
    };
  };
};
type Box = [[number, number], [number, number]];

let world: Promise<Map<string, Country>> | null = null;

// ponytail: a 20-line TopoJSON reader instead of topojson-client; world-atlas is always quantized, so only that case is handled
export function loadCountries() {
  world ??= fetch(GEO_URL)
    .then((response) => response.json() as Promise<Topology>)
    .then((topo) => {
      const [sx, sy] = topo.transform.scale;
      const [tx, ty] = topo.transform.translate;

      const arcs = topo.arcs.map((arc) => {
        let arcX = 0;
        let arcY = 0;

        return arc.map(([dx, dy]): Position => [
          (arcX += dx) * sx + tx,
          (arcY += dy) * sy + ty,
        ]);
      });

      const ring = (ids: number[]) =>
        ids.flatMap((i, position) => {
          const arc = i < 0 ? [...arcs[~i]].reverse() : arcs[i];

          return position ? arc.slice(1) : arc;
        });

      const countries = new Map<string, Country>();

      for (const geometry of topo.objects.countries.geometries) {
        if (!geometry.id || !geometry.arcs) continue;

        const polygons =
          geometry.type === 'Polygon'
            ? [geometry.arcs as number[][]]
            : (geometry.arcs as number[][][]);

        const coordinates = polygons.map((polygon) => polygon.map(ring));

        // a stamp frames the country's main landmass, not the islands far out at sea
        const main = coordinates
          .map(flatBox)
          .reduce((largest, candidate) =>
            candidate.area > largest.area ? candidate : largest
          ).box;

        countries.set(geometry.id, {
          shape: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'MultiPolygon', coordinates },
          },
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
  const lons = outer.map((point) => point[0]);
  const wraps = Math.max(...lons) - Math.min(...lons) > 180;

  // the projection's own arithmetic: 1000 / 360 units a degree, centred on [500, 250]
  const pts = outer.map(([lon, lat]) => [
    500 + ((wraps && lon < 0 ? lon + 360 : lon) * 1000) / 360,
    250 - (lat * 1000) / 360,
  ]);

  let area = 0;

  pts.forEach(([px, py], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length];

    area += px * ny - nx * py;
  });

  const xs = pts.map((point) => point[0]);
  const ys = pts.map((point) => point[1]);

  const box: Box = [
    [Math.min(...xs), Math.min(...ys)],
    [Math.max(...xs), Math.max(...ys)],
  ];

  return { area: Math.abs(area) / 2, box };
}

// a country's outline as SVG, framed on its main landmass like a stamp (the Shelf's country header)
export function countryStamp({ shape, main: [[x0, y0], [x1, y1]] }: Country) {
  const pad = Math.max(x1 - x0, y1 - y0) * 0.06;

  const viewBox = [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2]
    .map((value) => value.toFixed(1))
    .join(' ');

  return {
    d: geoPath(projection)(shape) ?? '',
    viewBox,
    width: x1 - x0 + pad * 2,
  };
}

/* ---------- the card ---------- */
// the canvas's two text tools, shared with the goal card
export const pen = (ctx: CanvasRenderingContext2D) => ({
  text: (
    str: string,
    posX: number,
    posY: number,
    font: string,
    color: string,
    opts: { align?: CanvasTextAlign; ls?: string } = {}
  ) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = opts.align ?? 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = opts.ls ?? '0px';
    ctx.fillText(str, posX, posY);
    const width = ctx.measureText(str).width;

    ctx.letterSpacing = '0px';

    return width;
  },
  // the largest size, in 2px steps, at which the line still fits
  fit: (str: string, font: string, max: number, px: number, min: number) => {
    while (px > min) {
      ctx.font = font.replace('{s}', String(px));
      if (ctx.measureText(str).width <= max) break;
      px -= 2;
    }

    return font.replace('{s}', String(px));
  },
});

type Draw = {
  canvas: HTMLCanvasElement;
  books: BookEntry[];
  marks: Marks;
  names: Record<string, string>;
  countries: Map<string, Country>;
  options: Options;
  title: string;
  logo: HTMLImageElement | null;
  /** a year-end card: only that year's books, both kinds of country, and its one-line summary */
  year: { books: BookEntry[]; line: string } | null;
};

export async function drawPostcard({
  canvas,
  names,
  countries,
  options: opt,
  title,
  logo,
  year,
  ...all
}: Draw) {
  await Promise.all(
    [`400 60px ${SERIF}`, `italic 400 60px ${SERIF}`, `500 20px ${SANS}`].map(
      (font) => document.fonts.load(font).catch(() => {})
    )
  );

  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;
  const spec: Spec = year ? YEAR : KINDS[opt.kind];
  const books = year ? year.books : all.books;
  const marks = year ? atlasMarks(year.books) : all.marks;
  const stats = postcardStats(books, marks, spec);
  const paper = PAPERS[opt.paper].fill;
  const ink = COLORS[opt.color ?? spec.color].fill;

  const { text, fit } = pen(ctx);

  const rule = (lineY: number) => {
    ctx.strokeStyle = PALETTE.textMuted;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(SIZE, lineY);
    ctx.stroke();
  };

  // one postage stamp: perforated paper, the country's own shape in the card's colour, its name beneath
  const stamp = (
    code: string,
    posX: number,
    posY: number,
    sw: number,
    sh: number,
    sub: string
  ) => {
    ctx.save();
    ctx.translate(posX, posY);
    ctx.fillStyle = PALETTE.field;
    ctx.fillRect(0, 0, sw, sh);

    if (opt.frame === 'framed') {
      // a picture frame: a Line band between two Mark rules
      const bw = sw * 0.045;

      ctx.strokeStyle = PALETTE.border;
      ctx.lineWidth = bw;
      ctx.strokeRect(bw / 2, bw / 2, sw - bw, sh - bw);
      ctx.strokeStyle = PALETTE.mark;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, sw - 2, sh - 2);
      ctx.strokeRect(bw, bw, sw - bw * 2, sh - bw * 2);
    } else if (opt.frame === 'plain') {
      ctx.strokeStyle = PALETTE.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, sw - 2, sh - 2);
    } else {
      // perforated: the card's colour punched round the edge
      ctx.fillStyle = paper;
      const radius = sw * 0.032;
      const step = sw * 0.1;

      for (let pos = step / 2; pos < sw; pos += step) {
        ctx.beginPath();
        ctx.arc(pos, 0, radius, 0, Math.PI * 2);
        ctx.arc(pos, sh, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let pos = step / 2; pos < sh; pos += step) {
        ctx.beginPath();
        ctx.arc(0, pos, radius, 0, Math.PI * 2);
        ctx.arc(sw, pos, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const ip = sw * 0.075;
    const iw = sw - ip * 2;
    const ih = sh - ip - sw * 0.3;

    ctx.fillStyle = PALETTE.background;
    ctx.fillRect(ip, ip, iw, ih);
    ctx.strokeStyle = PALETTE.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ip, ip, iw, ih);

    const country = countries.get(code);

    if (country) {
      const [[x0, y0], [x1, y1]] = country.main;

      const scale = Math.min(
        (iw - sw * 0.1) / (x1 - x0 || 1),
        (ih - sw * 0.1) / (y1 - y0 || 1)
      );

      ctx.save();
      ctx.beginPath();
      ctx.rect(ip, ip, iw, ih);
      ctx.clip();

      ctx.translate(
        ip + iw / 2 - ((x0 + x1) / 2) * scale,
        ip + ih / 2 - ((y0 + y1) / 2) * scale
      );

      ctx.scale(scale, scale);
      ctx.beginPath();
      geoPath(projection, ctx)(country.shape);
      ctx.fillStyle = ink;
      ctx.fill();
      ctx.strokeStyle = PALETTE.text;
      ctx.lineWidth = 1 / scale;
      ctx.stroke();
      ctx.restore();
    }

    const fb = opt.frame === 'framed' ? sw * 0.045 : 0; // names sit above the frame's band

    if (sub)
      text(
        sub,
        sw / 2,
        sh - fb - sw * 0.05,
        `500 ${Math.min(32, Math.round(sw * 0.1))}px ${SANS}`,
        PALETTE.text,
        { align: 'center' }
      );
    const name = names[code] ?? '';

    text(
      name,
      sw / 2,
      sh - fb - (sub ? sw * 0.15 : sw * 0.1),
      fit(
        name,
        `500 {s}px ${SANS}`,
        sw - ip * 2,
        Math.min(40, Math.round(sw * 0.13)),
        12
      ),
      PALETTE.text,
      { align: 'center' }
    );

    ctx.restore();
  };

  // a big number with its label under it; the label clears the serif's descending 3, 5, 7, 9
  const stat = (
    value: number,
    label: string,
    posX: number,
    posY: number,
    px: number,
    lab: number,
    opts: { align?: CanvasTextAlign; of?: boolean } = {}
  ) => {
    const nw = text(
      String(value),
      posX,
      posY,
      `400 ${px}px ${SERIF}`,
      PALETTE.text,
      opts
    );

    if (opts.of)
      text(
        '/ 195',
        posX + nw + px * 0.1,
        posY,
        `400 ${Math.round(px * 0.3)}px ${SANS}`,
        PALETTE.textSecondary
      );

    text(
      label,
      posX + (opts.align === 'right' ? 0 : 3),
      posY + Math.round(Math.max(lab * 1.5, px * 0.33)),
      `500 ${lab}px ${SANS}`,
      PALETTE.textSecondary,
      { ls: '3px', align: opts.align }
    );
  };

  // the page: the header band, the stamp sheet, the numbers
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, SIZE, SIZE);
  const mg = 52;
  const headH = 156;
  const markW = logo ? 62 : 0;

  if (logo) ctx.drawImage(logo, mg, 46, markW, Math.round((markW * 610) / 604)); // the logo's own proportions
  const tx = mg + (logo ? markW + 18 : 0);

  text(
    title,
    tx,
    100,
    fit(title, `italic 400 {s}px ${SERIF}`, SIZE - tx - mg, 62, 36),
    PALETTE.text
  );

  rule(headH);
  if (year)
    text(
      year.line,
      SIZE / 2,
      headH + 56,
      fit(year.line, `italic 400 {s}px ${SERIF}`, SIZE - mg * 2, 40, 26),
      PALETTE.text,
      { align: 'center' }
    ); // the year in one sentence
  else
    text(
      spec.caption?.() ?? '',
      SIZE / 2,
      headH + 52,
      `500 28px ${SANS}`,
      PALETTE.textSecondary,
      { align: 'center', ls: '5px' }
    );

  // all: up to 18 stamps in rows of six, bigger when there are few; top 3 or 6: the most-read countries
  const top = headH + 82;
  const sheetB = 752;
  const booksIn = (code: string) => spec.count(marks[code]);

  const list = opt.count
    ? [...stats.order]
        .sort(
          (first, second) =>
            booksIn(second) - booksIn(first) ||
            stats.order.indexOf(first) - stats.order.indexOf(second)
        )
        .slice(0, opt.count)
    : stats.order;

  const count = list.length;

  const cols = opt.count
    ? 3
    : count <= 2
      ? 2
      : count <= 6
        ? 3
        : count <= 12
          ? 4
          : 6;

  const rows = Math.min(3, Math.max(1, Math.ceil(count / cols)));
  const gap = cols === 6 ? 14 : 22;
  let sw = (SIZE - mg * 2 - gap * (cols - 1)) / cols;
  let sh = sw * 1.12;
  const room = sheetB - top - (count > cols * rows ? 34 : 0);

  if (rows * sh + (rows - 1) * gap > room) {
    sh = (room - (rows - 1) * gap) / rows;
    sw = sh / 1.12;
  }

  const shown = list.slice(0, cols * rows);
  const gridW = cols * sw + (cols - 1) * gap;
  const gx = (SIZE - gridW) / 2;
  const gy = top + (room - (rows * sh + (rows - 1) * gap)) / 2;

  if (!count) {
    // an empty sheet: one dashed space waiting for the first stamp
    const ew = 460;
    const eh = 360;
    const ex = (SIZE - ew) / 2;
    const ey = top + (sheetB - top - eh) / 2;

    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = PALETTE.textMuted;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(ex, ey, ew, eh);
    ctx.setLineDash([]);

    text(
      m.postcard_first_stamp(),
      SIZE / 2,
      ey + eh / 2 - 6,
      `italic 400 38px ${SERIF}`,
      PALETTE.textSecondary,
      { align: 'center' }
    );

    text(
      m.postcard_first_stamp_sub(),
      SIZE / 2,
      ey + eh / 2 + 40,
      `500 26px ${SANS}`,
      PALETTE.textMuted,
      { align: 'center' }
    );
  }

  const lastRow = Math.floor((shown.length - 1) / cols);
  const inLast = shown.length - lastRow * cols;

  shown.forEach((code, i) => {
    const ox =
      Math.floor(i / cols) === lastRow ? ((cols - inLast) * (sw + gap)) / 2 : 0; // the last row centres

    const bookCount = booksIn(code);

    stamp(
      code,
      gx + ox + (i % cols) * (sw + gap),
      gy + Math.floor(i / cols) * (sh + gap),
      sw,
      sh,
      opt.count ? m.count_book({ count: bookCount }) : ''
    );
  });

  if (!opt.count && count > shown.length)
    text(
      m.postcard_more({ n: count - shown.length }),
      gx + gridW,
      gy + rows * sh + (rows - 1) * gap + 34,
      `italic 400 28px ${SERIF}`,
      PALETTE.textSecondary,
      { align: 'right' }
    );
  rule(sheetB + 20);

  const footY = SIZE - 44;
  const base = Math.round(sheetB + 20 + (footY - 28 - sheetB - 20) * 0.62);

  stat(
    stats.countries,
    spec.stat({ count: stats.countries }),
    mg - 6,
    base,
    230,
    32,
    {
      of: true,
    }
  );

  ctx.font = `400 132px ${SERIF}`;
  const cw = Math.max(ctx.measureText(String(stats.continents)).width, 220);

  stat(
    stats.continents,
    m.label_continent({ count: stats.continents }),
    SIZE - mg,
    base,
    132,
    28,
    { align: 'right' }
  );

  stat(
    stats.books,
    m.label_book({ count: stats.books }),
    SIZE - mg - cw - 44,
    base,
    132,
    28,
    { align: 'right' }
  );

  text('readtheglobe.app', SIZE - mg, footY, `500 34px ${SANS}`, PALETTE.text, {
    align: 'right',
  }); // full Ink: it has to survive the card being shrunk in a feed
}
