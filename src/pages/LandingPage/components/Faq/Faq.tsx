import { PlusIcon } from '@phosphor-icons/react';
import * as s from './Faq.css';
import { m } from '../../../../paraglide/messages.js';

const QUESTIONS = [
  { q: m.landing_faq_q1, a: m.landing_faq_a1 },
  { q: m.landing_faq_q2, a: m.landing_faq_a2 },
  { q: m.landing_faq_q3, a: m.landing_faq_a3 },
  { q: m.landing_faq_q4, a: m.landing_faq_a4 },
  { q: m.landing_faq_q5, a: m.landing_faq_a5 },
  { q: m.landing_faq_q6, a: m.landing_faq_a6 },
];

// A big heading on the left, the questions as rows on the grey band, each opening in place.
const Faq = () => (
  <section className={s.faq} id="faq" aria-labelledby="faq-h">
    <div className={s.inner}>
      <h2 className={s.title} id="faq-h">
        {m.landing_faq_title()}
      </h2>
      <div className={s.list}>
        {QUESTIONS.map(({ q, a }, i) => (
          <details key={i} className={s.item}>
            <summary className={s.summary}>
              {q()}
              <PlusIcon className={s.plus} aria-hidden="true" />
            </summary>
            <p className={s.answer}>{a()}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
