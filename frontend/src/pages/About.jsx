import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import founderImage from "../assets/images/image0.jpeg";
import doctorImage from "../assets/images/doc.jpeg";
import "./About.css";

const About = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      id: 1,
      name: t("about.founder.name"),
      role: t("about.founder.title"),
      image: founderImage,
      description: t("about.founder.description"),
      specializations: [
        "Дентальна імплантація",
        "Кістково-пластичні операції",
        "Протезування на імплантах",
      ],
      expertise: Object.values(
        t("about.founder.expertise", { returnObjects: true })
      ),
    },
    {
      id: 2,
      name: "Марія Ковальчук",
      role: "Терапевт-стоматолог",
      image: doctorImage,
      description:
        "Спеціаліст з лікування карієсу та його ускладнень. 3 роки досвіду в естетичній реставрації.",
      specializations: [
        "Лікування карієсу",
        "Естетична реставрація",
        "Ендодонтія",
      ],
    },
    {
      id: 3,
      name: "Олена Петренко",
      role: "Стоматолог-гігієніст",
      image: doctorImage,
      description:
        "Експерт з професійної гігієни порожнини рота та профілактики захворювань ясен.",
      specializations: ["Професійна гігієна", "Відбілювання", "Профілактика"],
    },
    {
      id: 4,
      name: "Андрій Мельник",
      role: "Ортодонт",
      image: doctorImage,
      description:
        "Спеціаліст з виправлення прикусу та вирівнювання зубів. Експерт з брекет-систем та елайнерів.",
      specializations: ["��рекет-системи", "Елайнери", "Виправлення прикусу"],
    },
  ];

  return (
    <div className="about-page">
      <Helmet>
        <title>{t("about.title")}</title>
        <meta name="description" content={t("about.subtitle")} />
      </Helmet>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1>{t("about.title")}</h1>
          <p className="lead">{t("about.subtitle")}</p>
        </div>
      </div>

      {/* Updated Founder Section */}
      <div className="founder-section">
        <div className="container">
          <div className="founder-content">
            <div className="founder-image">
              <img src={founderImage} alt={t("about.founder.name")} />
            </div>
            <div className="founder-info">
              <span className="founder-label">
                {t("about.founder.subtitle")}
              </span>
              <h2>{t("about.founder.name")}</h2>
              <h3>{t("about.founder.title")}</h3>
              <p className="founder-description">
                {t("about.founder.description")}
              </p>
              {/* Expertise Section */}
              {teamMembers[0].expertise && (
                <div className="expertise-section">
                  <h4>Професійна експертиза:</h4>
                  <ul className="expertise-list">
                    {teamMembers[0].expertise.map((item, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="specializations-section">
                <h4>Спеціалізації:</h4>
                <div className="specializations">
                  {teamMembers[0].specializations.map((spec, index) => (
                    <span key={index} className="specialization-tag">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container">
          <h2>{t("about.values.title")}</h2>
          <div className="values-grid">
            {["quality", "innovation", "care"].map((value) => (
              <div key={value} className="value-card">
                <h3>{t(`about.values.${value}.title`)}</h3>
                <p>{t(`about.values.${value}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="container">
          <h2>Наша Команда</h2>
          <p className="team-intro">
            Наша команда складається з висококваліфікованих спеціалістів, які
            постійно вдосконалюють свої навички для надання найкращої
            стоматологічної допомоги.
          </p>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.description}</p>
                  <div className="specializations">
                    {member.specializations.map((spec, index) => (
                      <span key={index} className="specialization-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to schedule your visit?</h2>
          <p>Experience professional dental care with Dr. Yurii Herbei</p>
          <a href="/appointments" className="cta-button">
            Book Appointment
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
