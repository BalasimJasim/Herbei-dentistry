import styles from "./Education.module.css";
import { useTranslation } from "react-i18next";

const OralHygiene = () => {
  const { t } = useTranslation();
  const tips = t("education.oralHygiene.tips.list", {
    returnObjects: true,
    defaultValue: [],
  });

  return (
    <div className={styles.educationPage}>
      <div className={styles.container}>
        <h1>{t("education.oralHygiene.title")}</h1>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{t("education.oralHygiene.dailyRoutine.title")}</h2>
            <p>{t("education.oralHygiene.dailyRoutine.description")}</p>
          </section>

          <section className={styles.section}>
            <h2>{t("education.oralHygiene.tips.title")}</h2>
            <ul className={styles.tipsList}>
              {Array.isArray(tips) &&
                tips.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OralHygiene;
