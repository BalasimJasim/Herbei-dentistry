import React from "react";
import { useTranslation } from "react-i18next";
import ukFlag from "../assets/images/ukraine.jpg";
import enFlag from "../assets/images/english.jpg";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

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

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("preferredLanguage", languageCode);
  };

  return (
    <div className="language-switcher">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
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
