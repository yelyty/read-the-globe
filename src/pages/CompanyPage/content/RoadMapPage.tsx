import CompanyPage from "../CompanyPage";
import * as s from "../CompanyPage.css";

const RoadmapPage = () => (
  <CompanyPage
    title="Roadmap"
    description="What works in Read The Globe today, what is being built, and what is only an idea."
  >
    <>
      <h1>Roadmap</h1>
      <p className={s.updated}>Last updated: 29.09.2026</p>
    </>
  </CompanyPage>
);

export default RoadmapPage;
