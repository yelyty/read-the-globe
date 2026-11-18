import { useRef } from 'react';
import { BookmarkSimpleIcon } from '@phosphor-icons/react';

import type { Goal, NextRead } from '../../../../types';
import type { Marks } from '../../../../utils/atlasMarks';
import { m } from '../../../../paraglide/messages.js';
import { useCountries } from '../../../../hooks/useCountries';
import Select from '../../../../components/Select/Select';
import Suggest from '../../../../components/Suggest/Suggest';
import Field from '../../../../components/Field/Field';
import Button from '../../../../components/Button/Button';
import EmptyState from '../../../../components/EmptyState/EmptyState';
import RibbonSticker from '../../../../components/Sticker/RibbonSticker';
import StatusLine from '../../../../components/StatusLine/StatusLine';
import * as styles from '../../ShelfPage.css';
import NextItem from './NextItem';
import { useNextReadActions } from './useNextReadActions';
import { useNextReadForm } from './useNextReadForm';

type NextToReadProps = {
  items: NextRead[];
  setItems: (update: (items: NextRead[]) => NextRead[]) => void;
  failed: boolean;
  names: Record<string, string>;
  marks: Marks;
  goals: Goal[];
};

/**
 * Shows the Next to read tab: the form to add a book, and the list of books to read next.
 */
const NextToRead = ({
  items,
  setItems,
  failed,
  names,
  marks,
  goals,
}: NextToReadProps) => {
  const countries = useCountries();
  const titleRef = useRef<HTMLInputElement>(null);
  const actions = useNextReadActions({ items, setItems, titleRef });

  const {
    title,
    author,
    country,
    mark,
    setMark,
    code,
    countryNames,
    error,
    errorAt,
    said,
    saving,
    submit,
    handleTitleChange,
    handleAuthorChange,
    handleCountryValue,
  } = useNextReadForm({ items, names, titleRef, actions });

  const countryControl = (
    <Suggest
      options={countryNames}
      maxLength={60}
      placeholder={m.next_placeholder_country()}
      autoComplete="off"
      value={country}
      onValue={handleCountryValue}
    />
  );

  return (
    <div>
      <form className={styles.nextForm} onSubmit={submit} noValidate>
        <Field
          ref={titleRef}
          id="n-title"
          compact
          label={m.next_label_title()}
          maxLength={200}
          placeholder={m.next_placeholder_title()}
          value={title}
          error={errorAt('n-title')}
          onChange={handleTitleChange}
        />
        <Field
          id="n-author"
          compact
          label={
            <>
              {m.next_label_author()}{' '}
              <span className={styles.optional}>{m.common_optional()}</span>
            </>
          }
          maxLength={120}
          placeholder={m.next_placeholder_author()}
          value={author}
          onChange={handleAuthorChange}
        />
        <Field
          id="n-country"
          compact
          label={
            <>
              {m.next_label_country()}{' '}
              <span className={styles.optional}>{m.common_optional()}</span>
            </>
          }
          error={errorAt('n-country')}
          control={countryControl}
        />
        {code && (
          <div className={styles.nextWide}>
            <label
              className={styles.fieldLabel}
              htmlFor="n-mark"
              id="n-mark-label"
            >
              {m.next_mark_label()}
            </label>
            <Select<'set' | 'author'>
              id="n-mark"
              labelId="n-mark-label"
              variant="pill"
              value={mark}
              onChange={setMark}
              options={[
                { value: 'author', label: m.next_mark_author() },
                { value: 'set', label: m.next_mark_set() },
              ]}
            />
          </div>
        )}
        {error && !error.at && (
          <p className={`${styles.nextWide} ${styles.error}`} role="alert">
            {error.text}
          </p>
        )}
        <div className={`${styles.nextWide} ${styles.formRow}`}>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            <BookmarkSimpleIcon aria-hidden="true" />
            {saving ? m.log_saving() : m.next_save()}
          </Button>
          <StatusLine>{said}</StatusLine>
        </div>
      </form>

      {failed && <p className={styles.emptyNote}>{m.next_load_failed()}</p>}
      {items.length > 0 ? (
        <ul className={styles.nextList}>
          {items.map((item) => (
            <NextItem
              key={item.id}
              item={item}
              countries={countries}
              names={names}
              marks={marks}
              goals={goals}
              onRemove={actions.remove}
            />
          ))}
        </ul>
      ) : (
        !failed && (
          <EmptyState
            className={styles.nextEmpty}
            art={<RibbonSticker />}
            text={m.next_empty()}
          />
        )
      )}
    </div>
  );
};

export default NextToRead;
