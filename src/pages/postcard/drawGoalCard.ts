import { geoPath } from 'd3-geo';

import type { BookEntry, Goal } from '../../types';
import type { Marks } from '../../utils/atlasMarks';
import { light } from '../../styles/theme.css';
import { bookCountries } from '../../utils/book';
import { readDate } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import { romanDate } from '../../utils/formatDate';
import { localToday } from '../../utils/readDate';
import { projection, type Country } from '../../utils/countryStamps';
import { goalName } from '../goals/catalogue';
import { type Progress } from '../goals/goalProgress';
import { PALETTE, PAPERS, SANS, SERIF, pen } from './drawPostcard';

export const GOAL_W = 1500;
export const GOAL_H = 1000;

const HALF_TURN_DEG = 180;

/* the card's layout on its GOAL_W × GOAL_H canvas, in pixels */

// the hairline just inside the card's edge
const CARD_EDGE = 22;

// the picture side, on the left
const PICTURE = {
  left: 60,
  top: 60,
  width: 660,
  height: 880,
  /** the second rule inside its frame */
  innerRule: 10,
  greetingDrop: 104,
  greetingPx: 46,
  titleDrop: 206,
  titleMaxPx: 92,
  titleMinPx: 44,
  /** the map or shelf: inset from the sides, its top, and the room left under it */
  artInset: 40,
  artTop: 250,
  artBottomRoom: 100,
  /** a map fills this share of its space, so the outermost countries aren't cut */
  mapFill: 0.94,
  mapLine: 1.2,
  /** "N of M countries" at its foot */
  countRise: 46,
  countPx: 30,
} as const;

// a theme goal's shelf: one spine per book the goal asked for, up to the most
const SHELF = {
  maxSpines: 12,
  gap: 10,
  maxSpineWidth: 46,
  /** room left on both sides of the row, together */
  sideRoom: 40,
  plankRise: 40,
  plankInset: 20,
  plankDrop: 3,
  plankLine: 5,
  spineLine: 2.5,
  /** spines vary in height: the shortest, plus a repeatable step folded into a spread */
  minHeight: 220,
  heightStep: 37,
  heightSpread: 70,
} as const;

// the line between the picture side and the back
const DIVIDER = { x: 780, top: 120, bottom: 880 } as const;

// the stamp, top right on the back
const STAMP = {
  left: 1240,
  top: 70,
  width: 180,
  height: 214,
  holeRadius: 6,
  holeStep: 18,
  /** the picture's inset, and the room under it for the name */
  inset: 16,
  captionRoom: 46,
  pictureLine: 1.5,
  /** space kept round the country inside the stamp, both sides together */
  shapeRoomX: 52,
  shapeRoomY: 82,
  /** the whole country is framed unless its far-flung parts make the frame this many times the main piece's */
  farFlung: 6,
  /** no country: the logo instead */
  logo: { top: 30, width: 100, height: 110 },
  nameRise: 22,
  nameRoom: 30,
  nameMaxPx: 22,
  nameMinPx: 13,
} as const;

// the postmark, pressed over the stamp's lower left
const POSTMARK = {
  x: 1186,
  y: 266,
  tiltDeg: -12,
  /** the wavy cancellation lines trailing off to the left */
  waves: 4,
  waveLine: 4,
  waveFrom: -290,
  waveTo: -84,
  waveStep: 4,
  waveTop: -36,
  waveSpacing: 24,
  wavelength: 13,
  waveHeight: 6,
  /** two rings, GOAL REACHED running between them, the date inside */
  outerRadius: 80,
  outerLine: 5,
  innerRadius: 50,
  innerLine: 2.5,
  textRadius: 65,
  ringPx: 19,
  ringRepeats: 2,
  datePx: 27,
  dateDrop: 2,
} as const;

// the message in the reader's voice, and the signature under it
const MESSAGE = {
  left: 830,
  top: 450,
  lineHeight: 54,
  width: 600,
  maxLines: 5,
  px: 40,
  signatureGap: 16,
} as const;

