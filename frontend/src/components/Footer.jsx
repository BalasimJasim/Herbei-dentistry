import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";
import { useTranslation } from "react-i18next";

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
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/services">Our Services</Link>
            </li>
            <li>
              <Link to="/appointments">Book Appointment</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Our Services</h3>
          <ul className="footer-links">
            <li>
              <Link to="/services#general">General Dentistry</Link>
            </li>
            <li>
              <Link to="/services#cosmetic">Cosmetic Dentistry</Link>
            </li>
            <li>
              <Link to="/services#surgical">Dental Surgery</Link>
            </li>
            <li>
              <Link to="/services#orthodontics">Orthodontics</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone />
              <span>+380 123 456 789</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>info@herbiedental.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Dental Street, City, Country</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <p>
          &copy; {new Date().getFullYear()} Herbie Dental. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
