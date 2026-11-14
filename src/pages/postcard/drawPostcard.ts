import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson';

import type { BookEntry } from '../../types';
import { atlasMarks, type Marks } from '../../utils/atlasMarks';
import { authorCountry, bookCountries, storyCountries } from '../../utils/book';
import { CONTINENT_OF } from '../../utils/continents';
import { worldShapes } from '../../utils/world';
import { light } from '../../styles/theme.css';
import { m } from '../../paraglide/messages.js';

export const SIZE = 1080;

export type Country = { shape: Feature<Polygon | MultiPolygon>; main: Box };

// the flat world the stamps are cut from: 360° across 1000 units, 180° down 500, centred on the middle
const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = WORLD_WIDTH / 2;
const DEGREES_ACROSS = 360;
const UNITS_PER_DEGREE = WORLD_WIDTH / DEGREES_ACROSS;
// a ring spanning more than half the world wraps the date line
const HALF_WORLD_DEG = DEGREES_ACROSS / 2;

export const projection = geoEquirectangular()
  .scale(WORLD_WIDTH / (2 * Math.PI))
  .translate([WORLD_WIDTH / 2, WORLD_HEIGHT / 2]);

// a stamp's outline keeps this share of its longer side clear round the country
const OUTLINE_PAD = 0.06;
// "N / 195": the countries in the world
const COUNTRIES_IN_WORLD = 195;

/* the card's layout on its SIZE × SIZE canvas. Plain numbers are pixels; shares are of a stamp's width */
const STAMP = {
  /** height for a width */
  aspect: 1.12,
  /** the framed style's band */
  band: 0.045,
  /** the perforated style's holes and their spacing */
  holeRadius: 0.032,
  holeStep: 0.1,
  /** the picture's inset, the room under it for the name, and the country's margin inside it */
  inset: 0.075,
  captionRoom: 0.3,
  shapeMargin: 0.1,
  pictureLine: 1.5,
  /** the name, and the books line under it on a top-N card */
  nameRise: 0.1,
  nameRiseOverSub: 0.15,
  nameSize: 0.13,
  nameMaxPx: 40,
  nameMinPx: 12,
  subRise: 0.05,
  subSize: 0.1,
  subMaxPx: 32,
} as const;

const PAGE = {
  margin: 52,
  headHeight: 156,
  logoTop: 46,
  logoWidth: 62,
  /** the logo file's own size, for its proportions */
  logoArt: { width: 604, height: 610 },
  logoGap: 18,
  titleBaseline: 100,
  titleMaxPx: 62,
  titleMinPx: 36,
  /** under the header: a year card's sentence, or the kind's caption */
  lineDrop: 56,
  lineMaxPx: 40,
  lineMinPx: 26,
  captionDrop: 52,
  captionPx: 28,
} as const;

const SHEET = {
  /** below the header's rule */
  top: 82,
  bottom: 752,
  /** the rule under the sheet */
  ruleGap: 20,
  /** a top-N card always shows three across */
  topColumns: 3,
  maxColumns: 6,
  maxRows: 3,
  gap: 22,
  tightGap: 14,
  /** the "and N more" line under a full sheet */
  moreLine: 34,
  morePx: 28,
} as const;

// all stamps: up to this many in a row, so few stamps are drawn bigger
const COLUMNS = [
  { upTo: 2, columns: 2 },
  { upTo: 6, columns: 3 },
  { upTo: 12, columns: 4 },
] as const;

// an empty sheet: one dashed space waiting for the first stamp
const EMPTY = {
  width: 460,
  height: 360,
  dash: 10,
  dashGap: 8,
  line: 2.5,
  titleRise: 6,
  titlePx: 38,
  subDrop: 40,
  subPx: 26,
} as const;

