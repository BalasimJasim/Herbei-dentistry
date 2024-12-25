import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import "./Services.css";

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      category: "Хірургічна стоматологія",
      icon: "🦷",
      services: [
        {
          name: "Дентальна імплантація",
          description:
            "Встановлення імплантів преміум класу Nobel Biocare та Straumann",
          features: [
            "Комп'ютерне планування імплантації",
            "Імплантація за один день",
            "Гарантія на імпланти",
          ],
        },
        {
          name: "Видалення зубів",
          description: "Атравматичне видалення зубів будь-якої складності",
          features: [
            "Безболісне видалення",
            "Збереження кісткової тканини",
            "Швидке відновлення",
          ],
        },
        {
          name: "Кістково-пластичні операції",
          description: "Відновлення об'єму кісткової тканини",
          features: [
            "Синус-ліфтинг",
            "Направлена регенерація кістки",
            "Використання сучасних матеріалів",
          ],
        },
      ],
    },
    {
      id: 2,
      category: "Ортопедична стоматологія",
      icon: "👑",
      services: [
        {
          name: "Протезування на імплантах",
          description: "Відновлення втрачених зубів за допомогою імплантів",
          features: [
            "Індивідуальний дизайн посмішки",
            "Естетичні коронки",
            "Довговічні матеріали",
          ],
        },
        {
          name: "Вініри та коронки",
          description: "Естетична реставрація зубів",
          features: [
            "Цифрове моделювання",
            "Безметалева кераміка",
            "Природний вигляд",
          ],
        },
      ],
    },
    {
      id: 3,
      category: "Профілактика та гігієна",
      icon: "✨",
      services: [
        {
          name: "Професійна гігієна",
          description: "Комплексна чистка зубів та профілактика захворювань",
          features: [
            "Ультразвукова чистка",
            "Air Flow чистка",
            "Фторування емалі",
          ],
        },
        {
          name: "Відбілювання зубів",
          description: "Професійне відбілювання за сучасними технологіями",
          features: [
            "Безпечне відбілювання",
            "Тривалий результат",
            "Індивідуальний підбір відтінку",
          ],
        },
      ],
    },
  ];

  return (
    <div className="services-page">
      <Helmet>
        <title>Послуги - Herbie Dental</title>
        <meta
          name="description"
          content="Повний спектр стоматологічних послуг: імплантація, протезування, естетична стоматологія"
        />
      </Helmet>

      <div className="services-hero">
        <div className="container">
          <h1>Наші Послуги</h1>
          <p>Комплексний підхід до лікування та естетичної реабілітації</p>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          {services.map((category) => (
            <div key={category.id} className="service-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h2>{category.category}</h2>
              </div>
              <div className="services-grid">
                {category.services.map((service, index) => (
                  <div key={index} className="service-card">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <ul className="features-list">
                      {service.features.map((feature, idx) => (
                        <li key={idx}>
                          <span className="feature-bullet">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="consultation-cta">
        <div className="container">
          <h2>Потрібна консультація?</h2>
          <p>
            Запишіться на безкоштовну консультацію та отримайте детальний план
            лікування
          </p>
          <a href="/appointments" className="cta-button">
            Записатись на прийом
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
