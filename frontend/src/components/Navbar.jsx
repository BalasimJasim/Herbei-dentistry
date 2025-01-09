import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const { user, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { lang } = useParams();
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      {isOpen && (
        <div
          className={`${styles.navbarOverlay} ${isOpen ? styles.active : ""}`}
        />
      )}
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarBrand}>
          <img src={logo} alt="Herbie Dental" className={styles.navbarLogo} />
        </Link>

        <div ref={menuRef} className={styles.menuContainer}>
          <button
            className={`${styles.mobileMenuButton} ${
              isOpen ? styles.active : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburger}></span>
          </button>

          <ul className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={isActive(link.path) ? styles.active : ""}
                >
                  {link.text}
                </Link>
              </li>
            ))}
            {user?.role === "admin" && (
              <li>
                <Link to="/admin/dashboard" className={styles.adminLink}>
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              {user ? (
                <div className={styles.userMenu}>
                  <button className={styles.userButton}>
                    <span>{user.firstName}</span>
                  </button>
                  <div className={styles.userDropdown}>
                    <Link to={`/${currentLang}/portal-dashboard`}>
                      {t("My Dashboard")}
                    </Link>
                    <button onClick={logout}>{t("Logout")}</button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/patient-portal"
                  className={`${styles.portalBtn} ${
                    isActive("/patient-portal") ? styles.active : ""
                  }`}
                >
                  {t("nav.patientPortal")}
                </Link>
              )}
            </li>
            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => toggleDropdown("education")}
              >
                {t("nav.patientEducation")}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <div
                className={`${styles.dropdownContent} ${
                  activeDropdown === "education" ? styles.active : ""
                }`}
              >
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
        </div>

        <div
          className={`${styles.langSwitcherContainer} ${
            isOpen ? styles.active : ""
          }`}
        >
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
