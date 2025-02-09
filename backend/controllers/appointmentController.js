import asyncHandler from "express-async-handler";
import Appointment from "../models/Appointment.js";
import { validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import appointmentService from "../services/appointmentService.js";
import { sendAppointmentNotifications } from "../services/notificationService.js";

// @desc    Get user appointments
// @route   GET /api/appointments/user
// @access  Private
export const getUserAppointments = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const appointments = await Appointment.find({ email }).sort({ dateTime: -1 });
  res.json(appointments);
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { firstName, lastName, email, phone, dateTime, serviceId, notes } =
    req.body;

  try {
    // Check if the time slot is available using the appointmentService
    const availability = await appointmentService.checkTimeSlotAvailability(
      dateTime,
      serviceId
    );

    if (!availability.available) {
      res.status(400);
      throw new Error(availability.message);
    }

    // Find the service to get its duration
    const service = await appointmentService.findServiceById(serviceId);
    if (!service) {
      res.status(400);
      throw new Error("Invalid service selected");
    }

    // Calculate end time based on service duration
    const startDateTime = new Date(dateTime);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration);

    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      dateTime: startDateTime,
      endTime: endDateTime,
      serviceId,
      specialistId: availability.specialist.specialistId,
      notes,
      status: "scheduled",
    });

    if (appointment) {
      // Send confirmation notifications
      const notificationResult = await sendAppointmentNotifications({
        ...appointment.toObject(),
        service: service.name,
        specialist: availability.specialist.specialist.name,
      });

      console.log("Notification result:", notificationResult);

      res.status(201).json({
        success: true,
        data: {
          ...appointment.toObject(),
          specialist: availability.specialist.specialist.name,
        },
        notifications: {
          emailSent: notificationResult.emailSent,
          smsSent: notificationResult.smsSent,
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid appointment data");
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(error.status || 500);
    throw new Error(error.message || "Failed to create appointment");
  }
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  // Check if appointment belongs to user
  if (appointment.email !== req.user.email && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to cancel this appointment");
  }

  appointment.status = "cancelled";
  const updatedAppointment = await appointment.save();

  res.json(updatedAppointment);
});

// @desc    Get available time slots
// @route   GET /api/appointments/available
// @access  Public
export const getAvailableTimeSlots = asyncHandler(async (req, res) => {
  const { date, serviceId } = req.query;

  if (!date || !serviceId) {
    res.status(400);
    throw new Error("Date and serviceId are required");
  }

  try {
    const slots = await appointmentService.getAvailableTimeSlots(
      date,
      serviceId
    );
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
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  // Check if appointment belongs to user
  if (appointment.email !== req.user.email && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to update this appointment");
  }

  // If dateTime is being updated, check if the new time slot is available
  if (req.body.dateTime) {
    const existingAppointment = await Appointment.findOne({
      dateTime: new Date(req.body.dateTime),
      status: { $ne: "cancelled" },
      _id: { $ne: req.params.id }, // Exclude current appointment
    });

    if (existingAppointment) {
      res.status(400);
      throw new Error("This time slot is already booked");
    }
  }

  // Update only the fields that are provided
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined) {
      appointment[key] = req.body[key];
    }
  });

  const updatedAppointment = await appointment.save();
  res.json(updatedAppointment);
});

// @desc    Delete appointment record
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointmentRecord = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  // Check if appointment belongs to user
  if (appointment.email !== req.user.email && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to delete this appointment");
  }

  // Only allow deletion of cancelled appointments
  if (appointment.status !== "cancelled") {
    res.status(400);
    throw new Error("Only cancelled appointments can be deleted");
  }

  await appointment.deleteOne();
  res.json({ message: "Appointment deleted" });
});