// three address lines, each on a rule
const ADDRESS = {
  top: 770,
  lineHeight: 64,
  ruleFrom: 1010,
  ruleTo: 1440,
  ruleDrop: 12,
  textLeft: 1020,
  px: 30,
} as const;

type Draw = {
  canvas: HTMLCanvasElement;
  goal: Goal;
  progress: Progress;
  books: BookEntry[];
  marks: Marks;
  names: Record<string, string>;
  countries: Map<string, Country>;
  paper: keyof typeof PAPERS;
  /** the reader's first name, or "" */
  first: string;
  logo: HTMLImageElement | null;
};

/* A postcard for a reached goal, drawn like a real one. Landscape 3:2. Left, the picture side: "Greetings from" over the
   goal's name and its map (or a shelf, for a theme). Right, the back: a stamp from the last country reached, the
   goal-reached postmark over it, a message in the reader's voice and three address lines. */
export async function drawGoalCard({
  canvas,
  goal: goal,
  progress: progress,
  books: all,
  marks: mk,
  names,
  countries,
  paper: pp,
  first,
  logo,
}: Draw) {
  await Promise.all(
    [`400 60px ${SERIF}`, `italic 400 60px ${SERIF}`, `500 20px ${SANS}`].map(
      (font) => document.fonts.load(font).catch(() => {})
    )
  );

  canvas.width = GOAL_W;
  canvas.height = GOAL_H;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;
  const { text, fit } = pen(ctx);

  const wrap = (str: string, font: string, max: number) => {
    ctx.font = font;
    const out: string[] = [];
    let line = '';

    for (const word of str.split(' ')) {
      const next = line ? `${line} ${word}` : word;

      if (ctx.measureText(next).width > max && line) {
        out.push(line);
        line = word;
      } else line = next;
    }

    if (line) out.push(line);

    return out;
  };

  const paper = PAPERS[pp].fill;
  const theme = goal.kind === 'theme';

  const books = theme
    ? all.filter((book) =>
        book.goals?.some((bookGoal) => bookGoal.goalId === goal.id)
      )
    : [
        ...new Map(
          progress.reached
            .flatMap((code) => [...mk[code].set, ...mk[code].author])
            .map((book) => [book.id, book])
        ).values(),
      ];

  const last = [...books].sort((bookA, bookB) =>
    readDate(bookB).localeCompare(readDate(bookA))
  )[0];

  const stampCode =
    last && !theme
      ? bookCountries(last).find((code) => progress.reached.includes(code))
      : undefined;

  const date = goal.reachedOn ?? localToday();

  const draw = (country: Country, scale: number) => {
    ctx.beginPath();
    geoPath(projection, ctx)(country.shape);
    ctx.lineWidth = PICTURE.mapLine / scale;
  };

  // the card: the chosen paper, a hairline just inside its edge
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, GOAL_W, GOAL_H);
  ctx.strokeStyle = PALETTE.border;
  ctx.lineWidth = 2;

  ctx.strokeRect(
    CARD_EDGE,
    CARD_EDGE,
    GOAL_W - CARD_EDGE * 2,
    GOAL_H - CARD_EDGE * 2
  );

  // the picture side
  const px0 = PICTURE.left,
    py0 = PICTURE.top,
    pw = PICTURE.width,
    ph = PICTURE.height;

  ctx.fillStyle = PALETTE.field;
  ctx.fillRect(px0, py0, pw, ph);
  ctx.strokeStyle = PALETTE.mark;
  ctx.lineWidth = 2;
  ctx.strokeRect(px0, py0, pw, ph);

  ctx.strokeRect(
    px0 + PICTURE.innerRule,
    py0 + PICTURE.innerRule,
    pw - PICTURE.innerRule * 2,
    ph - PICTURE.innerRule * 2
  );

  text(
    m.postcard_greetings(),
    px0 + pw / 2,
    py0 + PICTURE.greetingDrop,
    `italic 400 ${PICTURE.greetingPx}px ${SERIF}`,
    PALETTE.textSecondary,
    { align: 'center' }
  );

  const title = goalName(goal.name);

  const ax = px0 + PICTURE.artInset,
    ay = py0 + PICTURE.artTop,
    aw = pw - PICTURE.artInset * 2,
    ah = ph - PICTURE.artTop - PICTURE.artBottomRoom;

  text(
    title,
    px0 + pw / 2,
    py0 + PICTURE.titleDrop,
    fit(
      title,
      `500 {s}px ${SERIF}`,
      aw,
      PICTURE.titleMaxPx,
      PICTURE.titleMinPx
    ),
    PALETTE.text,
    { align: 'center' }
  );

  if (theme) {
    // a shelf: one spine per book the goal asked for, every one inked
    const spines = Math.min(progress.total, SHELF.maxSpines),
      gap = SHELF.gap;

    const sw = Math.min(
      SHELF.maxSpineWidth,
      (aw - SHELF.sideRoom - gap * (spines - 1)) / spines
    );

    const x0 = ax + (aw - (sw * spines + gap * (spines - 1))) / 2;
    const base = ay + ah - SHELF.plankRise;

    for (let i = 0; i < spines; i++) {
      const hgt =
        SHELF.minHeight + ((i * SHELF.heightStep) % SHELF.heightSpread);

      ctx.fillStyle = PALETTE.accent;
      ctx.fillRect(x0 + i * (sw + gap), base - hgt, sw, hgt);
      ctx.strokeStyle = PALETTE.text;
      ctx.lineWidth = SHELF.spineLine;
      ctx.strokeRect(x0 + i * (sw + gap), base - hgt, sw, hgt);
    }

    ctx.strokeStyle = PALETTE.text;
    ctx.lineWidth = SHELF.plankLine;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ax + SHELF.plankInset, base + SHELF.plankDrop);
    ctx.lineTo(ax + aw - SHELF.plankInset, base + SHELF.plankDrop);
    ctx.stroke();
  } else {
    // the goal's own map, every country reached in the goal Green
    const shown = progress.all
      .map((code) => [code, countries.get(code)] as const)
      .filter((entry): entry is [string, Country] => !!entry[1]);

    if (shown.length) {
      const x0 = Math.min(...shown.map(([, land]) => land.main[0][0])),
        x1 = Math.max(...shown.map(([, land]) => land.main[1][0]));

      const y0 = Math.min(...shown.map(([, land]) => land.main[0][1])),
        y1 = Math.max(...shown.map(([, land]) => land.main[1][1]));

      const scale =
        Math.min(aw / (x1 - x0 || 1), ah / (y1 - y0 || 1)) * PICTURE.mapFill;

      ctx.save();
      ctx.beginPath();
      ctx.rect(ax, ay, aw, ah);
      ctx.clip();

      ctx.translate(
        ax + aw / 2 - ((x0 + x1) / 2) * scale,
        ay + ah / 2 - ((y0 + y1) / 2) * scale
      );

      ctx.scale(scale, scale);

      for (const [code, country] of shown) {
        draw(country, scale);

        ctx.fillStyle = progress.reached.includes(code)
          ? PALETTE.accent
          : light.map.land;

        ctx.fill();
        ctx.strokeStyle = PALETTE.text;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  text(
    (theme ? m.postcard_of_books : m.postcard_of_countries)({
      done: progress.done,
      count: progress.total,
    }),
    px0 + pw / 2,
    py0 + ph - PICTURE.countRise,
    `500 ${PICTURE.countPx}px ${SANS}`,
    PALETTE.textSecondary,
    { align: 'center', ls: '3px' }
  );

  // the back: a divider, then the stamp
  ctx.strokeStyle = PALETTE.textMuted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(DIVIDER.x, DIVIDER.top);
  ctx.lineTo(DIVIDER.x, DIVIDER.bottom);
  ctx.stroke();

  const sx = STAMP.left,
    sy = STAMP.top,
    sw = STAMP.width,
    sh = STAMP.height;

  ctx.save();
  ctx.translate(sx, sy); // the stamp sits straight
  ctx.fillStyle = PALETTE.field;
  ctx.fillRect(0, 0, sw, sh);
  ctx.fillStyle = paper;

  const radius = STAMP.holeRadius,
    step = STAMP.holeStep;

  for (let dotX = step / 2; dotX < sw; dotX += step) {
    ctx.beginPath();
    ctx.arc(dotX, 0, radius, 0, Math.PI * 2);
    ctx.arc(dotX, sh, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let dotY = step / 2; dotY < sh; dotY += step) {
    ctx.beginPath();
    ctx.arc(0, dotY, radius, 0, Math.PI * 2);
    ctx.arc(sw, dotY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // the picture inside the stamp, with the name under it
  const pin = STAMP.inset;
  const picW = sw - pin * 2;
  const picH = sh - pin - STAMP.captionRoom;

  ctx.fillStyle = PALETTE.background;
  ctx.fillRect(pin, pin, picW, picH);
  ctx.strokeStyle = PALETTE.border;
  ctx.lineWidth = STAMP.pictureLine;
  ctx.strokeRect(pin, pin, picW, picH);
  const country = stampCode ? countries.get(stampCode) : undefined;

  if (country) {
    // the stamp frames the whole country (Denmark's islands, Japan's chain), unless far-flung parts would shrink it: then just the main piece
    const [[mx0, my0], [mx1, my1]] = country.main;
    const [[wx0, wy0], [wx1, wy1]] = geoPath(projection).bounds(country.shape);

    const [[x0, y0], [x1, y1]] =
      (wx1 - wx0) * (wy1 - wy0) > STAMP.farFlung * (mx1 - mx0) * (my1 - my0)
        ? country.main
        : [
            [wx0, wy0],
            [wx1, wy1],
          ];

    const scale = Math.min(
      (sw - STAMP.shapeRoomX) / (x1 - x0 || 1),
      (sh - STAMP.shapeRoomY) / (y1 - y0 || 1)
    );

    ctx.save();
    ctx.beginPath();
    ctx.rect(pin, pin, picW, picH);
    ctx.clip();

    ctx.translate(
      sw / 2 - ((x0 + x1) / 2) * scale,
      pin + picH / 2 - ((y0 + y1) / 2) * scale
    );

    ctx.scale(scale, scale);
    draw(country, scale);
    ctx.fillStyle = PALETTE.markerAuthor;
    ctx.fill();
    ctx.strokeStyle = PALETTE.text;
    ctx.lineWidth = 1 / scale;
    ctx.stroke();
    ctx.restore();
  } else if (logo)
    ctx.drawImage(
      logo,
      sw / 2 - STAMP.logo.width / 2,
      STAMP.logo.top,
      STAMP.logo.width,
      STAMP.logo.height
    );
  const stampName = (stampCode && names[stampCode]) || 'Read The Globe';

  text(
    stampName,
    sw / 2,
    sh - STAMP.nameRise,
    fit(
      stampName,
      `500 {s}px ${SANS}`,
      sw - STAMP.nameRoom,
      STAMP.nameMaxPx,
      STAMP.nameMinPx
    ),
    PALETTE.text,
    { align: 'center' }
  );

  ctx.restore();

  // the postmark, pressed over the stamp's lower left: wavy lines, a double ring, GOAL REACHED round it, the date inside
  ctx.save();
  ctx.translate(POSTMARK.x, POSTMARK.y);
  ctx.rotate((POSTMARK.tiltDeg * Math.PI) / HALF_TURN_DEG);
  ctx.strokeStyle = PALETTE.accent;
  ctx.fillStyle = PALETTE.accent;
  ctx.lineCap = 'round';
  ctx.lineWidth = POSTMARK.waveLine;

  for (let i = 0; i < POSTMARK.waves; i++) {
    ctx.beginPath();

    for (
      let waveX = POSTMARK.waveFrom;
      waveX <= POSTMARK.waveTo;
      waveX += POSTMARK.waveStep
    ) {
      const waveY =
        POSTMARK.waveTop +
        i * POSTMARK.waveSpacing +
        Math.sin(waveX / POSTMARK.wavelength) * POSTMARK.waveHeight;

      if (waveX === POSTMARK.waveFrom) ctx.moveTo(waveX, waveY);
      else ctx.lineTo(waveX, waveY);
    }

    ctx.stroke();
  }

  ctx.lineWidth = POSTMARK.outerLine;
  ctx.beginPath();
  ctx.arc(0, 0, POSTMARK.outerRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = POSTMARK.innerLine;
  ctx.beginPath();
  ctx.arc(0, 0, POSTMARK.innerRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `700 ${POSTMARK.ringPx}px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const ring = [
    ...`${m.postcard_goal_reached_ring()} ✦ `.repeat(POSTMARK.ringRepeats),
  ];

  ring.forEach((ch, i) => {
    ctx.save();
    ctx.rotate(-Math.PI / 2 + (i * Math.PI * 2) / ring.length);
    ctx.translate(0, -POSTMARK.textRadius);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  ctx.font = `600 ${POSTMARK.datePx}px ${SERIF}`;
  ctx.fillText(romanDate(date), 0, POSTMARK.dateDrop);
  ctx.restore();

  // the message, in the reader's voice; a theme already counts books, so it isn't said twice
  const what = theme
    ? m.postcard_books_for_goal({
        books: m.count_book({ count: progress.total }),
        goal: goalName(goal.name),
      })
    : m.postcard_every_country({
        goal: goalName(goal.name),
        total: progress.total,
        books: m.count_book({ count: books.length }),
      });

  const made = m.postcard_made_it({
    what: what[0].toLocaleUpperCase(getLocale()) + what.slice(1),
  });

  const msg = last
    ? `${made} ${m.postcard_last_one({ title: last.title })}`
    : made;

  const mf = `italic 400 ${MESSAGE.px}px ${SERIF}`;
  const lines = wrap(msg, mf, MESSAGE.width).slice(0, MESSAGE.maxLines);

  lines.forEach((ln, i) =>
    text(
      ln,
      MESSAGE.left,
      MESSAGE.top + i * MESSAGE.lineHeight,
      mf,
      PALETTE.text
    )
  );

  text(
    `— ${first || m.postcard_me()}`,
    MESSAGE.left,
    MESSAGE.top + lines.length * MESSAGE.lineHeight + MESSAGE.signatureGap,
    mf,
    PALETTE.textSecondary
  );

  // three address lines
  const addr = [
    first ? m.postcard_atlas_named({ name: first }) : m.postcard_atlas_mine(),
    'Read The Globe',
    'readtheglobe.app',
  ];

  addr.forEach((address, i) => {
    const lineY = ADDRESS.top + i * ADDRESS.lineHeight;

    ctx.strokeStyle = PALETTE.textMuted;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ADDRESS.ruleFrom, lineY + ADDRESS.ruleDrop);
    ctx.lineTo(ADDRESS.ruleTo, lineY + ADDRESS.ruleDrop);
    ctx.stroke();

    text(
      address,
      ADDRESS.textLeft,
      lineY,
      `500 ${ADDRESS.px}px ${SANS}`,
      PALETTE.textSecondary
    );
  });
}

// the saved file's name: read-the-globe-the-silk-road-postcard.png
export const goalCardName = (goal: Goal) =>
  `read-the-globe-${goal.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-postcard.png`;
