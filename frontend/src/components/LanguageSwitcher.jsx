import React from "react";
import { useTranslation } from "react-i18next";
import ukFlag from "../assets/images/ukraine.jpg";
import enFlag from "../assets/images/english.jpg";
import "./LanguageSwitcher.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const languages = [
    {
      code: "en",
      name: "English",
      flag: enFlag,
    },
    {
      code: "uk",
      name: "Українська",
      flag: ukFlag,
    },
  ];

  const switchLanguage = (newLang) => {
    // Get the current path without the language prefix
    const currentPath = location.pathname.replace(`/${lang}`, "");

    // Navigate to the same page in the new language
    navigate(`/${newLang}${currentPath}`);

    // Update i18n language
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="language-switcher">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => switchLanguage(language.code)}
          className={`lang-btn ${
            i18n.language === language.code ? "active" : ""
          }`}
          aria-label={`Switch to ${language.name}`}
        >
          <img src={language.flag} alt={language.name} />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
