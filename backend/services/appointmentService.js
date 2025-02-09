import Appointment from '../models/Appointment.js';
import { SERVICES, SPECIALISTS, CABINETS } from "../config/servicesConfig.js";

// Helper function to find service by ID
const findServiceById = (serviceId) => {
  console.log("Looking for service with ID:", serviceId);
  const service = SERVICES.find(
    (s) => s.id === serviceId || s._id === serviceId
  );
  if (!service) {
    throw new Error(`Service not found for ID: ${serviceId}`);
  }
  console.log("Found service:", service);
  return service;
};

// Helper function to find available specialist for a service
const findAvailableSpecialist = async (service, dateTime, duration) => {
  const cabinet = CABINETS[service.cabinetNumber];
  const specialistsInCategory = Object.entries(SPECIALISTS).filter(
    ([_, specialist]) => specialist.category === cabinet.category
  );

  // Get all appointments for this time period
  const appointmentEndTime = new Date(dateTime);
  appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + duration);

  const existingAppointments = await Appointment.find({
    dateTime: { $lt: appointmentEndTime },
    endTime: { $gt: dateTime },
    status: { $ne: "cancelled" },
  });

  // Find a specialist who is not booked during this time
  for (const [specialistId, specialist] of specialistsInCategory) {
    const isBooked = existingAppointments.some((apt) => {
      const service = SERVICES.find((s) => s.id === apt.serviceId);
      const cabinet = CABINETS[service.cabinetNumber];
      return cabinet.category === specialist.category;
    });

    if (!isBooked) {
      return { specialistId, specialist };
    }
  }

  return null;
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

    // Find available specialist
    const availableSpecialist = await findAvailableSpecialist(
      service,
      appointmentDateTime,
      service.duration
    );

    if (!availableSpecialist) {
      return {
        available: false,
        reason: "NO_SPECIALIST_AVAILABLE",
        message: "No specialist available for this time slot",
      };
    }

    // Check for overlapping appointments in the same cabinet
    const overlappingAppointment = await Appointment.findOne({
      status: { $ne: "cancelled" },
      $or: [
        {
          dateTime: { $lt: appointmentEndTime },
          endTime: { $gt: appointmentDateTime },
        },
      ],
    }).populate("serviceId");

    if (overlappingAppointment) {
      const overlappingService = findServiceById(
        overlappingAppointment.serviceId
      );
      if (overlappingService.cabinetNumber === service.cabinetNumber) {
        return {
          available: false,
          reason: "OVERLAP",
          message: "This time slot is already booked in this cabinet",
        };
      }
    }

    return {
      available: true,
      reason: null,
      message: "Time slot is available",
      specialist: availableSpecialist,
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

    // Get all appointments for the day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      dateTime: {
        $gte: dayStart,
        $lte: dayEnd,
      },
      status: { $ne: "cancelled" },
    });

    // Generate all possible time slots
    while (baseDate.getHours() < endHour) {
      const slotTime = new Date(baseDate);
      const slotEndTime = new Date(slotTime);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + service.duration);

      // Check if slot is in the past
      const isPast = slotTime <= now;

      // Check specialist availability
      const specialistAvailable =
        !isPast &&
        (await findAvailableSpecialist(service, slotTime, service.duration));

      // Check for overlapping appointments based on service type and cabinet
      const overlappingAppointments = appointments.filter((apt) => {
        const aptService = findServiceById(apt.serviceId);
        const aptStart = new Date(apt.dateTime);
        const aptEnd = new Date(aptStart);
        aptEnd.setMinutes(aptEnd.getMinutes() + aptService.duration);

        const timeOverlap =
          (slotTime >= aptStart && slotTime < aptEnd) ||
          (slotEndTime > aptStart && slotEndTime <= aptEnd) ||
          (slotTime <= aptStart && slotEndTime >= aptEnd);

        // For operative services (cabinets 2 & 3)
        if (service.cabinetNumber === 2 || service.cabinetNumber === 3) {
          return (
            timeOverlap &&
            (aptService.cabinetNumber === 2 || aptService.cabinetNumber === 3)
          );
        }

        // For all other services
        return (
          timeOverlap && aptService.cabinetNumber === service.cabinetNumber
        );
      });

      // For operative services, check if both cabinets are occupied
      const isOverlapping =
        service.cabinetNumber === 2 || service.cabinetNumber === 3
          ? overlappingAppointments.length >= 2 // Both operative cabinets are occupied
          : overlappingAppointments.length > 0; // Single cabinet is occupied

      // Check if the slot end time exceeds business hours
      const exceedsBusinessHours =
        slotEndTime.getHours() >= endHour ||
        (slotEndTime.getHours() === endHour && slotEndTime.getMinutes() > 0);

      // Check if the same service is already booked in this time slot
      const sameServiceBooked = overlappingAppointments.some(
        (apt) => apt.serviceId === serviceId
      );

      // Determine the reason for unavailability
      let unavailabilityReason = null;
      if (isPast) {
        unavailabilityReason = "PAST";
      } else if (exceedsBusinessHours) {
        unavailabilityReason = "EXCEEDS_HOURS";
      } else if (sameServiceBooked) {
        unavailabilityReason = "SERVICE_ALREADY_BOOKED";
      } else if (isOverlapping) {
        unavailabilityReason = "CABINET_OCCUPIED";
      } else if (!specialistAvailable) {
        unavailabilityReason = "SPECIALIST_UNAVAILABLE";
      }

      slots.push({
        time: slotTime.toISOString(),
        available:
          !isPast &&
          !isOverlapping &&
          !exceedsBusinessHours &&
          !sameServiceBooked &&
          specialistAvailable,
        isPast,
        hasSpecialist: !!specialistAvailable,
        unavailabilityReason,
        duration: service.duration,
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

export default {
  getAvailableTimeSlots,
  checkTimeSlotAvailability,
  findServiceById,
}; 