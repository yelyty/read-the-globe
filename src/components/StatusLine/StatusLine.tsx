import type { ReactNode } from 'react';

import { statusLine } from './StatusLine.css';

type StatusLineProps = {
  children: ReactNode;
  className?: string;
};

// the line beside a form's button that says what just happened; a live region, so screen readers hear it too
const StatusLine = ({ children, className }: StatusLineProps) => (
  <p
    className={className ? `${statusLine} ${className}` : statusLine}
    role="status"
  >
    {children}
  </p>
);

export default StatusLine;
