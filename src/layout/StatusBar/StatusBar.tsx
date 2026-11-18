import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { StatusContext, type Status } from '../../hooks/useStatus';
import * as styles from './StatusBar.css';

const SHORT = 4500;
const LONG = 10000; // a line with Undo or See it stays long enough to press it

/**
 * Shows one status line for the whole app, with an optional action, for example Undo.
 * It floats, so the reader sees it anywhere on the page. It stays while the pointer or the keyboard focus is on it.
 */
const StatusBar = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<Status | null>(null);
  const timer = useRef(0);
  const ms = status?.action ? LONG : SHORT;

  const arm = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(null), ms);
  }, [ms]);

  const pause = () => clearTimeout(timer.current);

  useEffect(() => {
    if (!status) return;
    arm();

    return pause;
  }, [status, arm]);

  // a fresh object each time, so the same words said twice still restart the clock
  const show = useCallback((next: Status) => setStatus({ ...next }), []);
  const action = status?.action;

  const handleAction = () => {
    setStatus(null);
    void action?.run();
  };

  return (
    <StatusContext value={show}>
      {children}
      {/* the live region stays in the page so screen readers hear each new line */}
      <div role="status">
        {status && (
          <div
            key={status.text}
            className={styles.bar}
            onPointerEnter={pause}
            onPointerLeave={arm}
            onFocus={pause}
            onBlur={arm}
          >
            <span>{status.text}</span>
            {action && (
              <button
                type="button"
                className={styles.action}
                onClick={handleAction}
              >
                {action.icon}
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </StatusContext>
  );
};

export default StatusBar;
