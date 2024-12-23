import { sendAppointmentNotifications, scheduleReminders } from '../services/notificationService.js'
import Appointment from '../models/Appointment.js'
import { ApiError } from '../middleware/errorHandler.js'
import { 
  checkTimeSlotAvailability, 
  getSlots,
  findAvailableCabinet 
} from '../services/appointmentService.js';
import { SERVICES } from '../config/servicesConfig.js';
import Specialist from '../models/Specialist.js';

const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Check if it's a valid length (10-15 digits)
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return false
  }
  
  return true
}

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body

    // Ensure dateTime is a valid date
    const appointmentDate = new Date(appointmentData.dateTime)
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment date'
      })
    }

    // Create the appointment
    const appointment = await Appointment.create({
      ...appointmentData,
      dateTime: appointmentDate
    })

    // Send confirmation notifications
    try {
      // Send email confirmation
      await sendAppointmentNotifications.sendEmail({
        to: appointmentData.email,
        subject: 'Appointment Confirmation',
        template: 'appointment-confirmation',
        data: {
          firstName: appointmentData.firstName,
          lastName: appointmentData.lastName,
          date: appointmentDate.toLocaleDateString(),
          time: appointmentDate.toLocaleTimeString(),
          service: appointmentData.serviceId // You might want to fetch service details here
        }
      })

      // Send SMS confirmation
      await sendAppointmentNotifications.sendSMS({
        to: appointmentData.phone,
        template: 'appointment-confirmation',
        data: {
          firstName: appointmentData.firstName,
          date: appointmentDate.toLocaleDateString(),
          time: appointmentDate.toLocaleTimeString()
        }
      })

      // Schedule reminders (e.g., 24 hours before appointment)
      await scheduleReminders(appointment)

      console.log('Notifications sent successfully')
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError)
      // Don't fail the appointment creation if notifications fail
    }

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully. Confirmation sent to your email and phone.'
    })
  } catch (error) {
    console.error('Appointment creation error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get available time slots
// @route   GET /api/appointments/available
// @access  Public
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, serviceId } = req.query
    
    console.log('Received request for slots:', { date, serviceId })

    if (!date || !serviceId) {
      return res.status(400).json({ 
        success: false,
        message: 'Both date and serviceId are required' 
      })
    }

    // Parse and validate the date
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      })
    }

    // Get available slots
    const slots = await getSlots(parsedDate, serviceId)

    res.json({
      success: true,
      data: slots
    })
  } catch (error) {
    console.error('Error getting available slots:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get available time slots'
    })
  }
}

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
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
      return res.status(404).json({ message: 'Appointment not found' });
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
    const { id } = req.params;
    const { email } = req.body; // Require email for verification

    const appointment = await Appointment.findOne({ _id: id, 'patient.email': email });

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found or email does not match');
    }

    if (appointment.status === 'cancelled') {
      throw new ApiError(400, 'Appointment is already cancelled');
    }

    // Check if cancellation is within allowed time (e.g., 24 hours before)
    const appointmentTime = new Date(appointment.dateTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      throw new ApiError(400, 'Appointments must be cancelled at least 24 hours in advance');
    }

    appointment.status = 'cancelled';
    appointment.updatedAt = new Date();
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/user
// @access  Public
export const getUserAppointments = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    const appointments = await Appointment.find({ 
      'patient.email': email,
      status: { $ne: 'cancelled' }
    }).sort({ dateTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Add this endpoint to get specialists by service
export const getSpecialistsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = SERVICES.find(s => s.id === serviceId);
    
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service'
      });
    }

    const specialists = await Specialist.find({
      specialization: service.specialization,
      isActive: true
    });

    res.json({
      success: true,
      data: specialists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specialists',
      error: error.message
    });
  }
}; 