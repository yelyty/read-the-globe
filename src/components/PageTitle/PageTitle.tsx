import * as styles from './PageTitle.css';

type PageTitleProps = {
  children: string;
};

/**
 * Shows the title of a page as its main heading.
 */
const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{children}</h1>
    </header>
  );
};

export default PageTitle;
