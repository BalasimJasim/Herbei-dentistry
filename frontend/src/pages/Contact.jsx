import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from "./Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call
      console.log("Contact Form Data:", formData);
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Herbie Dental Clinic</title>
        <meta
          name="description"
          content="Contact Herbie Dental Clinic for appointments, inquiries, or emergencies. We're here to help with all your dental needs."
        />
      </Helmet>

      <section className={styles.contactHero}>
        <div className={styles.container}>
          <h1>Contact Us</h1>
          <p className={styles.lead}>
            We're here to help with all your dental needs
          </p>
        </div>
      </section>

      <section className={styles.contactContent}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.infoCard}>
                <h3>Visit Us</h3>
                <address>
                  123 Dental Street
                  <br />
                  City, State 12345
                </address>
              </div>

              <div className={styles.infoCard}>
                <h3>Office Hours</h3>
                <ul>
                  <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                  <li>Saturday: 9:00 AM - 2:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h3>Contact Information</h3>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@herbiedental.com</p>
              </div>

              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1234"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Herbie Dental Clinic Location"
                ></iframe>
              </div>
            </div>

            <div className={styles.contactFormContainer}>
              <h2>Send Us a Message</h2>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact 