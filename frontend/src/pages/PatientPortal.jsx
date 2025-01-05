import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axios";
import styles from "./PatientPortal.module.css?module";

const PatientPortal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (response.data) {
        toast.success("Registration successful! Please login.");
        setActiveTab("login");
        setFormData({
          email: "",
          password: "",
          name: "",
          phone: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again later.";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.portalPage}>
      <Helmet>
        <title>Patient Portal - Herbie Dental</title>
        <meta
          name="description"
          content="Access your dental records, appointments, and more through our secure patient portal."
        />
      </Helmet>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Patient Portal</h1>
          <p className={styles.subtitle}>
            Manage your dental care journey with our secure online portal
          </p>
        </div>
      </section>

      <section className={styles.portalSection}>
        <div className={styles.container}>
          <div className={styles.portalGrid}>
            <div className={styles.portalFeatures}>
              <h2>Portal Features</h2>
              <div className={styles.featuresList}>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>📅</div>
                  <h3>Appointment Management</h3>
                  <p>View upcoming appointments and request new ones online</p>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>📋</div>
                  <h3>Medical Records</h3>
                  <p>Access your dental history and treatment plans securely</p>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>💬</div>
                  <h3>Secure Messaging</h3>
                  <p>Communicate directly with your dental care team</p>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>💳</div>
                  <h3>Billing & Payments</h3>
                  <p>View and pay bills online with ease</p>
                </div>
              </div>
            </div>

            <div className={styles.portalAccess}>
              <div className={styles.tabButtons}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "login" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "register" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </div>

              <div className={styles.formContainer}>
                {activeTab === "login" ? (
                  <form className={styles.portalForm} onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                    <Link
                      to="/forgot-password"
                      className={styles.forgotPassword}
                    >
                      Forgot Password?
                    </Link>
                  </form>
                ) : (
                  <form className={styles.portalForm} onSubmit={handleRegister}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10}"
                        placeholder="0123456789"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientPortal;
