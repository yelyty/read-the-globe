import { useState, type RefObject } from 'react';
import { DownloadSimpleIcon, ShareFatIcon } from '@phosphor-icons/react';

import { m } from '../../../paraglide/messages.js';
import Button from '../../../components/Button/Button';
import StatusLine from '../../../components/StatusLine/StatusLine';
import * as styles from '../PostcardPage.css';

type CardSendProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileName: string;
  /** what the share sheet sends along with the card */
  share: { title: string; text: string };
};

/**
 * Shows the Save and Share buttons for the card.
 * Save downloads the card as a PNG file. Share opens the share sheet of the device.
 * A status line below the buttons shows the result.
 */
const CardSend = ({ canvasRef, fileName, share }: CardSendProps) => {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) =>
      canvasRef.current
        ? canvasRef.current.toBlob(resolve, 'image/png')
        : resolve(null)
    );

  const save = (blob: Blob) => {
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  };

  const handleSave = async () => {
    setBusy('save');
    const blob = await toBlob();

    setBusy(null);
    if (!blob) return;
    save(blob);
    setStatus(m.postcard_saved());
  };

  // the device's own share sheet, which lists every app the reader has; without one, the card saves instead
  const handleShare = async () => {
    setBusy('share');
    const blob = await toBlob();

    setBusy(null);
    if (!blob) return;
    const file = new File([blob], fileName, { type: 'image/png' });

    if (!navigator.canShare?.({ files: [file] })) {
      save(blob);
      setStatus(m.postcard_no_share_sheet());

      return;
    }

    try {
      await navigator.share({ files: [file], ...share });
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus(m.postcard_share_failed());
    }
  };

  return (
    <section className={styles.send} aria-label={m.postcard_send()}>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={!!busy}
          aria-busy={busy === 'save' || undefined}
        >
          <DownloadSimpleIcon aria-hidden="true" />
          {busy === 'save' ? m.postcard_drawing() : m.postcard_save()}
        </Button>
        <Button
          type="button"
          variant="neutral"
          onClick={handleShare}
          disabled={!!busy}
          aria-busy={busy === 'share' || undefined}
        >
          <ShareFatIcon aria-hidden="true" />
          {busy === 'share' ? m.postcard_drawing() : m.postcard_share()}
        </Button>
      </div>
      <StatusLine className={styles.status}>{status}</StatusLine>
    </section>
  );
};

export default CardSend;
