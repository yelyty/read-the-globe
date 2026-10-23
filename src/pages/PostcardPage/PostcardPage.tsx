import { useEffect, useMemo, useRef, useState } from 'react';
import { getRouteApi, Link } from '@tanstack/react-router';
import {
  DownloadSimpleIcon,
  PushPinIcon,
  ShareFatIcon,
} from '@phosphor-icons/react';
import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { atlasMarks } from '../../utils/atlasMarks';
import Logo from '../../components/Logo/Logo';
import {
  COLORS,
  KINDS,
  PAPERS,
  SIZE,
  drawPostcard,
  loadCountries,
  postcardStats,
  type Kind,
  type Options,
} from './drawPostcard';
import * as s from './PostCardPage.css';

const app = getRouteApi('/app');

const COUNTS = [
  { value: 3, label: 'Top 3' },
  { value: 6, label: 'Top 6' },
  { value: 0, label: 'All' },
] as const;
const FRAMES = [
  { value: 'perforated', label: 'Perforated' },
  { value: 'framed', label: 'Framed' },
  { value: 'plain', label: 'Plain' },
] as const;

const fileName = () =>
  `read-the-globe-postcard-${new Date().toISOString().slice(0, 10)}.png`;

// the logo as a picture the canvas can draw: the same SVG the header shows, given its own size
const logoImage = (svg: SVGSVGElement) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute('width', '604');
    copy.setAttribute('height', '610');
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(copy));
  });

