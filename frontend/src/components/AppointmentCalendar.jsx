import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AppointmentCalendar.css";
import api from "../utils/axios";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { isHoliday, isWeekend } from "../utils/holidays";

const AppointmentCalendar = ({
  selectedDate,
  onDateSelect,
  onTimeSelect,
  selectedTime,
  serviceId,
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate && serviceId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, serviceId]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      console.log("Fetching slots for:", { date: selectedDate, serviceId });
      const response = await api.get("/api/appointments/available", {
        params: {
          date: selectedDate.toISOString().split("T")[0],
          serviceId: serviceId,
        },
      });
      console.log("Available slots response:", response.data);

      if (response.data.success) {
        setAvailableSlots(response.data.data || []);
      } else {
        console.error("Failed to fetch slots:", response.data.message);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarChange = (date) => {
    setCalendarDate(date);
    onDateSelect(date);
  };

  const renderTimeSlots = () => {
    if (!selectedDate) {
      return <div className="no-slots">Please select a date first</div>;
    }

    if (loading) {
      return <div className="loading-slots">Loading available times...</div>;
    }

    if (!serviceId) {
      return <div className="no-slots">Please select a service first</div>;
    }

    if (!availableSlots.length) {
      return (
        <div className="no-slots">No available time slots for this date</div>
      );
    }

    return (
      <div className="time-slots-container">
        <h3 className="time-slots-title">Available Times</h3>
        <div className="time-slots-grid">
          {availableSlots.map((slot) => {
            const time = new Date(slot.time);
            const isSelected = selectedTime?.getTime() === time.getTime();

            // Get the appropriate unavailability message
            let unavailabilityMessage = "";
            if (slot.unavailabilityReason === "PAST") {
              unavailabilityMessage = "Past time";
            } else if (slot.unavailabilityReason === "EXCEEDS_HOURS") {
              unavailabilityMessage = "Outside business hours";
            } else if (slot.unavailabilityReason === "CABINET_OCCUPIED") {
              unavailabilityMessage = "Cabinet occupied";
            } else if (slot.unavailabilityReason === "SPECIALIST_UNAVAILABLE") {
              unavailabilityMessage = "Specialist unavailable";
            }

            return (
              <button
                key={slot.time}
                className={`time-slot ${isSelected ? "selected" : ""} ${
                  !slot.available ? "unavailable" : ""
                } ${
                  slot.unavailabilityReason
                    ? `reason-${slot.unavailabilityReason.toLowerCase()}`
                    : ""
                }`}
                onClick={() => slot.available && onTimeSelect(time)}
                disabled={!slot.available}
                title={
                  unavailabilityMessage ||
                  `Available ${slot.duration} min appointment`
                }
              >
                <span className="time">{format(time, "HH:mm")}</span>
                {!slot.available && unavailabilityMessage && (
                  <span className="unavailability-reason">
                    {unavailabilityMessage}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="time-slots-legend">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-color reason-specialist-unavailable"></span>
            <span>Specialist Unavailable</span>
          </div>
          <div className="legend-item">
            <span className="legend-color reason-cabinet-occupied"></span>
            <span>Cabinet Occupied</span>
          </div>
        </div>
      </div>
    );
  };

  const tileDisabled = ({ date, view }) => {
    // Only run checks for month view
    if (view !== "month") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a copy of the date for comparison
    const compareDate = new Date(date.getTime());
    compareDate.setHours(0, 0, 0, 0);

    // Only disable weekends and holidays
    return isWeekend(compareDate) || isHoliday(compareDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date.getTime());
    compareDate.setHours(0, 0, 0, 0);

    let classes = [];

    // Weekend dates
    if (isWeekend(compareDate)) {
      classes.push("weekend");
    }

    // Past dates
    if (compareDate < today) {
      classes.push("past-date");
    }
    // Available dates (not weekend, not holiday)
    else if (!isWeekend(compareDate) && !isHoliday(compareDate)) {
      classes.push("available-date");
    }

    return classes.join(" ");
  };

  // Add tile content to show holiday names
  const tileContent = ({ date }) => {
    if (isHoliday(date)) {
      return <div className="holiday-marker">🎋</div>;
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleCalendarChange}
        value={selectedDate || calendarDate}
        tileDisabled={tileDisabled}
        tileContent={tileContent}
        minDate={new Date()}
        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
        navigationLabel={({ date }) => format(date, "yyyy-MM")}
        nextLabel={<FaChevronRight />}
        prevLabel={<FaChevronLeft />}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={true}
        calendarType="gregory"
        formatShortWeekday={(locale, date) =>
          ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]
        }
        className="custom-calendar"
        tileClassName={tileClassName}
        view="month"
        onViewChange={null}
      />
      {selectedDate && renderTimeSlots()}
    </div>
  );
};

AppointmentCalendar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  onTimeSelect: PropTypes.func.isRequired,
  selectedTime: PropTypes.instanceOf(Date),
  serviceId: PropTypes.string,
};

export default AppointmentCalendar;
