import Appointment from '../models/Appointment.js';
import { SERVICES } from "../config/servicesConfig.js";

// Helper function to find service by ID
const findServiceById = (serviceId) => {
  const service = SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    throw new Error(`Service not found for ID: ${serviceId}`);
  }
  return service;
};

// Add this function to check business hours
const isWithinBusinessHours = (dateTime) => {
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const dayOfWeek = dateTime.getDay();

  // Check if it's a weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // Check if within business hours (9 AM - 5 PM)
  if (hours < 9 || hours >= 17) {
    return false;
  }

  // If it's 5 PM, don't allow appointments to start
  if (hours === 17 && minutes > 0) {
    return false;
  }

  return true;
};

// Update the checkTimeSlotAvailability function
export const checkTimeSlotAvailability = async (dateTime, serviceId) => {
  try {
    const service = findServiceById(serviceId);
    const appointmentDateTime = new Date(dateTime);
    const appointmentEndTime = new Date(appointmentDateTime);
    appointmentEndTime.setMinutes(
      appointmentEndTime.getMinutes() + service.duration
    );

    // Validate business hours
    if (!isWithinBusinessHours(appointmentDateTime)) {
      return {
        available: false,
        reason: "OUTSIDE_BUSINESS_HOURS",
        message:
          "Please select a time during business hours (9 AM - 5 PM, Monday to Friday)",
      };
    }

    // Check if appointment end time exceeds business hours
    if (!isWithinBusinessHours(appointmentEndTime)) {
      return {
        available: false,
        reason: "EXCEEDS_BUSINESS_HOURS",
        message: "The appointment duration exceeds business hours",
      };
    }

    // Check if time slot is in the past
    const now = new Date();
    if (appointmentDateTime <= now) {
      return {
        available: false,
        reason: "PAST_TIME",
        message: "Cannot book appointments in the past",
      };
    }

    // Check for overlapping appointments
    const overlappingAppointment = await Appointment.findOne({
      serviceId,
      status: { $ne: "cancelled" },
      $or: [
        {
          dateTime: { $lt: appointmentEndTime },
          endTime: { $gt: appointmentDateTime },
        },
      ],
    });

    if (overlappingAppointment) {
      return {
        available: false,
        reason: "OVERLAP",
        message: "This time slot is already booked",
      };
    }

    return {
      available: true,
      reason: null,
      message: "Time slot is available",
    };
  } catch (error) {
    console.error("Error checking slot availability:", error);
    throw error;
  }
};

// Get available time slots
export const getAvailableTimeSlots = async (date, serviceId) => {
  try {
    const service = findServiceById(serviceId);
    const slots = [];

    // Business hours
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    // Set up the date for time slot generation
    const baseDate = new Date(date);
    baseDate.setHours(startHour, 0, 0, 0);

    // Current time for comparison
    const now = new Date();

    // Generate all possible time slots
    while (baseDate.getHours() < endHour) {
      const slotTime = new Date(baseDate);
      const slotEndTime = new Date(slotTime);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + service.duration);

      // Check if slot is in the past
      const isPast = slotTime <= now;

      // Only check availability for future slots
      let isAvailable = false;
      if (!isPast) {
        const { available } = await checkTimeSlotAvailability(
          slotTime,
          serviceId
        );
        isAvailable = available;
      }

      slots.push({
        time: slotTime.toISOString(),
        available: isAvailable,
        isPast,
      });

      // Move to next slot
      baseDate.setMinutes(baseDate.getMinutes() + slotDuration);
    }

    return slots;
  } catch (error) {
    console.error("Error getting available slots:", error);
    throw error;
  }
}; 