const PostcardPage = () => {
  const { books } = app.useLoaderData();
  const { user } = useAuth();
  const names = useCountryNames();
  const [options, setOptions] = useState<Options>({
    kind: 'authors',
    count: 0,
    frame: 'perforated',
    color: null,
    paper: 'paper',
  });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const marks = useMemo(() => atlasMarks(books), [books]);
  const counts = {
    authors: postcardStats(books, marks, 'authors').countries,
    settings: postcardStats(books, marks, 'settings').countries,
  };
  const stats = postcardStats(books, marks, options.kind);
  const firstName = String(user?.signUpName ?? '')
    .trim()
    .split(/\s+/)[0];
  const title = firstName ? `${firstName}’s Reading Atlas` : 'My Reading Atlas';
  const color = options.color ?? KINDS[options.kind].color;

  const set = (change: Partial<Options>) => {
    setStatus('');
    setOptions((o) => ({ ...o, ...change }));
  };

  useEffect(() => {
    const cv = canvas.current;
    const svg = logoRef.current?.querySelector('svg');
    if (!cv || !books.length) return;
    let stale = false;
    Promise.all([loadCountries(), svg ? logoImage(svg) : null]).then(
      ([countries, logo]) => {
        if (!stale)
          drawPostcard({
            canvas: cv,
            books,
            marks,
            names,
            countries,
            options,
            title,
            logo,
          });
      }
    );
    return () => {
      stale = true;
    };
  }, [books, marks, names, options, title]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) =>
      canvas.current
        ? canvas.current.toBlob(resolve, 'image/png')
        : resolve(null)
    );
  const save = (blob: Blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
  };

  const onSave = async () => {
    const blob = await toBlob();
    if (!blob) return;
    save(blob);
    setStatus('Postcard saved to your downloads.');
  };

  // the device's own share sheet, which lists every app the reader has; without one, the card saves instead
  const onShare = async () => {
    setBusy(true);
    const blob = await toBlob();
    setBusy(false);
    if (!blob) return;
    const file = new File([blob], fileName(), { type: 'image/png' });
    if (!navigator.canShare?.({ files: [file] })) {
      save(blob);
      setStatus(
        'This browser can’t open a share sheet, so the postcard saved to your downloads. Attach it in any app.'
      );
      return;
    }
    try {
      await navigator.share({
        files: [file],
        title: 'My reading atlas',
        text: KINDS[options.kind].share(stats.countries),
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus(
          'That app couldn’t take the postcard. Try Save postcard instead.'
        );
    }
  };

  if (!books.length) {
    return (
      <>
        <h1 className={s.title}>Your postcard</h1>
        <div className={s.empty}>
          <h2>Your postcard is blank</h2>
          <p>
            Every country your authors come from, or your stories are set in,
            becomes a stamp here. Log the last book you loved and the postcard
            is ready to send.
          </p>
          <Link
            className={s.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            Log a book
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={s.title}>Your postcard</h1>
      <div ref={logoRef} hidden>
        <Logo />
      </div>

      <div className={s.layout}>
        <div className={s.stage}>
          <div className={s.card}>
            <canvas
              ref={canvas}
              className={s.canvas}
              width={SIZE}
              height={SIZE}
              role="img"
              aria-label={`Your postcard: ${KINDS[options.kind].name.toLowerCase()}. ${stats.countries} of 195 countries, ${stats.books} books, ${stats.continents} continents, with a stamp for each country.`}
            />
          </div>
          <p className={s.foot}>Saved as a 1080 × 1080 picture.</p>
        </div>

        <div>
          <section aria-labelledby="pc-setup-title">
            <h2 className={s.h2} id="pc-setup-title">
              Set up your postcard
            </h2>
            <div className={s.fields}>
              <div>
                <span className={s.label} id="pc-kind-label">
                  Countries
                </span>
                <div
                  className={s.kinds}
                  role="group"
                  aria-labelledby="pc-kind-label"
                >
                  {(Object.keys(KINDS) as Kind[]).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      className={s.kind}
                      data-kind={kind}
                      aria-pressed={options.kind === kind}
                      onClick={() => set({ kind })}
                    >
                      <span className={s.kindStamp} aria-hidden="true" />
                      <b className={s.kindN}>{counts[kind]}</b>
                      <span className={s.kindName}>{KINDS[kind].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={s.label} id="pc-paper-label">
                  Background
                </span>
                <div
                  className={s.papers}
                  role="group"
                  aria-labelledby="pc-paper-label"
                >
                  {(Object.keys(PAPERS) as Options['paper'][]).map((paper) => (
                    <button
                      key={paper}
                      type="button"
                      className={s.paper}
                      aria-pressed={options.paper === paper}
                      onClick={() => set({ paper })}
                    >
                      <span
                        className={s.paperChip}
                        style={{ background: PAPERS[paper].fill }}
                        aria-hidden="true"
                      />
                      {PAPERS[paper].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <details className={s.options}>
              <summary className={s.summary}>
                Style{' '}
                <span className={s.summaryNote}>
                  · {options.count ? `Top ${options.count}` : 'All'} stamps,{' '}
                  {options.frame}, {COLORS[color].name.toLowerCase()}
                </span>
              </summary>
              <div
                className={s.row}
                role="group"
                aria-labelledby="pc-count-label"
              >
                <span className={s.rowLabel} id="pc-count-label">
                  Stamps
                </span>
                <div className={s.pills}>
                  {COUNTS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={s.pill}
                      aria-pressed={options.count === c.value}
                      onClick={() => set({ count: c.value })}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={s.row}
                role="group"
                aria-labelledby="pc-frame-label"
              >
                <span className={s.rowLabel} id="pc-frame-label">
                  Frame
                </span>
                <div className={s.pills}>
                  {FRAMES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      className={s.pill}
                      aria-pressed={options.frame === f.value}
                      onClick={() => set({ frame: f.value })}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={s.row}
                role="group"
                aria-labelledby="pc-color-label"
              >
                <span className={s.rowLabel} id="pc-color-label">
                  Colour
                </span>
                <div className={s.swatches}>
                  {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map(
                    (key) => (
                      <button
                        key={key}
                        type="button"
                        className={s.swatch}
                        style={{ background: COLORS[key].fill }}
                        aria-pressed={color === key}
                        aria-label={COLORS[key].name}
                        title={COLORS[key].name}
                        onClick={() => set({ color: key })}
                      />
                    )
                  )}
                </div>
                <span className={s.colorName} aria-hidden="true">
                  {COLORS[color].name}
                </span>
              </div>
            </details>
          </section>

          <section className={s.send} aria-label="Send your postcard">
            <div className={s.actions}>
              <button type="button" className={s.primary} onClick={onSave}>
                <DownloadSimpleIcon aria-hidden="true" />
                Save postcard
              </button>
              <button
                type="button"
                className={s.quiet}
                onClick={onShare}
                disabled={busy}
              >
                <ShareFatIcon aria-hidden="true" />
                Share postcard
              </button>
            </div>
            <p className={s.status} role="status">
              {status}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PostcardPage;
