import React from "react";
import { useTranslation } from "react-i18next";
import EducationNav from "../../components/EducationNav";
import BeforeAfterImage from "../../components/BeforeAfterImage";
import "./Education.css";

const AllOnXSolutions = () => {
  const { t } = useTranslation();

  // Example image paths - replace with actual images
  const beforeAfterSets = [
    {
      before: "/images/education/all-on-x-before-1.jpg",
      after: "/images/education/all-on-x-after-1.jpg",
      alt: "Full arch restoration",
    },
    {
      before: "/images/education/all-on-x-before-2.jpg",
      after: "/images/education/all-on-x-after-2.jpg",
      alt: "Dental implants placement",
    },
  ];

  return (
    <div className="education-page">
      <EducationNav />
      <div className="hero-section">
        <h1>{t("education.allOnX.title")}</h1>
        <p className="subtitle">{t("education.allOnX.subtitle")}</p>
      </div>

      <div className="content-section">
        {/* Overview Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-teeth"></i>
          </div>
          <h2>{t("education.allOnX.overview.title")}</h2>
          <p>{t("education.allOnX.overview.description")}</p>
          <ul className="tips-list">
            {t("education.allOnX.overview.points", { returnObjects: true }).map(
              (point, index) => (
                <li key={index}>{point}</li>
              )
            )}
          </ul>
        </div>

        {/* Types Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-th-list"></i>
          </div>
          <h2>{t("education.allOnX.types.title")}</h2>
          <p>{t("education.allOnX.types.description")}</p>
          <ul className="tips-list">
            {t("education.allOnX.types.solutions", { returnObjects: true }).map(
              (solution, index) => (
                <li key={index}>{solution}</li>
              )
            )}
          </ul>
        </div>

        {/* Benefits Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-star"></i>
          </div>
          <h2>{t("education.allOnX.benefits.title")}</h2>
          <p>{t("education.allOnX.benefits.description")}</p>
          <ul className="tips-list">
            {t("education.allOnX.benefits.points", { returnObjects: true }).map(
              (benefit, index) => (
                <li key={index}>{benefit}</li>
              )
            )}
          </ul>
        </div>

        {/* Treatment Process Section */}
        <div className="info-card">
          <div className="icon-wrapper">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <h2>{t("education.allOnX.process.title")}</h2>
          <p>{t("education.allOnX.process.description")}</p>
          <ul className="tips-list">
            {t("education.allOnX.process.steps", { returnObjects: true }).map(
              (step, index) => (
                <li key={index}>{step}</li>
              )
            )}
          </ul>
        </div>

        {/* Add Before/After Images */}
        <div className="info-card full-width">
          <h2>{t("education.allOnX.results.title")}</h2>
          <p>{t("education.allOnX.results.description")}</p>
          {beforeAfterSets.map((set, index) => (
            <BeforeAfterImage
              key={index}
              beforeSrc={set.before}
              afterSrc={set.after}
              altText={set.alt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllOnXSolutions;
