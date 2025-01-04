import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/images/logo1.jpeg";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { lang } = useParams();

  // Use current language if lang param is undefined
  const currentLang = lang || i18n.language;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Improved active state check
  const isActive = (path) => {
    const currentPath = location.pathname.replace(`/${lang}`, "");

    if (path === "/") {
      return currentPath === "/" || currentPath === "";
    }

    return (
      currentPath === path ||
      currentPath.startsWith(`${path}/`) ||
      currentPath === path.slice(1)
    );
  };

  const navLinks = [
    { path: "/", text: t("nav.home") },
    { path: "/about", text: t("nav.about") },
    { path: "/services", text: t("nav.services") },
    { path: "/appointments", text: t("nav.bookAppointment") },
    { path: "/contact", text: t("nav.contact") },
    ...(user?.role === "admin"
      ? [{ path: "/admin/dashboard", text: "Admin Dashboard" }]
      : []),
  ];

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  useEffect(() => {
    // Close dropdown and mobile menu when route changes
    setActiveDropdown(null);
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <img src={logo} alt="Herbie Dental" className="navbar-logo" />
            <div className="brand-text">
              <h1>Herbie Dental</h1>
              <span className="brand-tagline">Modern Dental Care</span>
            </div>
          </Link>
        </div>

        <button
          className={`mobile-menu-button ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={isActive(link.path) ? "active" : ""}
                >
                  {link.text}
                </Link>
              </li>
            ))}
            {user?.role === "admin" && (
              <li>
                <Link to="/admin/dashboard" className="admin-link">
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/patient-portal"
                className={`portal-btn ${
                  isActive("/patient-portal") ? "active" : ""
                }`}
              >
                {t("nav.patientPortal")}
              </Link>
            </li>
            <div
              className={`dropdown ${
                activeDropdown === "education" ? "active" : ""
              }`}
            >
              <button
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("education");
                }}
              >
                {t("nav.education")}
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu">
                <Link
                  to={`/${currentLang}/education/oral-hygiene`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsOpen(false);
                  }}
                >
                  {t("education.nav.oralHygiene")}
                </Link>
                <Link
                  to={`/${currentLang}/education/procedures`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsOpen(false);
                  }}
                >
                  {t("education.nav.procedures")}
                </Link>
                <Link
                  to={`/${currentLang}/education/implants`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsOpen(false);
                  }}
                >
                  {t("education.nav.implants")}
                </Link>
                <Link
                  to={`/${currentLang}/education/all-on-x`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsOpen(false);
                  }}
                >
                  {t("education.nav.allOnX")}
                </Link>
              </div>
            </div>
          </ul>

          <div className="lang-switcher-container">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
