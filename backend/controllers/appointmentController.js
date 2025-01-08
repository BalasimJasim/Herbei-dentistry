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
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { Types } from "mongoose";

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

    // Check slot availability
    const { available, message } = await checkTimeSlotAvailability(
      appointmentData.dateTime,
      appointmentData.serviceId
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: message,
      });
    }

    // If userId is provided (logged in user), validate and convert it
    if (appointmentData.userId) {
      try {
        appointmentData.userId = new mongoose.Types.ObjectId(
          appointmentData.userId
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }
    }

    // Calculate end time based on service duration
    const service = SERVICES.find((s) => s.id === appointmentData.serviceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const endTime = new Date(appointmentData.dateTime);
    endTime.setMinutes(endTime.getMinutes() + service.duration);

    // Create the appointment
    const appointment = await Appointment.create({
      ...appointmentData,
      endTime,
    });

    // Send notifications
    console.log("Sending appointment notifications...");
    const notificationResult = await sendAppointmentNotifications(appointment);
    console.log("Notification result:", notificationResult);

    // Schedule reminders
    await scheduleReminders(appointment);

    res.status(201).json({
      success: true,
      data: appointment,
      notifications: notificationResult,
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
    console.log("=== getUserAppointments Start ===");
    console.log("Request user:", req.user);
    console.log("Request query:", req.query);

    // Get email from either query params or user object
    const email = req.query.email || req.user?.email;
    const userId = req.query.userId || req.user?.userId;

    if (!email || !userId) {
      console.error("Missing required data:", { email, userId });
      return res.status(400).json({
        success: false,
        message: "Email and userId are required",
      });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    console.log("Looking for appointments with:", {
      email,
      userId: userIdObj.toString(),
    });

    // Find appointments with either userId or email
    const appointments = await Appointment.find({
      $or: [{ userId: userIdObj }, { email: email }],
    })
      .sort({ dateTime: -1 })
      .populate("serviceId", "name duration")
      .lean();

    console.log("Found appointments:", appointments.length);

    // Split appointments into upcoming and past
    const now = new Date();
    const { upcoming, past } = appointments.reduce(
      (acc, apt) => {
        if (new Date(apt.dateTime) > now) {
          acc.upcoming.push(apt);
        } else {
          acc.past.push(apt);
        }
        return acc;
      },
      { upcoming: [], past: [] }
    );

    console.log("Processed appointments:", {
      upcoming: upcoming.length,
      past: past.length,
    });

    return res.status(200).json({
      success: true,
      data: { upcoming, past },
    });
  } catch (error) {
    console.error("getUserAppointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
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

// @desc    Delete appointment record (only for past appointments)
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointmentRecord = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if user owns this appointment
    if (appointment.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this appointment",
      });
    }

    // Check if appointment is in the past
    if (new Date(appointment.dateTime) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete future appointments. Use cancel instead.",
      });
    }

    await appointment.remove();

    res.json({
      success: true,
      message: "Appointment record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment record:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting appointment record",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
