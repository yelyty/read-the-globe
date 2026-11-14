import { reducedMotion } from '../styles/global.css';

/** the reader asked the system for less motion */
export const prefersReducedMotion = () => matchMedia(reducedMotion).matches;
