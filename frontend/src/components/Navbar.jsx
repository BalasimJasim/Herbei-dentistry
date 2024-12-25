import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'
import logo from "../assets/images/logo1.jpeg";

import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

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
    // Remove language prefix and get current path
    const currentPath = location.pathname.replace(/^\/[a-z]{2}/, "");

    // Special case for home page
    if (path === "/") {
      return currentPath === "/" || currentPath === "";
    }

    // For other pages, check if the current path starts with the given path
    // and make sure it's an exact match or followed by a slash or nothing
    return (
      currentPath === path ||
      currentPath.startsWith(`${path}/`) ||
      currentPath === path.slice(1)
    ); // handle paths without leading slash
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
          </ul>

          <div className="lang-switcher-container">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar 