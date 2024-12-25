import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EducationNav from "../../components/EducationNav";
import "./Education.css";

const OralHygiene = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const currentLang = lang || i18n.language;

  useEffect(() => {
    // Check if we're on the correct language path
    if (lang !== currentLang) {
      navigate(`/${currentLang}/education/oral-hygiene`, { replace: true });
      return;
    }

    // Check for translations
    if (!t("education.oralHygiene.title", { returnNull: true })) {
      console.warn("Missing translation for oral hygiene page");
      navigate(`/${currentLang}`);
      return;
    }

    window.scrollTo(0, 0);
  }, [currentLang, lang, navigate, t]);

  return (
    <div className="education-page">
      <EducationNav />
      <div className="hero-section">
        <h1>{t("education.oralHygiene.title")}</h1>
        <p className="subtitle">{t("education.oralHygiene.subtitle")}</p>
      </div>

      <div className="content-section">
        {/* Brushing Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-toothbrush"></i>
          </div>
          <h2>{t("education.oralHygiene.brushing.title")}</h2>
          <p>{t("education.oralHygiene.brushing.description")}</p>
          <ul className="tips-list">
            {t("education.oralHygiene.brushing.tips", {
              returnObjects: true,
            }).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Flossing Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-tooth"></i>
          </div>
          <h2>{t("education.oralHygiene.flossing.title")}</h2>
          <p>{t("education.oralHygiene.flossing.description")}</p>
          <ul className="tips-list">
            {t("education.oralHygiene.flossing.tips", {
              returnObjects: true,
            }).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Regular Check-ups Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-calendar-check"></i>
          </div>
          <h2>{t("education.oralHygiene.checkups.title")}</h2>
          <p>{t("education.oralHygiene.checkups.description")}</p>
          <div className="cta-section">
            <button className="primary-button">
              {t("education.oralHygiene.checkups.ctaButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OralHygiene;
