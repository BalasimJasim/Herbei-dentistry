import { getMockAvailableSlots, createMockAppointment } from './mockClinicCardService.js';

export const getClinicCardAvailableSlots = async (date) => {
  try {
    // Use mock service instead of real API
    const availableSlots = await getMockAvailableSlots(date);
    return availableSlots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw new Error('Failed to fetch available slots');
  }
};

export const createClinicCardAppointment = async (appointmentData) => {
  try {
    // Use mock service instead of real API
    const appointment = await createMockAppointment(appointmentData);
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment');
  }
}; 