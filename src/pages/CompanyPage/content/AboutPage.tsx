import * as s from "../CompanyPage.css";
import CompanyPage from "../CompanyPage";

const AboutPage = () => (
  <CompanyPage
    title="About"
    description="Read The Globe turns the books you read into a map of the world."
  >
    <>
      <h1>About Read The Globe</h1>
      <p className={s.lede}>
        Read The Globe turns the books you read into a map. Log a book, say
        where its story is set and where its author is from, and your atlas
        fills in, country by country.
      </p>
    </>
  </CompanyPage>
);

export default AboutPage;
