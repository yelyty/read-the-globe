/**
 * Draws the hero's three books standing upright, for an svg with a 100 × 100 view box.
 *
 * Original artwork © 2026 Líza Tymošenko. All rights reserved; refer to LICENSE.
 */
const HeroBookRow = () => (
  <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M78.1 18 C78.1 17.4 77.8 16.8 77.4 16.3 C76.9 15.9 76.3 15.6 75.7 15.6 L62 15.6 C61.4 15.6 60.8 15.9 60.3 16.3 C59.9 16.8 59.6 17.4 59.6 18 L59.8 89.5 C59.8 90.2 60.1 90.8 60.5 91.2 C61 91.7 61.6 91.9 62.2 91.9 L75.8 91.9 C76.5 91.9 77.1 91.6 77.5 91.2 C78 90.7 78.2 90.1 78.2 89.5 L78.1 18 Z"
      fill="var(--rust)"
      stroke="var(--o-rust)"
    />
    <path
      d="M38.8 24.3 C38.8 23.6 38.6 23 38.1 22.6 C37.7 22.1 37.1 21.9 36.4 21.9 C33.2 21.9 27.4 21.9 24.2 21.9 C23.5 21.9 22.9 22.2 22.5 22.6 C22 23.1 21.8 23.7 21.8 24.3 C21.8 35.1 21.9 78.9 21.9 89.6 C21.9 90.2 22.2 90.9 22.6 91.3 C23.1 91.7 23.7 92 24.3 92 C27.5 92 33.3 92 36.5 92 C37.2 92 37.8 91.7 38.2 91.3 C38.7 90.8 38.9 90.2 38.9 89.6 C38.9 78.8 38.8 35 38.8 24.3 Z"
      fill="var(--green)"
      stroke="var(--o-green)"
    />
    <path
      d="M58 10.4 C58 9.1 56.9 8 55.6 8 C52.3 8 46.3 8 43 8 C41.6 8 40.6 9.1 40.6 10.4 C40.6 22.6 40.7 77.4 40.7 89.6 C40.7 90.9 41.8 92 43.1 92 C46.4 92 52.4 91.9 55.8 91.9 C57.1 91.9 58.2 90.9 58.2 89.5 C58.1 77.4 58 22.6 58 10.4 Z"
      fill="var(--land)"
      stroke="var(--gold)"
    />
    <path
      d="M23.9 86.3 L36.9 86.3 L36.9 88.3 L23.9 88.3 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.6"
    />
    <path
      d="M23.8 25.7 L36.8 25.7 L36.8 27.7 L23.8 27.7 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.6"
    />
    <path
      d="M42.6 10.5 L55.6 10.4 L55.6 12.4 L42.6 12.5 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.6"
    />
    <path
      d="M42.7 86.3 L55.7 86.3 L55.7 88.3 L42.7 88.3 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.6"
    />
    <path
      d="M61.4 86.2 L76.5 86.2 L76.5 88.2 L61.4 88.2 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.6"
    />
    <path
      d="M61.3 18.8 L76.4 18.8 L76.4 20.8 L61.3 20.8 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.6"
    />
  </g>
);

export default HeroBookRow;
