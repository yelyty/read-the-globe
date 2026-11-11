import { PlusIcon } from '@phosphor-icons/react';
import * as s from './Faq.css';

const QUESTIONS = [
  {
    q: 'Is it free?',
    a: 'Yes. Read The Globe is free, and you never need a card.',
  },
  {
    q: 'What if a book is set in several places, or nowhere real?',
    a: 'List every country the story visits. Middle-earth, Earthsea, Narnia and other imagined worlds get a place too, beyond the map.',
  },
  {
    q: 'Do I have to type every book by hand?',
    a: 'No. Import a reading list as a CSV file, with a column each for the title, the author, the author’s country, the places and, if you like, the date; there’s an example file to start from. Your reading list downloads as a CSV too, and a full backup (JSON) keeps your goals as well and restores everything later.',
  },
  {
    q: 'How does a book get its author’s country?',
    a: 'You choose it from the list of 195 countries when you log the book. Familiar names work, so “England” finds the United Kingdom, and for a country that has since split, like Czechoslovakia, you pick which one it is today.',
  },
  {
    q: 'Can I share my atlas?',
    a: 'Yes. Send it as a postcard: your atlas as a sheet of stamps or a year in books every December, saved as a picture for any app.',
  },
  {
    q: 'Which languages can I use?',
    a: 'English, Czech and Ukrainian.',
  },
];

// A big heading on the left, the questions as rows on the grey band, each opening in place.
const Faq = () => (
  <section className={s.faq} id="faq" aria-labelledby="faq-h">
    <div className={s.inner}>
      <h2 className={s.title} id="faq-h">
        Frequently asked questions
      </h2>
      <div className={s.list}>
        {QUESTIONS.map(({ q, a }) => (
          <details key={q} className={s.item}>
            <summary className={s.summary}>
              {q}
              <PlusIcon className={s.plus} aria-hidden="true" />
            </summary>
            <p className={s.answer}>{a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
