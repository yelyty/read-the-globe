import { prefersReducedMotion } from '../../../utils/motion';
import * as styles from '../HomePage.css';

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

/**
 * Shows a gold ring where a pin landed, for a country too small to see it fill.
 */
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

/**
 * Scrolls Home to the map, if it is not already in view, and waits for the scroll to end.
 * @returns A promise that resolves when the map is in view.
 */
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

/**
 * Waits until the countries of the map are drawn, for up to about 2 seconds.
 */
export const drawn = (plate: Element) =>
  new Promise<void>((done) => {
    let tries = 0;

    const look = () =>
      plate.querySelector('[data-code]') || ++tries > MAX_DRAW_FRAMES
        ? done()
        : requestAnimationFrame(look);

    look();
  });

// a flying pin arcs up by a share of its sideways distance, within these bounds
const MIN_LIFT = 60;
const MAX_LIFT = 160;
const LIFT_SHARE = 0.25;
// pins leave one after another and fly for this long
const FLIGHT_MS = 820;
const FIRST_PIN_DELAY_MS = 120;
const PIN_STAGGER_MS = 110;

const PIN =
  '<svg viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.8"/></svg>';

/**
 * On a phone, scrolls the sideways map so a country is in view, before a pin lands on it.
 */
export const scrollToCountry = async (path: SVGPathElement) => {
  const scroller = path.ownerSVGElement?.parentElement;

  if (!scroller || scroller.scrollWidth <= scroller.clientWidth + 1) return;
  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = path.getBoundingClientRect();

  scroller.scrollLeft +=
    targetRect.left +
    targetRect.width / 2 -
    (scrollerRect.left + scrollerRect.width / 2);

  await new Promise(requestAnimationFrame);
};

/**
 * Gets the point the pins fly from: the visible Log a book button, or else the header.
 */
export const launchPoint = () => {
  const launch =
    [...document.querySelectorAll('[data-log-toggle]')].find(
      (toggle) =>
        toggle.getClientRects().length &&
        getComputedStyle(toggle).visibility !== 'hidden'
    ) ?? document.querySelector('header');

  const from = launch!.getBoundingClientRect();

  return { x: from.left + from.width / 2, y: from.top + from.height / 2 };
};

/**
 * Flies a pin in an arc from the launch point to a country. The pin removes itself when it lands.
 * @param index - The place of the pin in the flight. Each pin leaves a little after the one before.
 * @param onLanded - Called when the pin lands.
 * @returns The pin element.
 */
export const flyPin = (
  from: { x: number; y: number },
  to: DOMRect,
  index: number,
  onLanded: () => void
) => {
  const dx = to.left + to.width / 2 - from.x;
  const dy = to.top + to.height / 2 - from.y;
  const lift = Math.min(MAX_LIFT, Math.abs(dx) * LIFT_SHARE + MIN_LIFT);
  const pin = document.createElement('div');

  pin.className = styles.flyPin;
  pin.setAttribute('aria-hidden', 'true');
  pin.innerHTML = PIN;
  pin.style.left = `${from.x}px`;
  pin.style.top = `${from.y}px`;
  document.body.appendChild(pin);

  pin.animate(
    [
      { transform: 'translate(-50%, -100%) scale(1.2)', opacity: 0 },
      {
        transform: 'translate(-50%, -100%) scale(1)',
        opacity: 1,
        offset: 0.12,
      },
      {
        transform: `translate(calc(-50% + ${dx / 2}px), calc(-100% + ${dy / 2 - lift}px)) scale(1)`,
        offset: 0.55,
      },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-100% + ${dy}px)) scale(1)`,
        opacity: 1,
        offset: 0.9,
      },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-100% + ${dy}px)) scale(.6)`,
        opacity: 0,
      },
    ],
    {
      duration: FLIGHT_MS,
      delay: FIRST_PIN_DELAY_MS + index * PIN_STAGGER_MS,
      easing: 'cubic-bezier(.45,.05,.3,1)',
      fill: 'forwards',
    }
  ).onfinish = () => {
    pin.remove();
    onLanded();
  };

  return pin;
};
