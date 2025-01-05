import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import styles from "./About.module.css";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.aboutPage}>
      <Helmet>
        <title>{t("about.pageTitle")} - Herbie Dental</title>
        <meta name="description" content={t("about.pageDescription")} />
      </Helmet>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>{t("about.title")}</h1>
          <p className={styles.subtitle}>{t("about.subtitle")}</p>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={styles.container}>
          <div className={styles.founderGrid}>
            <div className={styles.founderImage}>
              <img src="/images/founder.jpg" alt="Dr. Yurii Herbei" />
            </div>
            <div className={styles.founderContent}>
              <span className={styles.subtitle}>
                {t("about.founder.subtitle")}
              </span>
              <h2>{t("about.founder.name")}</h2>
              <h3>{t("about.founder.role")}</h3>
              <p>{t("about.founder.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
