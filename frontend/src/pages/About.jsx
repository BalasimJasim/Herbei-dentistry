import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import styles from "./About.module.css";
import founderImage from "../assets/images/founder.jpeg";
import womanDentist from "../assets/images/woman-dentist.jpeg";
import middleEasternDentist from "../assets/images/middle-east.jpeg";
import doctorWithPatient from "../assets/images/doc.jpeg";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.aboutPage}>
      <Helmet>
        <title>{t("about.pageTitle")} - Herbie Dental</title>
        <meta name="description" content={t("about.pageDescription")} />
      </Helmet>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>{t("about.title")}</h1>
          <p className={styles.subtitle}>{t("about.subtitle")}</p>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={styles.container}>
          <div className={styles.founderGrid}>
            <div className={styles.founderImage}>
              <img src={founderImage} alt="Dr. Yurii Herbei" />
            </div>
            <div className={styles.founderContent}>
              <span className={styles.subtitle}>
                Founder & Lead Dental Surgeon
              </span>
              <h2>Dr. Yurii Herbei</h2>
              <h3>Oral & Maxillofacial Surgeon, Implantologist</h3>
              <p>{t("about.founder.description")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Team</h2>
            <p>Meet our experienced dental professionals</p>
          </div>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img src={middleEasternDentist} alt="Dr. Sarah Johnson" />
              </div>
              <div className={styles.memberInfo}>
                <h3>Dr. Sarah Johnson</h3>
                <span className={styles.role}>Orthodontist</span>
                <p>
                  Specializing in creating beautiful smiles through advanced
                  orthodontic treatments.
                </p>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img src={doctorWithPatient} alt="Dr. Michael Chen" />
              </div>
              <div className={styles.memberInfo}>
                <h3>Dr. Michael Chen</h3>
                <span className={styles.role}>Endodontist</span>
                <p>Expert in root canal therapy and dental pain management.</p>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img src={womanDentist} alt="Dr. Emma Davis" />
              </div>
              <div className={styles.memberInfo}>
                <h3>Dr. Emma Davis</h3>
                <span className={styles.role}>Pediatric Dentist</span>
                <p>
                  Dedicated to providing gentle dental care for our youngest
                  patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
