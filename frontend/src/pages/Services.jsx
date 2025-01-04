import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styles from "./Services.module.css";

const Services = () => {
  const { t } = useTranslation();

  const serviceCategories = ["general", "cosmetic", "surgical", "orthodontic"];

  // Helper function to safely get services array
  const getServicesArray = (category) => {
    try {
      return t(`services.categories.${category}.services`, {
        returnObjects: true,
      });
    } catch (error) {
      console.error(`Error getting services for ${category}:`, error);
      return [];
    }
  };

  return (
    <div className={styles.servicesPage}>
      <Helmet>
        <title>{t("services.title")} - Herbie Dental</title>
        <meta name="description" content={t("services.subtitle")} />
      </Helmet>

      <section className={styles.servicesHero}>
        <div className={styles.heroContent}>
          <h1>{t("services.title")}</h1>
          <p className={styles.lead}>{t("services.subtitle")}</p>
        </div>
      </section>

      <section className={styles.servicesGrid}>
        {serviceCategories.map((category) => {
          const services = getServicesArray(category);

          return (
            <div
              key={category}
              className={styles.serviceCategory}
              id={category}
            >
              <h2>{t(`services.categories.${category}.title`)}</h2>
              <p>{t(`services.categories.${category}.description`)}</p>
              <ul className={styles.servicesList}>
                {Array.isArray(services) &&
                  services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className={styles.servicesCta}>
        <div className={styles.ctaContent}>
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.description")}</p>
          <Link to="/appointments" className={styles.ctaButton}>
            {t("services.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
