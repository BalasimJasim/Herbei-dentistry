import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import founderImage from "../assets/images/image0.jpeg";
import "./About.css";

const About = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      id: 1,
      name: "Юрій Гербей",
      role: "Хірург-стоматолог, Ортопед-стоматолог",
      image: founderImage,
      description:
        "Засновник клініки, провідний спеціаліст з хірургічної та ортопедичної стоматології. Має великий досвід у складних хірургічних випадках та естетичному протезуванні. Постійно вдосконалює свої навички на міжнародних конференціях та майстер-класах.",
      specializations: [
        "Дентальна імплантація",
        "Кістково-пластичні операції",
        "Протезування на імплантах",
        "Естетична реабілітація",
        "Хірургічна пародонтологія",
      ],
      expertise: [
        "Спеціалізація в хірургічній стоматології та ортопедії з 2018 року",
        "Експерт з імплантації та протезування на імплантах",
        "Досвід проведення складних кістково-пластичних операцій",
        "Сертифікований спеціаліст по системам імплантації Nobel Biocare та Straumann",
        "Учасник міжнародних конференцій з імплантології та естетичної стоматології",
      ],
    },
    {
      id: 2,
      name: "Марія Ковальчук",
      role: "Терапевт-стоматолог",
      image: "/images/placeholder-female.jpg",
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
      image: "/images/placeholder-female.jpg",
      description:
        "Експерт з професійної гігієни порожнини рота та профілактики захворювань ясен.",
      specializations: ["Професійна гігієна", "Відбілювання", "Профілактика"],
    },
  ];

  return (
    <div className="about-page">
      <Helmet>
        <title>{t("about.title")} - Herbie Dental</title>
        <meta name="description" content={t("about.subtitle")} />
      </Helmet>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1>{t("about.title")}</h1>
          <p className="subtitle">{t("about.subtitle")}</p>
        </div>
      </div>

      {/* Updated Founder Section */}
      <div className="founder-section">
        <div className="container">
          <div className="founder-content">
            <div className="founder-image">
              <img
                src={founderImage}
                alt="Юрій Гербей - Хірург-стоматолог, Ортопед"
              />
            </div>
            <div className="founder-info">
              <span className="founder-label">Засновник та Головний Лікар</span>
              <h2>Юрій Гербей</h2>
              <h3>Хірург-стоматолог, Ортопед-стоматолог</h3>
              <p className="founder-description">
                Спеціаліст з більш ніж 5-річним досвідом у хірургічній та
                ортопедичній стоматології. Експерт з дентальної імплантації та
                естетичного протезування. Постійно вдосконалює свої навички,
                відвідуючи міжнародні конференції та майстер-класи провідних
                спеціалістів світу.
              </p>
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
