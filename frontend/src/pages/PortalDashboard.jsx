import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./PortalDashboard.module.css";
import AppointmentManagement from "../components/portal/AppointmentManagement";
import {
  FaCalendar,
  FaFileAlt,
  FaComments,
  FaCreditCard,
} from "react-icons/fa";

const PortalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("appointments");

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // You can add analytics tracking here if needed
    console.log("Switched to section:", sectionId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "appointments":
        return <AppointmentManagement />;
      case "records":
        return <div>Medical Records coming soon...</div>;
      case "messages":
        return <div>Messaging coming soon...</div>;
      case "billing":
        return <div>Billing coming soon...</div>;
      default:
        return null;
    }
  };

  const features = [
    {
      id: "appointments",
      title: "Appointment Management",
      icon: <FaCalendar />,
      description: "View and manage your dental appointments",
    },
    {
      id: "records",
      title: "Medical Records",
      icon: <FaFileAlt />,
      description: "Access your dental history and treatment plans securely",
    },
    {
      id: "messages",
      title: "Secure Messaging",
      icon: <FaComments />,
      description: "Communicate directly with your dental care team",
    },
    {
      id: "billing",
      title: "Billing & Payments",
      icon: <FaCreditCard />,
      description: "View and pay bills online with ease",
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Welcome, {user.name}</h1>
        <p>Manage your dental care all in one place</p>
      </header>

      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <button
            key={feature.id}
            className={`${styles.featureCard} ${
              activeSection === feature.id ? styles.active : ""
            }`}
            onClick={() => handleSectionChange(feature.id)}
          >
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </button>
        ))}
      </div>

      <div className={styles.contentSection}>{renderContent()}</div>
    </div>
  );
};

export default PortalDashboard;
