import { PlusIcon } from '@phosphor-icons/react';

import * as styles from './Faq.css';

type FaqItemProps = { question: string; answer: string };

// a question as a row that opens in place
const FaqItem = ({ question, answer }: FaqItemProps) => (
  <details className={styles.item}>
    <summary className={styles.summary}>
      {question}
      <PlusIcon className={styles.plus} aria-hidden="true" />
    </summary>
    <p className={styles.answer}>{answer}</p>
  </details>
);

export default FaqItem;
