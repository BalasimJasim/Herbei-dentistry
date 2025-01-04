import styles from "./Education.module.css";
import { useTranslation } from "react-i18next";

const AllOnX = () => {
  const { t } = useTranslation();
  const advantages = t("education.allOnX.advantages.list", {
    returnObjects: true,
    defaultValue: [],
  });

  return (
    <div className={styles.educationPage}>
      <div className={styles.container}>
        <h1>{t("education.allOnX.title")}</h1>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{t("education.allOnX.overview.title")}</h2>
            <p>{t("education.allOnX.overview.description")}</p>
          </section>

          <section className={styles.section}>
            <h2>{t("education.allOnX.advantages.title")}</h2>
            <ul className={styles.tipsList}>
              {Array.isArray(advantages) &&
                advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2>{t("education.allOnX.candidates.title")}</h2>
            <p>{t("education.allOnX.candidates.description")}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AllOnX;
