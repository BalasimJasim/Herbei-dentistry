import {
  sendAppointmentNotifications,
  scheduleReminders,
  sendCancellationNotifications,
} from "../services/notificationService.js";
import Appointment from "../models/Appointment.js";
import { ApiError } from "../middleware/errorHandler.js";
import {
  checkTimeSlotAvailability,
  getAvailableTimeSlots as getTimeSlots,
} from "../services/appointmentService.js";
import { SERVICES } from "../config/servicesConfig.js";
import Specialist from "../models/Specialist.js";

const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it's a valid length (10-15 digits)
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return false;
  }

  return true;
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;

    // Check slot availability before creating appointment
    const { available, reason, message } = await checkTimeSlotAvailability(
      appointmentData.dateTime,
      appointmentData.serviceId
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: message,
      });
    }

    // Calculate end time based on service duration
    const service = SERVICES.find((s) => s.id === appointmentData.serviceId);
    const endTime = new Date(appointmentData.dateTime);
    endTime.setMinutes(endTime.getMinutes() + service.duration);

    // Create the appointment
    const appointment = await Appointment.create({
      ...appointmentData,
      endTime,
    });

    // Send notifications
    try {
      await sendAppointmentNotifications(appointment);
    } catch (notificationError) {
      console.error("Failed to send notifications:", notificationError);
      // Continue with the appointment creation even if notifications fail
    }

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create appointment",
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/appointments/available
// @access  Public
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, serviceId } = req.query;

    console.log("Received request for slots:", { date, serviceId });

    if (!date || !serviceId) {
      return res.status(400).json({
        success: false,
        message: "Both date and serviceId are required",
      });
    }

    // Parse and validate the date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Get available slots using the renamed imported function
    const slots = await getTimeSlots(parsedDate, serviceId);

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error("Error getting available slots:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get available time slots",
    });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    appointment.updatedAt = Date.now();

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Public
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    // Check if user owns this appointment or is admin
    if (appointment.email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to cancel this appointment",
      });
    }

    // Send cancellation notifications
    await sendCancellationNotifications(appointment);

    // Update appointment status
    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({
      success: false,
      error: "Error cancelling appointment",
    });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/user
// @access  Public
export const getUserAppointments = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("Fetching appointments for email:", email); // Debug log

    const appointments = await Appointment.find({
      email: email,
      // Optionally filter out old appointments
      dateTime: { $gte: new Date() },
    }).sort({ dateTime: 1 });

    console.log("Found appointments:", appointments); // Debug log

    res.json(appointments); // This will be an array, even if empty
  } catch (error) {
    console.error("Error in getUserAppointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Add this endpoint to get specialists by service
export const getSpecialistsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = SERVICES.find((s) => s.id === serviceId);

    if (!service) {
      return res.status(400).json({
        success: false,
        message: "Invalid service",
      });
    }

    const specialists = await Specialist.find({
      specialization: service.specialization,
      isActive: true,
    });

    res.json({
      success: true,
      data: specialists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialists",
      error: error.message,
    });
  }
};
