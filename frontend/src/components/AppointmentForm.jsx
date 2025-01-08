import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../utils/axios";
import AppointmentCalendar from "./AppointmentCalendar";
import styles from "./AppointmentForm.module.css";

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    firstName: location.state?.autofill
      ? location.state.userData?.name?.split(" ")[0] || ""
      : "",
    lastName: location.state?.autofill
      ? location.state.userData?.name?.split(" ")[1] || ""
      : "",
    email: location.state?.autofill ? location.state.userData?.email || "" : "",
    phone: location.state?.autofill ? location.state.userData?.phone || "" : "",
    serviceId: "",
    notes: "",
  });

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Disable editing of autofilled fields if user is logged in
  const isFieldDisabled = (fieldName) => {
    return (
      location.state?.autofill &&
      (fieldName === "name" || fieldName === "email" || fieldName === "phone")
    );
  };

  // Fetch services on mount
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/services");
        console.log("Services response:", response.data);
        if (response.data.success) {
          // Group services by cabinet
          const groupedServices = {
            1: { name: "Consultation Services", services: [] },
            2: { name: "Operative Dentistry", services: [] },
            4: { name: "Orthopedic Services", services: [] },
            5: { name: "Orthodontics & Pediatric", services: [] },
            6: { name: "Surgery Services", services: [] },
          };

          response.data.services.forEach((service) => {
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

          setServices(filtered);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
        toast.error(t("Failed to load services. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [t]);

  const handleServiceSelect = (serviceId) => {
    //Find the selected service to get its ID
    const selectedService = Object.values(services)
      .flatMap((category) => category.services)
      .find((service) => service._id === serviceId);

    setFormData((prev) => ({
      ...prev,
      serviceId: selectedService.id || selectedService._id,
    }));
    setCurrentStep(2); // Move to date selection
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3); // Move to personal info
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

      console.log("AppointmentForm - Creating appointment", {
        hasToken: !!token,
        userData,
      });

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

      console.log("AppointmentForm - Appointment data:", appointmentData);

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
      console.log("AppointmentForm - Response:", response.data);

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        if (userData?.userId) {
          navigate("/portal-dashboard");
        } else {
          navigate("/appointments/confirmation", {
            state: { appointment: response.data.data },
          });
        }
      }
    } catch (error) {
      console.error("AppointmentForm - Error:", error);
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
                    .find((service) => service._id === formData.serviceId)?.name
                : t("Choose a service...")}
            </button>

            {isServiceModalOpen && (
              <div className={styles.serviceModalOverlay}>
                <div className={styles.serviceModal}>
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
                    <div>Loading services...</div>
                  ) : (
                    Object.entries(services).map(([categoryId, category]) => (
                      <div key={categoryId}>
                        <h3 className={styles.categoryTitle}>
                          {category.name}
                        </h3>
                        {category.services.map((service) => (
                          <button
                            key={service._id}
                            className={`${styles.serviceOption} ${
                              formData.serviceId === service._id
                                ? styles.selected
                                : ""
                            }`}
                            onClick={() => {
                              handleServiceSelect(service._id);
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

export default AppointmentForm;