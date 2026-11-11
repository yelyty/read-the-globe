import { geoPath } from 'd3-geo';
import type { BookEntry, Goal } from '../../types';
import type { Marks } from '../../utils/atlasMarks';
import { light } from '../../styles/theme.css';
import { goalName, romanDate, today, type Progress } from '../GoalsPage/goals';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import {
  C,
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
  goal: g,
  progress: p,
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
      (f) => document.fonts.load(f).catch(() => {})
    )
  );
  canvas.width = GOAL_W;
  canvas.height = GOAL_H;
  const c = canvas.getContext('2d');
  if (!c) return;
  const { text, fit } = pen(c);
  const wrap = (str: string, font: string, max: number) => {
    c.font = font;
    const out: string[] = [];
    let line = '';
    for (const w of str.split(' ')) {
      const next = line ? `${line} ${w}` : w;
      if (c.measureText(next).width > max && line) {
        out.push(line);
        line = w;
      } else line = next;
    }
    if (line) out.push(line);
    return out;
  };
  const paper = PAPERS[pp].fill;
  const theme = g.kind === 'theme';
  const books = theme
    ? all.filter((b) => b.goals?.some((x) => x.goalId === g.id))
    : [
        ...new Map(
          p.reached
            .flatMap((code) => [...mk[code].set, ...mk[code].author])
            .map((b) => [b.id, b])
        ).values(),
      ];
  const last = [...books].sort((a, b) =>
    readDate(b).localeCompare(readDate(a))
  )[0];
  const stampCode =
    last && !theme
      ? bookCodes(last).find((code) => p.reached.includes(code))
      : undefined;
  const date = g.reachedOn ?? today();
  const draw = (country: Country, k: number) => {
    c.beginPath();
    geoPath(projection, c)(country.shape);
    c.lineWidth = 1.2 / k;
  };

  // the card: the chosen paper, a hairline just inside its edge
  c.fillStyle = paper;
  c.fillRect(0, 0, GOAL_W, GOAL_H);
  c.strokeStyle = C.border;
  c.lineWidth = 2;
  c.strokeRect(22, 22, GOAL_W - 44, GOAL_H - 44);

  // the picture side
  const px0 = 60,
    py0 = 60,
    pw = 660,
    ph = 880;
  c.fillStyle = C.field;
  c.fillRect(px0, py0, pw, ph);
  c.strokeStyle = C.mark;
  c.lineWidth = 2;
  c.strokeRect(px0, py0, pw, ph);
  c.strokeRect(px0 + 10, py0 + 10, pw - 20, ph - 20);
  text(
    m.postcard_greetings(),
    px0 + pw / 2,
    py0 + 104,
    `italic 400 46px ${SERIF}`,
    C.textSecondary,
    { align: 'center' }
  );
  const title = goalName(g.name);
  text(
    title,
    px0 + pw / 2,
    py0 + 206,
    fit(title, `500 {s}px ${SERIF}`, pw - 80, 92, 44),
    C.text,
    { align: 'center' }
  );
  const ax = px0 + 40,
    ay = py0 + 250,
    aw = pw - 80,
    ah = ph - 350;
  if (theme) {
    // a shelf: one spine per book the goal asked for (twelve at most), every one inked
    const n = Math.min(p.total, 12),
      gap = 10;
    const sw = Math.min(46, (aw - 40 - gap * (n - 1)) / n);
    const x0 = ax + (aw - (sw * n + gap * (n - 1))) / 2;
    const base = ay + ah - 40;
    for (let i = 0; i < n; i++) {
      const hgt = 220 + ((i * 37) % 70);
      c.fillStyle = C.accent;
      c.fillRect(x0 + i * (sw + gap), base - hgt, sw, hgt);
      c.strokeStyle = C.text;
      c.lineWidth = 2.5;
      c.strokeRect(x0 + i * (sw + gap), base - hgt, sw, hgt);
    }
    c.strokeStyle = C.text;
    c.lineWidth = 5;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(ax + 20, base + 3);
    c.lineTo(ax + aw - 20, base + 3);
    c.stroke();
  } else {
    // the goal's own map, every country reached in the goal Green
    const shown = p.all
      .map((code) => [code, countries.get(code)] as const)
      .filter((x): x is [string, Country] => !!x[1]);
    if (shown.length) {
      const x0 = Math.min(...shown.map(([, k]) => k.main[0][0])),
        x1 = Math.max(...shown.map(([, k]) => k.main[1][0]));
      const y0 = Math.min(...shown.map(([, k]) => k.main[0][1])),
        y1 = Math.max(...shown.map(([, k]) => k.main[1][1]));
      const k = Math.min(aw / (x1 - x0 || 1), ah / (y1 - y0 || 1)) * 0.94;
      c.save();
      c.beginPath();
      c.rect(ax, ay, aw, ah);
      c.clip();
      c.translate(
        ax + aw / 2 - ((x0 + x1) / 2) * k,
        ay + ah / 2 - ((y0 + y1) / 2) * k
      );
      c.scale(k, k);
      for (const [code, country] of shown) {
        draw(country, k);
        c.fillStyle = p.reached.includes(code) ? C.accent : light.map.land;
        c.fill();
        c.strokeStyle = C.text;
        c.stroke();
      }
      c.restore();
    }
  }
  text(
    (theme ? m.postcard_of_books : m.postcard_of_countries)({
      done: p.done,
      count: p.total,
    }),
    px0 + pw / 2,
    py0 + ph - 46,
    `500 30px ${SANS}`,
    C.textSecondary,
    { align: 'center', ls: '3px' }
  );

  // the back: a divider, then the stamp
  c.strokeStyle = C.textMuted;
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(780, 120);
  c.lineTo(780, 880);
  c.stroke();
  const sx = 1240,
    sy = 70,
    sw = 180,
    sh = 214;
  c.save();
  c.translate(sx, sy); // the stamp sits straight
  c.fillStyle = C.field;
  c.fillRect(0, 0, sw, sh);
  c.fillStyle = paper;
  const r = 6,
    step = 18;
  for (let x = step / 2; x < sw; x += step) {
    c.beginPath();
    c.arc(x, 0, r, 0, Math.PI * 2);
    c.arc(x, sh, r, 0, Math.PI * 2);
    c.fill();
  }
  for (let y = step / 2; y < sh; y += step) {
    c.beginPath();
    c.arc(0, y, r, 0, Math.PI * 2);
    c.arc(sw, y, r, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = C.background;
  c.fillRect(16, 16, sw - 32, sh - 62);
  c.strokeStyle = C.border;
  c.lineWidth = 1.5;
  c.strokeRect(16, 16, sw - 32, sh - 62);
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
    const k = Math.min((sw - 52) / (x1 - x0 || 1), (sh - 82) / (y1 - y0 || 1));
    c.save();
    c.beginPath();
    c.rect(16, 16, sw - 32, sh - 62);
    c.clip();
    c.translate(
      sw / 2 - ((x0 + x1) / 2) * k,
      16 + (sh - 62) / 2 - ((y0 + y1) / 2) * k
    );
    c.scale(k, k);
    draw(country, k);
    c.fillStyle = C.markerAuthor;
    c.fill();
    c.strokeStyle = C.text;
    c.lineWidth = 1 / k;
    c.stroke();
    c.restore();
  } else if (logo) c.drawImage(logo, sw / 2 - 50, 30, 100, 110);
  const stampName = (stampCode && names[stampCode]) || 'Read The Globe';
  text(
    stampName,
    sw / 2,
    sh - 22,
    fit(stampName, `500 {s}px ${SANS}`, sw - 30, 22, 13),
    C.text,
    { align: 'center' }
  );
  c.restore();

  // the postmark, pressed over the stamp's lower left: wavy lines, a double ring, GOAL REACHED round it, the date inside
  c.save();
  c.translate(1186, 266);
  c.rotate((-12 * Math.PI) / 180);
  c.strokeStyle = C.accent;
  c.fillStyle = C.accent;
  c.lineCap = 'round';
  c.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    c.beginPath();
    for (let x = -290; x <= -84; x += 4) {
      const y = -36 + i * 24 + Math.sin(x / 13) * 6;
      if (x === -290) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
  }
  c.lineWidth = 5;
  c.beginPath();
  c.arc(0, 0, 80, 0, Math.PI * 2);
  c.stroke();
  c.lineWidth = 2.5;
  c.beginPath();
  c.arc(0, 0, 50, 0, Math.PI * 2);
  c.stroke();
  c.font = `700 19px ${SANS}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  const ring = [...`${m.postcard_goal_reached_ring()} ✦ `.repeat(2)];
  ring.forEach((ch, i) => {
    c.save();
    c.rotate(-Math.PI / 2 + (i * Math.PI * 2) / ring.length);
    c.translate(0, -65);
    c.fillText(ch, 0, 0);
    c.restore();
  });
  c.font = `600 27px ${SERIF}`;
  c.fillText(romanDate(date), 0, 2);
  c.restore();

  // the message, in the reader's voice; a theme already counts books, so it isn't said twice
  const what = theme
    ? m.postcard_books_for_goal({
        books: m.count_book({ count: p.total }),
        goal: goalName(g.name),
      })
    : m.postcard_every_country({
        goal: goalName(g.name),
        total: p.total,
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
  lines.forEach((ln, i) => text(ln, 830, 450 + i * 54, mf, C.text));
  text(
    `— ${first || m.postcard_me()}`,
    830,
    450 + lines.length * 54 + 16,
    mf,
    C.textSecondary
  );
  // three address lines
  const addr = [
    first ? m.postcard_atlas_named({ name: first }) : m.postcard_atlas_mine(),
    'Read The Globe',
    'readtheglobe.app',
  ];
  addr.forEach((a, i) => {
    const y = 770 + i * 64;
    c.strokeStyle = C.textMuted;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(1010, y + 12);
    c.lineTo(1440, y + 12);
    c.stroke();
    text(a, 1020, y, `500 30px ${SANS}`, C.textSecondary);
  });
}

// the saved file's name: read-the-globe-the-silk-road-postcard.png
export const goalCardName = (g: Goal) =>
  `read-the-globe-${g.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-postcard.png`;
