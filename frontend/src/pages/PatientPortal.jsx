import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import api from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import styles from "./PatientPortal.module.css";

const PatientPortal = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { lang } = useParams();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log("CSS Module classes:", {
      portalPage: styles.portalPage,
      heroSection: styles.heroSection,
    });
    // Check if styles are actually being applied
    const element = document.querySelector(`[data-testid="portal-page"]`);
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      console.log("Applied styles:", {
        minHeight: computedStyle.minHeight,
        paddingTop: computedStyle.paddingTop,
        backgroundColor: computedStyle.backgroundColor,
      });
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(lang ? `/${lang}/portal-dashboard` : "/portal-dashboard");
    }
  }, [isAuthenticated, navigate, lang]);

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
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      console.log("Attempting login with:", {
        email: loginData.email,
        hasPassword: !!loginData.password,
      });

      const response = await api.post("/api/auth/login", loginData);
      console.log("Login response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      await login(response.data);
      navigate(lang ? `/${lang}/portal-dashboard` : "/portal-dashboard");
    } catch (error) {
      console.error("Login error details:", error);
      toast.error(error.message || "Failed to login");
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

  // Add debug logging for styles
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Available CSS classes:", Object.keys(styles));
      const element = document.querySelector(`.${styles.portalPage}`);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        console.log("Applied styles:", {
          className: styles.portalPage,
          computedStyles: {
            background: computedStyle.background,
            padding: computedStyle.padding,
            minHeight: computedStyle.minHeight,
          },
        });
      }
    }
  }, []);

  return (
    <div className={styles.portalPage} data-testid="portal-page">
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
