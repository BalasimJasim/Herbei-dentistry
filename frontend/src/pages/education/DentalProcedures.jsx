import styles from "./Education.module.css";
import { useTranslation } from "react-i18next";

const DentalProcedures = () => {
  const { t } = useTranslation();
  const preventiveList = t("education.procedures.preventive.list", {
    returnObjects: true,
    defaultValue: [],
  });
  const restorativeList = t("education.procedures.restorative.list", {
    returnObjects: true,
    defaultValue: [],
  });

  return (
    <div className={styles.educationPage}>
      <div className={styles.container}>
        <h1>{t("education.procedures.title")}</h1>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{t("education.procedures.preventive.title")}</h2>
            <p>{t("education.procedures.preventive.description")}</p>
            <ul className={styles.tipsList}>
              {Array.isArray(preventiveList) &&
                preventiveList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2>{t("education.procedures.restorative.title")}</h2>
            <p>{t("education.procedures.restorative.description")}</p>
            <ul className={styles.tipsList}>
              {Array.isArray(restorativeList) &&
                restorativeList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DentalProcedures;
