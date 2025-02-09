import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../utils/axios";
import AppointmentCalendar from "./AppointmentCalendar";
import styles from "./AppointmentForm.module.css";
import PropTypes from "prop-types";

const AppointmentForm = ({ onClose }) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    serviceId: "",
  });

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Load services when component mounts
  useEffect(() => {
    loadServices();
  }, []);

  // Disable editing of autofilled fields if user is logged in
  const isFieldDisabled = (fieldName) => {
    return (
      localStorage.getItem("autofill") &&
      (fieldName === "name" || fieldName === "email" || fieldName === "phone")
    );
  };

  // Fetch services
  const loadServices = async (retryCount = 0) => {
    setLoading(true);
    try {
      const response = await api.get("/api/services");
      console.log("Services response:", response.data);
      if (response.data.success && response.data.services) {
        // Group services by cabinet
        const groupedServices = {
          1: { name: "Consultation Services", services: [] },
          2: { name: "Operative Dentistry", services: [] },
          4: { name: "Orthopedic Services", services: [] },
          5: { name: "Orthodontics & Pediatric", services: [] },
          6: { name: "Surgery Services", services: [] },
        };

        console.log("Grouping services...");
        response.data.services.forEach((service) => {
          console.log("Processing service:", service);
          const cabinet = service.cabinetNumber || 1;
          if (cabinet === 2 || cabinet === 3) {
            if (groupedServices[2]) {
              groupedServices[2].services.push(service);
            }
          } else if (groupedServices[cabinet]) {
            groupedServices[cabinet].services.push(service);
          }
        });

        // Filter out empty cabinets
        const filtered = Object.fromEntries(
          Object.entries(groupedServices).filter(
            ([, value]) => value.services.length > 0
          )
        );

        console.log("Filtered services:", filtered);
        setServices(filtered);
      } else {
        console.error("Invalid services data:", response.data);
        throw new Error("Invalid services data format");
      }
    } catch (error) {
      console.error("Failed to load services:", error);
      if (retryCount < 3) {
        // Retry up to 3 times
        console.log(`Retrying service load... Attempt ${retryCount + 1}`);
        setTimeout(() => loadServices(retryCount + 1), 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        toast.error(
          t("Failed to load services. Please try refreshing the page.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (serviceId) => {
    console.log("Selecting service with ID:", serviceId);
    console.log("Available services:", services);

    //Find the selected service to get its ID
    const selectedService = Object.values(services)
      .flatMap((category) => category.services)
      .find((service) => service._id === serviceId || service.id === serviceId);

    console.log("Found service:", selectedService);

    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        serviceId: selectedService.id,
      }));
      setCurrentStep(2); // Move to date selection
    } else {
      toast.error(t("Failed to select service. Please try again."));
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3); // Move to personal info
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      serviceId: "",
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentDate = new Date(selectedDate);
      const timeDate = new Date(selectedTime);
      appointmentDate.setHours(
        timeDate.getHours(),
        timeDate.getMinutes(),
        0,
        0
      );

      // Get user data if logged in
      const token = localStorage.getItem("token");
      const userData = token ? JSON.parse(localStorage.getItem("user")) : null;

      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        serviceId: formData.serviceId,
        dateTime: appointmentDate.toISOString(),
        status: "scheduled",
        userId: userData?.userId,
      };

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      };

      const response = await api.post(
        "/api/appointments",
        appointmentData,
        config
      );

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        resetForm();
        if (typeof onClose === "function") {
          onClose();
        }
      } else {
        throw new Error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.serviceId) {
      toast.error("Please select a service");
      return false;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return false;
    }
    if (!selectedTime) {
      toast.error("Please select a time");
      return false;
    }
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate email only if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  return (
    <div className={styles.formContainer}>
      {currentStep === 1 && (
        <div className={styles.formStep}>
          <h2 className={styles.formTitle}>{t("Select Your Service")}</h2>
          <div className={styles.serviceSelection}>
            <button
              className={styles.serviceSelectButton}
              onClick={() => setIsServiceModalOpen(true)}
            >
              {formData.serviceId
                ? Object.values(services)
                    .flatMap((category) => category.services)
                    .find((service) => service.id === formData.serviceId)?.name
                : t("Choose a service...")}
            </button>

            {isServiceModalOpen && (
              <div
                className={styles.serviceModalOverlay}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsServiceModalOpen(false);
                  }
                }}
              >
                <div
                  className={styles.serviceModal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {t("Select a Service")}
                    </h2>
                    <button
                      className={styles.closeButton}
                      onClick={() => setIsServiceModalOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  {loading ? (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <p>{t("Loading services...")}</p>
                    </div>
                  ) : (
                    Object.entries(services).map(([categoryId, category]) => (
                      <div key={categoryId} className={styles.categorySection}>
                        <h3 className={styles.categoryTitle}>
                          {category.name}
                        </h3>
                        {category.services.map((service) => (
                          <button
                            key={service.id}
                            className={`${styles.serviceOption} ${
                              formData.serviceId === service.id
                                ? styles.selected
                                : ""
                            }`}
                            onClick={() => {
                              handleServiceSelect(service.id);
                              setIsServiceModalOpen(false);
                            }}
                          >
                            <div>
                              <div className={styles.serviceName}>
                                {service.name}
                              </div>
                              <div className={styles.serviceDescription}>
                                {service.description}
                              </div>
                            </div>
                            <div className={styles.serviceDuration}>
                              {service.duration} min
                            </div>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className={styles.formStep}>
          <h2 className={styles.formTitle}>{t("Choose Date & Time")}</h2>
          <AppointmentCalendar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            serviceId={formData.serviceId}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className={styles.formStep}>
          <h2 className={styles.formTitle}>{t("Personal Details")}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">{t("First Name")} *</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={isFieldDisabled("firstName")}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">{t("Last Name")} *</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={isFieldDisabled("lastName")}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">{t("Email")}</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isFieldDisabled("email")}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">{t("Phone")} *</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={isFieldDisabled("phone")}
                required
                placeholder="0123456789"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">{t("Notes")}</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                placeholder={t("Any additional information...")}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? t("Booking...") : t("Book Appointment")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

AppointmentForm.propTypes = {
  onClose: PropTypes.func,
};

export default AppointmentForm;