// the numbers at the foot: countries big on the left, continents and books on the right
const STATS = {
  /** the baseline sits this share of the way down the space between the sheet's rule and the footer */
  baselineShare: 0.62,
  footerRoom: 28,
  footBottom: 44,
  footPx: 34,
  nudge: 6,
  bigPx: 230,
  bigLabelPx: 32,
  smallPx: 132,
  smallLabelPx: 28,
  minContinentsWidth: 220,
  between: 44,
  /** "/ 195" beside the big number, as shares of its size */
  ofGap: 0.1,
  ofSize: 0.3,
  /** the label under a number: a line below it, at least this share of the number's size */
  labelLead: 1.5,
  labelDrop: 0.33,
  labelNudge: 3,
} as const;

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
    codes: (book: BookEntry) => [authorCountry(book)],
    count: (mark: Marks[string]) => mark.author.length,
    color: 'rust',
    caption: m.postcard_caption_authors,
    stat: m.label_authors_country,
    name: m.postcard_kind_authors,
    share: (count: number) => m.postcard_share_authors({ n: count }),
  },
  settings: {
    codes: storyCountries,
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
  codes: bookCountries,
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
/** how many stamps a card shows: the top 3 or 6, or 0 for every one */
export type StampCount = 0 | 3 | 6;

export type Options = {
  kind: Kind;
  count: StampCount;
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

/* ---------- the world's countries, framed for stamps ---------- */
type Box = [[number, number], [number, number]];

let stamped: Promise<Map<string, Country>> | null = null;

// the map's shapes (from the one world loader), each with the frame of its main landmass
export function loadCountries() {
  stamped ??= worldShapes().then((shapes) => {
    const countries = new Map<string, Country>();

    for (const [code, shape] of Object.entries(shapes)) {
      const { geometry } = shape;

      if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')
        continue;

      const coordinates =
        geometry.type === 'Polygon'
          ? [geometry.coordinates]
          : geometry.coordinates;

      // a stamp frames the country's main landmass, not the islands far out at sea
      const { box: main } = coordinates
        .map(flatBox)
        .reduce((largest, candidate) =>
          candidate.area > largest.area ? candidate : largest
        );

      countries.set(code, {
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

  return stamped;
}

// a ring's size and frame on the flat map. ponytail: planar on purpose; d3's spherical area and bounds read
// a ring that wraps the date line (Russia's mainland) as nearly the whole globe. A ring that runs on past 180°
// (into Chukotka) is unwrapped first, so its frame sits on the mainland and the far end is clipped by the stamp.
function flatBox([outer]: Position[][]) {
  const lons = outer.map((point) => point[0]);
  const wraps = Math.max(...lons) - Math.min(...lons) > HALF_WORLD_DEG;

  // the projection's own arithmetic: UNITS_PER_DEGREE a degree, centred on the middle of the world
  const pts = outer.map(([lon, lat]) => [
    WORLD_WIDTH / 2 +
      (wraps && lon < 0 ? lon + DEGREES_ACROSS : lon) * UNITS_PER_DEGREE,
    WORLD_HEIGHT / 2 - lat * UNITS_PER_DEGREE,
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
  const pad = Math.max(x1 - x0, y1 - y0) * OUTLINE_PAD;

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
      const bw = sw * STAMP.band;

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
      const radius = sw * STAMP.holeRadius;
      const step = sw * STAMP.holeStep;

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

    const ip = sw * STAMP.inset;
    const iw = sw - ip * 2;
    const ih = sh - ip - sw * STAMP.captionRoom;

    ctx.fillStyle = PALETTE.background;
    ctx.fillRect(ip, ip, iw, ih);
    ctx.strokeStyle = PALETTE.border;
    ctx.lineWidth = STAMP.pictureLine;
    ctx.strokeRect(ip, ip, iw, ih);

    const country = countries.get(code);

    if (country) {
      const [[x0, y0], [x1, y1]] = country.main;

      const scale = Math.min(
        (iw - sw * STAMP.shapeMargin) / (x1 - x0 || 1),
        (ih - sw * STAMP.shapeMargin) / (y1 - y0 || 1)
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

    const fb = opt.frame === 'framed' ? sw * STAMP.band : 0; // names sit above the frame's band

    if (sub)
      text(
        sub,
        sw / 2,
        sh - fb - sw * STAMP.subRise,
        `500 ${Math.min(STAMP.subMaxPx, Math.round(sw * STAMP.subSize))}px ${SANS}`,
        PALETTE.text,
        { align: 'center' }
      );
    const name = names[code] ?? '';

    text(
      name,
      sw / 2,
      sh - fb - sw * (sub ? STAMP.nameRiseOverSub : STAMP.nameRise),
      fit(
        name,
        `500 {s}px ${SANS}`,
        sw - ip * 2,
        Math.min(STAMP.nameMaxPx, Math.round(sw * STAMP.nameSize)),
        STAMP.nameMinPx
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
        `/ ${COUNTRIES_IN_WORLD}`,
        posX + nw + px * STATS.ofGap,
        posY,
        `400 ${Math.round(px * STATS.ofSize)}px ${SANS}`,
        PALETTE.textSecondary
      );

    text(
      label,
      posX + (opts.align === 'right' ? 0 : STATS.labelNudge),
      posY + Math.round(Math.max(lab * STATS.labelLead, px * STATS.labelDrop)),
      `500 ${lab}px ${SANS}`,
      PALETTE.textSecondary,
      { ls: '3px', align: opts.align }
    );
  };

  // the page: the header band, the stamp sheet, the numbers
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, SIZE, SIZE);
  const mg = PAGE.margin;
  const headH = PAGE.headHeight;
  const markW = logo ? PAGE.logoWidth : 0;
  const { logoArt } = PAGE;

  if (logo)
    ctx.drawImage(
      logo,
      mg,
      PAGE.logoTop,
      markW,
      Math.round((markW * logoArt.height) / logoArt.width)
    );
  const tx = mg + (logo ? markW + PAGE.logoGap : 0);

  text(
    title,
    tx,
    PAGE.titleBaseline,
    fit(
      title,
      `italic 400 {s}px ${SERIF}`,
      SIZE - tx - mg,
      PAGE.titleMaxPx,
      PAGE.titleMinPx
    ),
    PALETTE.text
  );

  rule(headH);
  if (year)
    text(
      year.line,
      SIZE / 2,
      headH + PAGE.lineDrop,
      fit(
        year.line,
        `italic 400 {s}px ${SERIF}`,
        SIZE - mg * 2,
        PAGE.lineMaxPx,
        PAGE.lineMinPx
      ),
      PALETTE.text,
      { align: 'center' }
    ); // the year in one sentence
  else
    text(
      spec.caption?.() ?? '',
      SIZE / 2,
      headH + PAGE.captionDrop,
      `500 ${PAGE.captionPx}px ${SANS}`,
      PALETTE.textSecondary,
      { align: 'center', ls: '5px' }
    );

  // all: up to 18 stamps in rows of six, bigger when there are few; top 3 or 6: the most-read countries
  const top = headH + SHEET.top;
  const sheetB = SHEET.bottom;
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

  const cols: number = opt.count
    ? SHEET.topColumns
    : (COLUMNS.find((step) => count <= step.upTo)?.columns ?? SHEET.maxColumns);

  const rows = Math.min(SHEET.maxRows, Math.max(1, Math.ceil(count / cols)));
  const gap = cols === SHEET.maxColumns ? SHEET.tightGap : SHEET.gap;
  let sw = (SIZE - mg * 2 - gap * (cols - 1)) / cols;
  let sh = sw * STAMP.aspect;
  const room = sheetB - top - (count > cols * rows ? SHEET.moreLine : 0);

  if (rows * sh + (rows - 1) * gap > room) {
    sh = (room - (rows - 1) * gap) / rows;
    sw = sh / STAMP.aspect;
  }

  const shown = list.slice(0, cols * rows);
  const gridW = cols * sw + (cols - 1) * gap;
  const gx = (SIZE - gridW) / 2;
  const gy = top + (room - (rows * sh + (rows - 1) * gap)) / 2;

  if (!count) {
    const ew = EMPTY.width;
    const eh = EMPTY.height;
    const ex = (SIZE - ew) / 2;
    const ey = top + (sheetB - top - eh) / 2;

    ctx.setLineDash([EMPTY.dash, EMPTY.dashGap]);
    ctx.strokeStyle = PALETTE.textMuted;
    ctx.lineWidth = EMPTY.line;
    ctx.strokeRect(ex, ey, ew, eh);
    ctx.setLineDash([]);

    text(
      m.postcard_first_stamp(),
      SIZE / 2,
      ey + eh / 2 - EMPTY.titleRise,
      `italic 400 ${EMPTY.titlePx}px ${SERIF}`,
      PALETTE.textSecondary,
      { align: 'center' }
    );

    text(
      m.postcard_first_stamp_sub(),
      SIZE / 2,
      ey + eh / 2 + EMPTY.subDrop,
      `500 ${EMPTY.subPx}px ${SANS}`,
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
      gy + rows * sh + (rows - 1) * gap + SHEET.moreLine,
      `italic 400 ${SHEET.morePx}px ${SERIF}`,
      PALETTE.textSecondary,
      { align: 'right' }
    );
  const sheetRule = sheetB + SHEET.ruleGap;

  rule(sheetRule);

  const footY = SIZE - STATS.footBottom;

  const base = Math.round(
    sheetRule + (footY - STATS.footerRoom - sheetRule) * STATS.baselineShare
  );

  stat(
    stats.countries,
    spec.stat({ count: stats.countries }),
    mg - STATS.nudge,
    base,
    STATS.bigPx,
    STATS.bigLabelPx,
    {
      of: true,
    }
  );

  ctx.font = `400 ${STATS.smallPx}px ${SERIF}`;

  const cw = Math.max(
    ctx.measureText(String(stats.continents)).width,
    STATS.minContinentsWidth
  );

  stat(
    stats.continents,
    m.label_continent({ count: stats.continents }),
    SIZE - mg,
    base,
    STATS.smallPx,
    STATS.smallLabelPx,
    { align: 'right' }
  );

  stat(
    stats.books,
    m.label_book({ count: stats.books }),
    SIZE - mg - cw - STATS.between,
    base,
    STATS.smallPx,
    STATS.smallLabelPx,
    { align: 'right' }
  );

  text(
    'readtheglobe.app',
    SIZE - mg,
    footY,
    `500 ${STATS.footPx}px ${SANS}`,
    PALETTE.text,
    {
      align: 'right',
    }
  ); // full Ink: it has to survive the card being shrunk in a feed
}
