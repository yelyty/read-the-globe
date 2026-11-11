import { geoPath } from 'd3-geo';
import type { BookEntry, Goal } from '../../types';
import type { Marks } from '../../utils/atlasMarks';
import { light } from '../../styles/theme.css';
import { goalName, romanDate, today, type Progress } from '../GoalsPage/goals';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import {
  PALETTE,
  PAPERS,
  SANS,
  SERIF,
  pen,
  projection,
  type Country,
} from './drawPostcard';
import { bookCodes, readDate } from './yearSum';

export const GOAL_W = 1500;
export const GOAL_H = 1000;

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
      ? bookCodes(last).find((code) => progress.reached.includes(code))
      : undefined;

  const date = goal.reachedOn ?? today();

  const draw = (country: Country, scale: number) => {
    ctx.beginPath();
    geoPath(projection, ctx)(country.shape);
    ctx.lineWidth = 1.2 / scale;
  };

  // the card: the chosen paper, a hairline just inside its edge
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, GOAL_W, GOAL_H);
  ctx.strokeStyle = PALETTE.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, GOAL_W - 44, GOAL_H - 44);

  // the picture side
  const px0 = 60,
    py0 = 60,
    pw = 660,
    ph = 880;

  ctx.fillStyle = PALETTE.field;
  ctx.fillRect(px0, py0, pw, ph);
  ctx.strokeStyle = PALETTE.mark;
  ctx.lineWidth = 2;
  ctx.strokeRect(px0, py0, pw, ph);
  ctx.strokeRect(px0 + 10, py0 + 10, pw - 20, ph - 20);

  text(
    m.postcard_greetings(),
    px0 + pw / 2,
    py0 + 104,
    `italic 400 46px ${SERIF}`,
    PALETTE.textSecondary,
    { align: 'center' }
  );

  const title = goalName(goal.name);

  text(
    title,
    px0 + pw / 2,
    py0 + 206,
    fit(title, `500 {s}px ${SERIF}`, pw - 80, 92, 44),
    PALETTE.text,
    { align: 'center' }
  );

  const ax = px0 + 40,
    ay = py0 + 250,
    aw = pw - 80,
    ah = ph - 350;

  if (theme) {
    // a shelf: one spine per book the goal asked for (twelve at most), every one inked
    const spines = Math.min(progress.total, 12),
      gap = 10;

    const sw = Math.min(46, (aw - 40 - gap * (spines - 1)) / spines);
    const x0 = ax + (aw - (sw * spines + gap * (spines - 1))) / 2;
    const base = ay + ah - 40;

    for (let i = 0; i < spines; i++) {
      const hgt = 220 + ((i * 37) % 70);

      ctx.fillStyle = PALETTE.accent;
      ctx.fillRect(x0 + i * (sw + gap), base - hgt, sw, hgt);
      ctx.strokeStyle = PALETTE.text;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x0 + i * (sw + gap), base - hgt, sw, hgt);
    }

    ctx.strokeStyle = PALETTE.text;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ax + 20, base + 3);
    ctx.lineTo(ax + aw - 20, base + 3);
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

      const scale = Math.min(aw / (x1 - x0 || 1), ah / (y1 - y0 || 1)) * 0.94;

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
    py0 + ph - 46,
    `500 30px ${SANS}`,
    PALETTE.textSecondary,
    { align: 'center', ls: '3px' }
  );

  // the back: a divider, then the stamp
  ctx.strokeStyle = PALETTE.textMuted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(780, 120);
  ctx.lineTo(780, 880);
  ctx.stroke();

  const sx = 1240,
    sy = 70,
    sw = 180,
    sh = 214;

  ctx.save();
  ctx.translate(sx, sy); // the stamp sits straight
  ctx.fillStyle = PALETTE.field;
  ctx.fillRect(0, 0, sw, sh);
  ctx.fillStyle = paper;

  const radius = 6,
    step = 18;

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

  ctx.fillStyle = PALETTE.background;
  ctx.fillRect(16, 16, sw - 32, sh - 62);
  ctx.strokeStyle = PALETTE.border;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 16, sw - 32, sh - 62);
  const country = stampCode ? countries.get(stampCode) : undefined;

  if (country) {
    // the stamp frames the whole country (Denmark's islands, Japan's chain), unless far-flung parts would shrink it: then just the main piece
    const [[mx0, my0], [mx1, my1]] = country.main;
    const [[wx0, wy0], [wx1, wy1]] = geoPath(projection).bounds(country.shape);

    const [[x0, y0], [x1, y1]] =
      (wx1 - wx0) * (wy1 - wy0) > 6 * (mx1 - mx0) * (my1 - my0)
        ? country.main
        : [
            [wx0, wy0],
            [wx1, wy1],
          ];

    const scale = Math.min(
      (sw - 52) / (x1 - x0 || 1),
      (sh - 82) / (y1 - y0 || 1)
    );

    ctx.save();
    ctx.beginPath();
    ctx.rect(16, 16, sw - 32, sh - 62);
    ctx.clip();

    ctx.translate(
      sw / 2 - ((x0 + x1) / 2) * scale,
      16 + (sh - 62) / 2 - ((y0 + y1) / 2) * scale
    );

    ctx.scale(scale, scale);
    draw(country, scale);
    ctx.fillStyle = PALETTE.markerAuthor;
    ctx.fill();
    ctx.strokeStyle = PALETTE.text;
    ctx.lineWidth = 1 / scale;
    ctx.stroke();
    ctx.restore();
  } else if (logo) ctx.drawImage(logo, sw / 2 - 50, 30, 100, 110);
  const stampName = (stampCode && names[stampCode]) || 'Read The Globe';

  text(
    stampName,
    sw / 2,
    sh - 22,
    fit(stampName, `500 {s}px ${SANS}`, sw - 30, 22, 13),
    PALETTE.text,
    { align: 'center' }
  );

  ctx.restore();

  // the postmark, pressed over the stamp's lower left: wavy lines, a double ring, GOAL REACHED round it, the date inside
  ctx.save();
  ctx.translate(1186, 266);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = PALETTE.accent;
  ctx.fillStyle = PALETTE.accent;
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;

  for (let i = 0; i < 4; i++) {
    ctx.beginPath();

    for (let waveX = -290; waveX <= -84; waveX += 4) {
      const waveY = -36 + i * 24 + Math.sin(waveX / 13) * 6;

      if (waveX === -290) ctx.moveTo(waveX, waveY);
      else ctx.lineTo(waveX, waveY);
    }

    ctx.stroke();
  }

  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `700 19px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const ring = [...`${m.postcard_goal_reached_ring()} ✦ `.repeat(2)];

  ring.forEach((ch, i) => {
    ctx.save();
    ctx.rotate(-Math.PI / 2 + (i * Math.PI * 2) / ring.length);
    ctx.translate(0, -65);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  ctx.font = `600 27px ${SERIF}`;
  ctx.fillText(romanDate(date), 0, 2);
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

  const mf = `italic 400 40px ${SERIF}`;
  const lines = wrap(msg, mf, 600).slice(0, 5);

  lines.forEach((ln, i) => text(ln, 830, 450 + i * 54, mf, PALETTE.text));

  text(
    `— ${first || m.postcard_me()}`,
    830,
    450 + lines.length * 54 + 16,
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
    const lineY = 770 + i * 64;

    ctx.strokeStyle = PALETTE.textMuted;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(1010, lineY + 12);
    ctx.lineTo(1440, lineY + 12);
    ctx.stroke();
    text(address, 1020, lineY, `500 30px ${SANS}`, PALETTE.textSecondary);
  });
}

// the saved file's name: read-the-globe-the-silk-road-postcard.png
export const goalCardName = (goal: Goal) =>
  `read-the-globe-${goal.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-postcard.png`;
