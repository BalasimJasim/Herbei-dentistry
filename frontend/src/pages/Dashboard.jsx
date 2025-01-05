import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axios";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/patient-portal");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        await fetchAppointments();
      } catch (error) {
        toast.error("Failed to load user data");
        navigate("/patient-portal");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/api/appointments/user");
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/patient-portal");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
        <nav className={styles.navigation}>
          <button
            className={`${styles.navButton} ${
              activeTab === "appointments" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            📅 Appointments
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "records" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("records")}
          >
            📋 Medical Records
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "messages" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("messages")}
          >
            💬 Messages
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "billing" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("billing")}
          >
            💳 Billing
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "settings" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </nav>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          {activeTab === "appointments" && (
            <button className={styles.primaryButton}>
              Book New Appointment
            </button>
          )}
        </header>

        <div className={styles.contentBody}>
          {activeTab === "appointments" && (
            <div className={styles.appointmentsList}>
              {appointments.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No appointments scheduled</p>
                  <button className={styles.primaryButton}>
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className={styles.appointmentCard}>
                    <div className={styles.appointmentInfo}>
                      <h3>{appointment.service}</h3>
                      <p>
                        📅 {new Date(appointment.date).toLocaleDateString()}
                        {" at "}
                        {appointment.time}
                      </p>
                      <p>👨‍⚕️ Dr. {appointment.doctor}</p>
                    </div>
                    <div className={styles.appointmentActions}>
                      <button className={styles.secondaryButton}>
                        Reschedule
                      </button>
                      <button className={styles.dangerButton}>Cancel</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "appointments" && (
            <div className={styles.comingSoon}>
              <h2>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} feature
                coming soon!
              </h2>
              <p>We're working hard to bring you this functionality.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
