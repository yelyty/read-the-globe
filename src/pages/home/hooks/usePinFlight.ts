import { createElement, useEffect, useState, type RefObject } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FlagIcon } from '@phosphor-icons/react';

import type { Landing } from '../../../hooks/useLanding';
import { useStatus } from '../../../hooks/useStatus';
import { prefersReducedMotion } from '../../../utils/motion';
import { m } from '../../../paraglide/messages.js';
import {
  drawn,
  flyPin,
  launchPoint,
  plateInView,
  ringAt,
  scrollToCountry,
} from '../utils/pinFlight';

// the line said when the pins land
const SAID_MS = 6000;
// a goal reached is announced after the pins settle
const GOAL_SAY_MS = 900;
// a country smaller than this, both ways, gets the ring
const TINY_COUNTRY = 24;
// a beat after the last pin lands before what comes next
const LAND_PAUSE_MS = 260;

/**
 * Flies the pins of a book just pinned: each pin leaves Log a book and arcs to a country the book adds,
 * and the country takes its mark when the pin lands. The count, the line, and the goal news wait for the last pin.
 * With reduced motion, everything lands at once.
 */
export function usePinFlight(
  plateRef: RefObject<HTMLDivElement | null>,
  /** the book just pinned, until its pins have landed */
  flying: Landing | null,
  /** the pins have landed: the moment is over */
  onDone: () => void
) {
  const [landed, setLanded] = useState<Set<string>>(() => new Set());
  const [said, setSaid] = useState('');
  // counts each landing, so the cartouche can animate its numbers
  const [tick, setTick] = useState(0);
  const { show: say } = useStatus();
  const navigate = useNavigate();

  // the line said when the pins land stays a few seconds
  useEffect(() => {
    if (!said) return;
    const timer = setTimeout(() => setSaid(''), SAID_MS);

    return () => clearTimeout(timer);
  }, [said]);

  useEffect(() => {
    const box = plateRef.current;

    if (!flying || !box) return;
    let live = true;
    const pins: HTMLElement[] = [];

    const land = () => {
      if (!live) return;
      setLanded(new Set(flying.targets));
      onDone();
      setTick((prev) => prev + 1);
      setSaid(flying.line);
      // the bigger news, a beat after the pin: a goal crossed its flag with this book
      const reached = flying.reached;

      if (reached)
        setTimeout(
          () =>
            say({
              text: reached,
              action: {
                label: m.home_see_it(),
                icon: createElement(FlagIcon, { 'aria-hidden': true }),
                run: () => navigate({ to: '/app/goals' }),
              },
            }),
          prefersReducedMotion() ? 0 : GOAL_SAY_MS
        );
    };

    (async () => {
      setLanded(new Set());
      await drawn(box);
      await plateInView(box);
      if (!live) return;

      const paths = flying.targets
        .map((code) =>
          box.querySelector<SVGPathElement>(`[data-code="${code}"]`)
        )
        .filter((path): path is SVGPathElement => !!path);

      if (prefersReducedMotion() || !paths.length) return land();
      await scrollToCountry(paths[0]);

      // a return visit: no flight to a country already marked, just a ring where the book went back to
      if (flying.returning) {
        ringAt(paths[0].getBoundingClientRect());

        return land();
      }

      const from = launchPoint();
      let count = 0;

      paths.forEach((path, index) => {
        const rect = path.getBoundingClientRect();

        const pinLanded = () => {
          if (!live) return;
          const code = path.dataset.code!;

          setLanded((prev) => new Set(prev).add(code));
          if (rect.width < TINY_COUNTRY && rect.height < TINY_COUNTRY)
            ringAt(rect);
          if (++count === paths.length) setTimeout(land, LAND_PAUSE_MS);
        };

        pins.push(flyPin(from, rect, index, pinLanded));
      });
    })();

    return () => {
      live = false;
      pins.forEach((pin) => pin.remove());
    };
  }, [plateRef, flying, onDone, say, navigate]);

  return { landed, said, tick };
}
