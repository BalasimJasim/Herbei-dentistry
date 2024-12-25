import React from "react";
import { useTranslation } from "react-i18next";
import "./Education.css";

const DentalProcedures = () => {
  const { t } = useTranslation();

  return (
    <div className="education-page">
      <div className="hero-section">
        <h1>{t("education.procedures.title")}</h1>
        <p className="subtitle">{t("education.procedures.subtitle")}</p>
      </div>

      <div className="content-section">
        {/* Cleaning Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-tooth"></i>
          </div>
          <h2>{t("education.procedures.cleaning.title")}</h2>
          <p>{t("education.procedures.cleaning.description")}</p>
          <ul className="tips-list">
            {t("education.procedures.cleaning.points", {
              returnObjects: true,
            }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Fillings Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-fill-drip"></i>
          </div>
          <h2>{t("education.procedures.fillings.title")}</h2>
          <p>{t("education.procedures.fillings.description")}</p>
          <ul className="tips-list">
            {t("education.procedures.fillings.points", {
              returnObjects: true,
            }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Root Canal Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-teeth"></i>
          </div>
          <h2>{t("education.procedures.rootCanal.title")}</h2>
          <p>{t("education.procedures.rootCanal.description")}</p>
          <ul className="tips-list">
            {t("education.procedures.rootCanal.points", {
              returnObjects: true,
            }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Crowns Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-crown"></i>
          </div>
          <h2>{t("education.procedures.crowns.title")}</h2>
          <p>{t("education.procedures.crowns.description")}</p>
          <ul className="tips-list">
            {t("education.procedures.crowns.points", {
              returnObjects: true,
            }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DentalProcedures;
