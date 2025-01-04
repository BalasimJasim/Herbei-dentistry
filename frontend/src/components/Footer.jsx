import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";
import logo from "../assets/images/logo1.jpeg";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.brandInfo}>
              <img
                src={logo}
                alt="Herbie Dental"
                className={styles.footerLogo}
              />
              <div className={styles.brandText}>
                <h3>Herbie Dental</h3>
                <span className={styles.brandTagline}>Modern Dental Care</span>
              </div>
            </div>
            <p className={styles.description}>{t("footer.description")}</p>
          </div>

          <div className={styles.footerColumn}>
            <h4>{t("footer.quickLinks")}</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/about">{t("nav.about")}</Link>
              </li>
              <li>
                <Link to="/services">{t("nav.services")}</Link>
              </li>
              <li>
                <Link to="/appointments">{t("nav.bookAppointment")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("nav.contact")}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4>{t("footer.services")}</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/services/consultations">Consultations</Link>
              </li>
              <li>
                <Link to="/services/treatments">Dental Treatments</Link>
              </li>
              <li>
                <Link to="/services/implants">Dental Implants</Link>
              </li>
              <li>
                <Link to="/services/cosmetic">Cosmetic Dentistry</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4>{t("footer.contact")}</h4>
            <ul className={styles.contactInfo}>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span>+380 123 456 789</span>
              </li>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <span>contact@herbiedental.com</span>
              </li>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>123 Dental Street, Kiev, Ukraine</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {year} Herbie Dental. {t("footer.rights")}
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z" />
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
