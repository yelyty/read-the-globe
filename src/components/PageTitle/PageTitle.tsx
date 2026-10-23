import * as s from './PageTitle.css';

type PageTitleProps = {
  children: string;
};
const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <header className={s.header}>
      <h1 className={s.title}>{children}</h1>
    </header>
  );
};

export default PageTitle;
