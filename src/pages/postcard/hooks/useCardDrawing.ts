import { useEffect, useState, type RefObject } from 'react';

import type { BookEntry, Goal } from '../../../types';
import type { Marks } from '../../../utils/atlasMarks';
import { loadCountries, type Country } from '../../../utils/countryStamps';
import { goalProgress } from '../../goals/utils/goalProgress';
import type { CardOptions } from '../utils/cardOptions';
import { drawGoalCard } from '../utils/drawGoalCard';
import { drawPostcard } from '../utils/drawPostcard';
import { logoImage } from '../utils/logoImage';
import type { yearSum } from '../utils/yearSum';

type CardDrawing = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** holds the hidden <Logo /> the card draws in its header */
  logoRef: RefObject<HTMLDivElement | null>;
  books: BookEntry[];
  marks: Marks;
  names: Record<string, string>;
  options: CardOptions;
  title: string;
  firstName: string;
  goal: Goal | null;
  yearSummary: ReturnType<typeof yearSum> | null;
};

// draws the card on the canvas once the world's shapes have loaded, and again at every change
export function useCardDrawing({
  canvasRef,
  logoRef,
  books,
  marks,
  names,
  options,
  title,
  firstName,
  goal,
  yearSummary,
}: CardDrawing) {
  const [countries, setCountries] = useState<Map<string, Country>>();

  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = logoRef.current?.querySelector('svg');

    if (!canvas || !countries) return;
    let stale = false;

    (svg ? logoImage(svg) : Promise.resolve(null)).then((logo) => {
      if (stale) return;
      if (goal)
        drawGoalCard({
          canvas,
          goal,
          progress: goalProgress(goal, marks, books),
          books,
          marks,
          names,
          countries,
          paper: options.paper,
          first: firstName,
          logo,
        });
      else
        drawPostcard({
          canvas,
          books,
          marks,
          names,
          countries,
          options,
          title,
          logo,
          year: yearSummary,
        });
    });

    return () => {
      stale = true;
    };
  }, [
    canvasRef,
    logoRef,
    books,
    marks,
    names,
    options,
    title,
    countries,
    goal,
    yearSummary,
    firstName,
  ]);
}
