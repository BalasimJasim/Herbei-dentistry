import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Services.css";

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
    <div className="services-page">
      <Helmet>
        <title>{t("services.title")} - Herbie Dental</title>
        <meta name="description" content={t("services.subtitle")} />
      </Helmet>

      <section className="services-hero">
        <div className="hero-content">
          <h1>{t("services.title")}</h1>
          <p className="lead">{t("services.subtitle")}</p>
        </div>
      </section>

      <section className="services-grid">
        {serviceCategories.map((category) => {
          const services = getServicesArray(category);

          return (
            <div key={category} className="service-category" id={category}>
              <h2>{t(`services.categories.${category}.title`)}</h2>
              <p>{t(`services.categories.${category}.description`)}</p>
              <ul className="services-list">
                {Array.isArray(services) &&
                  services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="services-cta">
        <div className="cta-content">
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.description")}</p>
          <Link to="/appointments" className="cta-button">
            {t("services.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
