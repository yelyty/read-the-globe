import * as s from "./Footer.css";

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.footerGrid}>
          <div>
            <p className={s.footerTag}>Read the world, one book at a time.</p>
          </div>
          <nav aria-labelledby="footer-product">
            <h2 className={s.footerHead} id="footer-product">
              Product
            </h2>
            <ul className={s.footerList}>
              <li>
                <a className={s.footerLink} href="#how">
                  The atlas
                </a>
              </li>
              <li>
                <a className={s.footerLink} href="#goals">
                  Goals
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className={s.footerTail}>
          <span>© 2026 Read The Globe</span>
          <span>195 countries · one shelf at a time</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
