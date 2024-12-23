// Mock data for available time slots
const workingHours = {
  start: 9, // 9 AM
  end: 17  // 5 PM
};

const generateTimeSlots = (date) => {
  const slots = [];
  const currentDate = new Date();
  const selectedDate = new Date(date);
  
  // Reset hours to compare just the dates
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  // If selected date is in the past, return empty array
  if (selectedDate < currentDate) {
    return slots;
  }

  // Generate slots every 30 minutes
  for (let hour = workingHours.start; hour < workingHours.end; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Randomly set some slots as unavailable
      const available = Math.random() > 0.3; // 70% chance of being available
      
      slots.push({
        time,
        available
      });
    }
  }

  return slots;
};

export const getMockAvailableSlots = async (date) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return generateTimeSlots(date);
};

// Mock appointments storage
const mockAppointments = new Map();

export const createMockAppointment = async (appointmentData) => {
  const appointmentId = `MOCK-${Date.now()}`;
  
  const mockAppointment = {
    id: appointmentId,
    ...appointmentData,
    status: 'confirmed',
    created_at: new Date().toISOString()
  };
  
  mockAppointments.set(appointmentId, mockAppointment);
  
  // Mark the time slot as unavailable
  const dateKey = new Date(appointmentData.dateTime).toISOString().split('T')[0];
  const timeStr = new Date(appointmentData.dateTime).toTimeString().slice(0, 5);
  
  if (mockTimeSlots[dateKey]) {
    const slotIndex = mockTimeSlots[dateKey].findIndex(slot => slot.time === timeStr);
    if (slotIndex !== -1) {
      mockTimeSlots[dateKey][slotIndex].available = false;
    }
  }
  
  return mockAppointment;
}; 