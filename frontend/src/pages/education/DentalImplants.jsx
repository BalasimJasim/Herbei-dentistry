import styles from "./Education.module.css";
import { useTranslation } from "react-i18next";

const DentalImplants = () => {
  const { t } = useTranslation();
  const benefits = t("education.implants.benefits.list", {
    returnObjects: true,
    defaultValue: [],
  });
  const steps = t("education.implants.process.steps", {
    returnObjects: true,
    defaultValue: [],
  });

  return (
    <div className={styles.educationPage}>
      <div className={styles.container}>
        <h1>{t("education.implants.title")}</h1>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{t("education.implants.overview.title")}</h2>
            <p>{t("education.implants.overview.description")}</p>
          </section>

          <section className={styles.section}>
            <h2>{t("education.implants.benefits.title")}</h2>
            <ul className={`${styles.tipsList} ${styles.benefitsList}`}>
              {Array.isArray(benefits) &&
                benefits.map((benefit, index) => (
                  <li key={index}>
                    <span className={styles.checkmark}>✓</span>
                    {benefit}
                  </li>
                ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2>{t("education.implants.process.title")}</h2>
            <p>{t("education.implants.process.description")}</p>
            <div className={styles.processSteps}>
              {Array.isArray(steps) &&
                steps.map((step, index) => (
                  <div key={index} className={styles.stepItem}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <p>{step}</p>
                  </div>
                ))}
            </div>
          </section>

          <section className={styles.ctaSection}>
            <h3>{t("common.readyToStart")}</h3>
            <p>{t("common.ctaText")}</p>
            <button className={styles.ctaButton}>
              {t("common.bookConsultation")}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DentalImplants;
