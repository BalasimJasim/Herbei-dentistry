import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './AppointmentCalendar.css'
import api from '../utils/axios'
import { format } from 'date-fns'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { isHoliday, isWeekend } from "../utils/holidays";

const AppointmentCalendar = ({
  selectedDate,
  onDateSelect,
  onTimeSelect,
  selectedTime,
  selectedService,
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/appointments/available", {
        params: {
          date: selectedDate.toISOString(),
          serviceId: selectedService,
        },
      });
      setAvailableSlots(response.data.data || []);
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

  const navigationLabel = ({ date, label, locale, view }) => {
    return (
      <span className="calendar-nav-label">{format(date, "MMMM yyyy")}</span>
    );
  };

  const navigation = {
    prev: <FaChevronLeft className="calendar-nav-icon" />,
    next: <FaChevronRight className="calendar-nav-icon" />,
    prev2: null,
    next2: null,
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: new Date(selectedDate).setHours(hour, 0, 0, 0),
        available: true,
      });
      slots.push({
        time: new Date(selectedDate).setHours(hour, 30, 0, 0),
        available: true,
      });
    }

    return slots.map((slot) => ({
      ...slot,
      available: availableSlots.some(
        (availSlot) => new Date(availSlot.time).getTime() === slot.time
      ),
    }));
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;
    if (loading)
      return <div className="loading-slots">Loading available times...</div>;

    const slots = generateTimeSlots();

    if (slots.length === 0) {
      return (
        <div className="no-slots">No available time slots for this date</div>
      );
    }

    return (
      <div className="time-slots">
        {slots.map((slot) => {
          const timeString = format(new Date(slot.time), "HH:mm");
          const isSelected = selectedTime === new Date(slot.time).toISOString();

          return (
            <button
              key={slot.time}
              className={`time-slot ${isSelected ? "selected" : ""} ${
                !slot.available ? "disabled" : ""
              }`}
              onClick={() =>
                slot.available &&
                onTimeSelect(new Date(slot.time).toISOString())
              }
              disabled={!slot.available}
            >
              {timeString}
            </button>
          );
        })}
      </div>
    );
  };

  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates, weekends, and holidays
    return date < today || isWeekend(date) || isHoliday(date);
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
        maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        navigationLabel={navigationLabel}
        nextLabel={navigation.next}
        prevLabel={navigation.prev}
        next2Label={navigation.next2}
        prev2Label={navigation.prev2}
        showNeighboringMonth={false}
        formatShortWeekday={(locale, date) => format(date, "EEE")}
        className="custom-calendar"
      />
      {selectedDate && renderTimeSlots()}
    </div>
  );
};

export default AppointmentCalendar 