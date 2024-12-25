import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/images/logo-white.png" alt="Herbie Dental" />
          </div>
          <p className="footer-description">{t("footer.description")}</p>
          <div className="social-links">{/* Social links */}</div>
        </div>

        <div className="footer-section">
          <h3>{t("footer.quickLinks")}</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/services">{t("footer.services")}</Link>
            </li>
            {/* More links */}
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t("footer.services")}</h3>
          <ul className="footer-links">{/* Service links */}</ul>
        </div>

        <div className="footer-section">
          <h3>{t("footer.contact")}</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone />
              <span>123-456-7890</span>
            </div>
            {/* More contact info */}
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <p>&copy; 2024 Herbie Dental. {t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
