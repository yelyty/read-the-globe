import type { ReactNode } from 'react';

import { statusLine } from './StatusLine.css';

type StatusLineProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Shows the line beside the button of a form that tells what just happened.
 * It is a live region, so screen readers read it too.
 */
const StatusLine = ({ children, className }: StatusLineProps) => (
  <p
    className={className ? `${statusLine} ${className}` : statusLine}
    role="status"
  >
    {children}
  </p>
);

export default StatusLine;
