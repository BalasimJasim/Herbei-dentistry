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
                {t("home.hero.bookAppointment")}
              </Link>
              <Link to="/services" className="hero-button secondary">
                {t("home.hero.ourServices")}
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              src="/images/hero-dental.jpg"
              alt="Modern dental care"
              className="hero-image"
            />
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
            {/* Add more feature cards */}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="section-container">
          <div className="section-header">
            <h2>{t("home.services.title")}</h2>
            <p>{t("home.services.subtitle")}</p>
          </div>
          <div className="services-grid">{/* Service Cards */}</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2>{t("home.testimonials.title")}</h2>
            <p>{t("home.testimonials.subtitle")}</p>
          </div>
          <div className="testimonials-grid">{/* Testimonial Cards */}</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>{t("home.cta.title")}</h2>
            <p>{t("home.cta.subtitle")}</p>
            <Link to="/appointments" className="cta-button">
              {t("home.cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
