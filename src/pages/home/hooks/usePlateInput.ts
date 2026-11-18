import { useRef, type MouseEvent, type PointerEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import type { Marks } from '../../../utils/atlasMarks';
import { ANTARCTICA } from '../../../components/AtlasMap/AtlasMap';
import type { Tip } from '../components/MapTip';

type PlateInput = {
  marks: Marks;
  full: boolean;
  setFull: (full: boolean) => void;
  tip: Tip | null;
  setTip: (tip: Tip | null) => void;
  tipAt: (code: string, el: Element, by: Tip['by']) => void;
};

// the countries a tip and a click are for: every marked one, and every unmarked one but Antarctica.
// ponytail: the mock offers only the 195; here Taiwan or Kosovo invite a book too, as the form already lists them
const codeAt = (target: EventTarget) => {
  const el = (target as Element).closest<SVGElement>('[data-code]');
  const code = el?.dataset.code;

  return el && code && code !== ANTARCTICA ? { el, code } : null;
};

/** The map plate's mouse and touch shortcuts: tips under the pointer, a marked country's click to its shelf,
    an unmarked one's to Log a book, anywhere else to the full screen map. */
export const usePlateInput = ({
  marks,
  full,
  setFull,
  tip,
  setTip,
  tipAt,
}: PlateInput) => {
  const pointer = useRef<'mouse' | 'touch'>('mouse');
  const navigate = useNavigate();

  // a pen counts as touch: no hover tips, and a tap shows the card first
  const handlePlatePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointer.current =
      event.pointerType === 'touch' || event.pointerType === 'pen'
        ? 'touch'
        : 'mouse';
  };

  const handlePlateMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (pointer.current === 'touch') return;
    const at = codeAt(event.target);

    setTip(
      at
        ? {
            code: at.code,
            x: event.clientX,
            y: event.clientY,
            bottom: event.clientY,
            by: 'mouse',
          }
        : null
    );
  };

  const handlePlateMouseLeave = () => {
    if (pointer.current !== 'touch') setTip(null);
  };

  const handlePlateClick = (event: MouseEvent<HTMLDivElement>) => {
    const at = codeAt(event.target);

    if (!at) {
      setTip(null);
      // anywhere but a country opens the full screen map
      if (
        !full &&
        (event.target as Element).closest('.rsm-svg') &&
        !(event.target as Element).closest('[data-code]')
      )
        setFull(true);

      return;
    }

    // on touch, a tap shows the country's card first; a second tap on the same country acts
    if (pointer.current === 'touch' && tip?.code !== at.code)
      return tipAt(at.code, at.el, 'touch');
    setTip(null);
    if (marks[at.code])
      return navigate({
        to: '/app/shelf',
        search: { country: at.code },
      });
    // an unmarked country opens Log a book with it as a place
    setFull(false);

    navigate({
      to: '.',
      search: (prev) => ({ ...prev, log: true, country: at.code }),
    });
  };

  // the button sits on the plate: its click mustn't reach the plate's own
  const handleFullToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFull(!full);
  };

  return {
    handlePlatePointerDown,
    handlePlateMouseMove,
    handlePlateMouseLeave,
    handlePlateClick,
    handleFullToggle,
  };
};
