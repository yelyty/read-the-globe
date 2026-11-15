import { m } from '../../../../paraglide/messages.js';
import * as styles from './Faq.css';
import FaqItem from './FaqItem';

const QUESTIONS = [
  { q: m.landing_faq_q1, a: m.landing_faq_a1 },
  { q: m.landing_faq_q2, a: m.landing_faq_a2 },
  { q: m.landing_faq_q3, a: m.landing_faq_a3 },
  { q: m.landing_faq_q4, a: m.landing_faq_a4 },
  { q: m.landing_faq_q5, a: m.landing_faq_a5 },
  { q: m.landing_faq_q6, a: m.landing_faq_a6 },
];

// A big heading on the left, the questions as rows on the grey band, each opening in place.
const Faq = () => {
  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-h">
      <div className={styles.inner}>
        <h2 className={styles.title} id="faq-h">
          {m.landing_faq_title()}
        </h2>
        <div className={styles.list}>
          {QUESTIONS.map(({ q, a }, i) => (
            <FaqItem key={i} question={q()} answer={a()} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
