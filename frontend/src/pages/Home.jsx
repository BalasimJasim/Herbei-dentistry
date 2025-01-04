import { FaTooth } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1>{t("home.hero.title")}</h1>
            <p>{t("home.hero.subtitle")}</p>
            <div className={styles.heroButtons}>
              <Link
                to="/appointments"
                className={`${styles.heroButton} ${styles.primary}`}
              >
                {t("nav.bookAppointment")}
              </Link>
              <Link
                to="/services"
                className={`${styles.heroButton} ${styles.secondary}`}
              >
                {t("nav.services")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2>{t("home.features.title")}</h2>
            <p>{t("home.features.subtitle")}</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaTooth />
              </div>
              <h3>{t("home.features.modern.title")}</h3>
              <p>{t("home.features.modern.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.ctaContent}>
            <h2>{t("home.testimonials.cta.title")}</h2>
            <p>{t("home.testimonials.cta.subtitle")}</p>
            <Link to="/appointments" className={styles.ctaButton}>
              {t("home.testimonials.cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
