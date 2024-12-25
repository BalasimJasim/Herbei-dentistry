import React from "react";
import { useTranslation } from "react-i18next";
import "./Education.css";

const DentalImplants = () => {
  const { t } = useTranslation();

  return (
    <div className="education-page">
      <div className="hero-section">
        <h1>{t("education.implants.title")}</h1>
        <p className="subtitle">{t("education.implants.subtitle")}</p>
      </div>

      <div className="content-section">
        {/* What Are Implants Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-tooth"></i>
          </div>
          <h2>{t("education.implants.what.title")}</h2>
          <p>{t("education.implants.what.description")}</p>
          <ul className="tips-list">
            {t("education.implants.what.points", { returnObjects: true }).map(
              (point, index) => (
                <li key={index}>{point}</li>
              )
            )}
          </ul>
        </div>

        {/* Benefits Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>{t("education.implants.benefits.title")}</h2>
          <p>{t("education.implants.benefits.description")}</p>
          <ul className="tips-list">
            {t("education.implants.benefits.points", {
              returnObjects: true,
            }).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Procedure Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-procedures"></i>
          </div>
          <h2>{t("education.implants.procedure.title")}</h2>
          <p>{t("education.implants.procedure.description")}</p>
          <ul className="tips-list">
            {t("education.implants.procedure.steps", {
              returnObjects: true,
            }).map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Candidacy Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-user-check"></i>
          </div>
          <h2>{t("education.implants.candidacy.title")}</h2>
          <p>{t("education.implants.candidacy.description")}</p>
          <ul className="tips-list">
            {t("education.implants.candidacy.points", {
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

export default DentalImplants;
