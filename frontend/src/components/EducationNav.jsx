import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./EducationNav.css";

const EducationNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const educationLinks = [
    {
      path: "oral-hygiene",
      icon: "tooth",
      text: t("education.nav.oralHygiene"),
    },
    {
      path: "procedures",
      icon: "teeth",
      text: t("education.nav.procedures"),
    },
    {
      path: "implants",
      icon: "tooth",
      text: t("education.nav.implants"),
    },
    {
      path: "all-on-x",
      icon: "teeth",
      text: t("education.nav.allOnX"),
    },
  ];

  return (
    <nav className="education-nav">
      <div className="education-nav-container">
        {educationLinks.map((link) => (
          <Link
            key={link.path}
            to={`/${t("lang")}/education/${link.path}`}
            className={`education-nav-link ${
              isActive(link.path) ? "active" : ""
            }`}
          >
            <i className={`fas fa-${link.icon}`}></i>
            <span>{link.text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default EducationNav;
