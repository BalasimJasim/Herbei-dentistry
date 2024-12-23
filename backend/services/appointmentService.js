import Appointment from '../models/Appointment.js';
import { SERVICES, SPECIALISTS, CABINETS } from '../config/servicesConfig.js';

// Helper function to find service by ID
const findServiceById = (serviceId) => {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) {
    throw new Error(`Service not found for ID: ${serviceId}`);
  }
  return service;
};

// Function to find available cabinet
export const findAvailableCabinet = async (serviceId, dateTime) => {
  try {
    const service = findServiceById(serviceId);
    return service.cabinetNumber;
  } catch (error) {
    console.error('Error finding available cabinet:', error);
    throw error;
  }
};

// Function to check time slot availability
export const checkTimeSlotAvailability = async (
  dateTime,
  cabinetNumber,
  duration
) => {
  try {
    // Here you would check your database for existing appointments
    // For now, we'll return true to indicate availability
    return true;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    throw error;
  }
};

// Function to get available time slots
export const getSlots = async (date, serviceId) => {
  try {
    // Find the service
    const service = findServiceById(serviceId);
    
    // Debug logs
    console.log('Finding slots for service:', service);
    console.log('Date requested:', date);

    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    const slotDuration = service.duration; // Use service duration from config
    
    const slots = [];
    let currentTime = new Date(date);
    currentTime.setHours(startHour, 0, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, 0, 0, 0);
    
    // Generate slots based on service duration
    while (currentTime < endTime) {
      // Check if the slot is available
      const isAvailable = await checkTimeSlotAvailability(
        currentTime,
        service.cabinetNumber,
        slotDuration
      );

      if (isAvailable) {
        slots.push({
          time: new Date(currentTime).toISOString(),
          available: true
        });
      }

      // Move to next slot based on service duration
      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }

    return slots;
  } catch (error) {
    console.error('Error in getSlots:', error);
    throw error;
  }
};

// Temporarily disable the availability check for testing
const checkSlotAvailability = async (service, time) => {
  try {
    // For testing, return true to show all slots
    return true;

    /* Original code - uncomment after testing
    const slotEnd = new Date(time.getTime() + service.duration * 60000);

    const overlapping = await Appointment.findOne({
      $or: [
        {
          specialistId: service.specialistId,
          status: { $in: ['scheduled', 'confirmed'] },
          $or: [
            { dateTime: { $lt: slotEnd }, endTime: { $gt: time } },
            { dateTime: { $lt: slotEnd }, endTime: { $gt: time } }
          ]
        },
        {
          cabinetNumber: service.cabinetNumber,
          status: { $in: ['scheduled', 'confirmed'] },
          $or: [
            { dateTime: { $lt: slotEnd }, endTime: { $gt: time } },
            { dateTime: { $lt: slotEnd }, endTime: { $gt: time } }
          ]
        }
      ]
    });

    return !overlapping;
    */
  } catch (error) {
    console.error('Error checking slot availability:', error);
    return false;
  }
};

// Helper function to calculate next available slot
const calculateNextAvailableSlot = (dateTime, duration) => {
  const nextSlot = new Date(dateTime);
  nextSlot.setMinutes(nextSlot.getMinutes() + duration + 30); // Add duration plus 30-minute buffer
  return nextSlot;
}; 