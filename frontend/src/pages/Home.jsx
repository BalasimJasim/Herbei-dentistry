import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaTooth, FaCalendarAlt, FaUserMd } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>{t("home.hero.title")}</h1>
            <p>{t("home.hero.subtitle")}</p>
            <div className="hero-buttons">
              <Link to="/appointments" className="hero-button primary">
                {t("nav.bookAppointment")}
              </Link>
              <Link to="/services" className="hero-button secondary">
                {t("nav.services")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>{t("home.features.title")}</h2>
            <p>{t("home.features.subtitle")}</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaTooth />
              </div>
              <h3>{t("home.features.modern.title")}</h3>
              <p>{t("home.features.modern.description")}</p>
            </div>
            {/* Add other feature cards similarly */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>{t("home.testimonials.cta.title")}</h2>
            <p>{t("home.testimonials.cta.subtitle")}</p>
            <Link to="/appointments" className="cta-button">
              {t("home.testimonials.cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
