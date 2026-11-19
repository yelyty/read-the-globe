/**
 * Draws the hero's stack of three books lying flat, for an svg with a 100 × 100 view box.
 *
 * Original artwork © 2026 Líza Tymošenko. All rights reserved; refer to LICENSE.
 */
const HeroBookStack = () => (
  <g strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M85.4 55.9 C86.2 55.9 86.8 55.6 87.3 55.1 C87.9 54.6 88.1 53.9 88.1 53.2 C88.1 51.1 88.1 48.3 88.1 46.2 C88.1 44.7 86.8 43.5 85.4 43.5 C73.5 43.6 26.3 43.8 14.5 43.9 C13.8 43.9 13.1 44.2 12.6 44.7 C12.1 45.2 11.8 45.9 11.8 46.6 C11.8 48.7 11.8 51.5 11.9 53.6 C11.9 55.1 13.1 56.3 14.6 56.3 C26.4 56.2 73.6 56 85.4 55.9 Z"
      fill="var(--rust)"
      stroke="var(--o-rust)"
    />
    <path
      d="M80.5 41.9 C81.2 41.9 81.9 41.6 82.4 41.1 C82.9 40.6 83.2 39.9 83.2 39.2 C83.2 37.3 83.1 34.9 83.1 33 C83.1 31.6 81.9 30.4 80.4 30.4 C69.5 30.5 28.6 30.8 17.6 30.8 C16.9 30.8 16.2 31.1 15.7 31.7 C15.2 32.2 14.9 32.9 14.9 33.6 C14.9 35.4 15 37.9 15 39.7 C15 41.2 16.2 42.4 17.7 42.4 C28.6 42.3 69.5 42 80.5 41.9 Z"
      fill="var(--green)"
      stroke="var(--o-green)"
    />
    <path
      d="M89.3 69.1 C90 69.1 90.7 68.8 91.2 68.3 C91.7 67.8 92 67.1 92 66.4 C92 64.5 91.9 61.9 91.9 60 C91.9 58.5 90.7 57.4 89.2 57.4 C76.6 57.5 23.3 57.8 10.7 57.9 C10 57.9 9.3 58.2 8.8 58.7 C8.3 59.2 8 59.9 8 60.6 C8 62.5 8.1 65.1 8.1 67 C8.1 68.4 9.3 69.6 10.8 69.6 C23.4 69.5 76.7 69.2 89.3 69.1 Z"
      fill="var(--land)"
      stroke="var(--gold)"
    />
    <path
      d="M20.7 32.1 L20.6 40.8 L18.6 40.8 L18.7 32.1 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.4"
    />
    <path
      d="M80.1 31.9 L80.1 40.7 L78.1 40.7 L78.1 31.9 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.4"
    />
    <path
      d="M88.5 59 L88.5 67.8 L86.5 67.8 L86.6 59 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.4"
    />
    <path
      d="M13.2 59.2 L13.2 68 L11.2 68 L11.2 59.2 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.4"
    />
    <path
      d="M17 44.9 L17 55.1 L15 55.1 L15 44.9 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.4"
    />
    <path
      d="M84.3 44.7 L84.2 54.9 L82.3 54.9 L82.3 44.7 Z"
      fill="var(--land)"
      stroke="var(--o-rust)"
      strokeWidth="1.4"
    />
  </g>
);

export default HeroBookStack;
