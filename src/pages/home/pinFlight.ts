import { prefersReducedMotion } from '../../utils/motion';
import * as styles from './HomePage.css';

// the gold ring round a country too small to see fill
const RING_MS = 750;

// the plate counts as in view with its top this share down the screen at most (and the header's height,
// give or take a few pixels, at least); a scroll to it leaves a gap under the header
const VIEW_TOP_SHARE = 0.35;
const HEADER_SLACK = 4;
const SCROLL_GAP = 24;

// a smooth scroll that never says it ended is taken as done after this long
const SCROLL_SETTLE_MS = 650;

// frames to wait for the map's shapes: about two seconds
const MAX_DRAW_FRAMES = 120;

// a country too small to see fill gets a gold ring where the pin landed
export const ringAt = (rect: DOMRect) => {
  const ring = document.createElement('div');

  ring.className = styles.landRing;
  ring.setAttribute('aria-hidden', 'true');
  ring.style.left = `${rect.left + rect.width / 2}px`;
  ring.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(ring);

  ring.animate(
    [
      { transform: 'translate(-50%, -50%) scale(.4)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(1.7)', opacity: 0 },
    ],
    { duration: RING_MS, easing: 'cubic-bezier(.2,.8,.25,1)' }
  ).onfinish = () => ring.remove();
};

// Home, with the plate in view: scroll only if it isn't already, and let the scroll settle before anything flies
export const plateInView = (plate: Element) =>
  new Promise<void>((done) => {
    const top = plate.getBoundingClientRect().top;
    const head = document.querySelector('header')?.offsetHeight ?? 0;

    if (top >= head - HEADER_SLACK && top < innerHeight * VIEW_TOP_SHARE)
      return requestAnimationFrame(() => done());
    const to = Math.max(0, top + scrollY - head - SCROLL_GAP);

    if (prefersReducedMotion()) {
      scrollTo({ top: to, behavior: 'instant' });

      return requestAnimationFrame(() => done());
    }

    addEventListener('scrollend', () => done(), { once: true });
    setTimeout(done, SCROLL_SETTLE_MS);
    scrollTo({ top: to, behavior: 'smooth' });
  });

// the map's countries are drawn once its shapes arrive: wait for them (two seconds at most)
export const drawn = (plate: Element) =>
  new Promise<void>((done) => {
    let tries = 0;

    const look = () =>
      plate.querySelector('[data-code]') || ++tries > MAX_DRAW_FRAMES
        ? done()
        : requestAnimationFrame(look);

    look();
  });
