// a translated sentence with one word in bold: the message is filled with a marker where the word goes
export const BOLD = '\u0000';

/**
 * Shows a translated sentence with one word in bold.
 * @param text - The sentence, with BOLD where the word goes.
 * @param bold - The word to show in bold.
 */
const Bold = ({ text, bold }: { text: string; bold: string }) => {
  const [before, after = ''] = text.split(BOLD);

  return (
    <>
      {before}
      <b>{bold}</b>
      {after}
    </>
  );
};

export default Bold;
