import express from 'express';
import {
  createAppointment,
  getAvailableTimeSlots,
  cancelAppointment,
  getUserAppointments,
  getSpecialistsByService
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/available', (req, res, next) => {
  console.log('Received request for available slots:', {
    date: req.query.date,
    serviceId: req.query.serviceId
  });
  next();
}, getAvailableTimeSlots);
router.patch('/:id/cancel', cancelAppointment);
router.get('/user', getUserAppointments);
router.get('/specialists/:serviceId', getSpecialistsByService);
router.get('/test-slots', (req, res) => {
  const testSlots = [
    {
      time: new Date().toISOString(),
      specialist: { name: 'Test Doctor' },
      cabinet: { name: 'Test Room' }
    }
  ];
  
  res.json({
    success: true,
    data: testSlots
  });
});
router.get('/test-slots/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const date = new Date();
    
    console.log('Testing slot generation for:', {
      serviceId,
      date: date.toISOString()
    });

    const slots = await getSlots(date, serviceId);
    
    res.json({
      success: true,
      data: {
        totalSlots: slots.length,
        slots: slots,
        testParams: {
          serviceId,
          date: date.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Test slot generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});
router.get('/debug-service/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const service = SERVICES.find(s => s.id === serviceId);
  
  res.json({
    serviceFound: !!service,
    service,
    allServices: SERVICES.map(s => ({
      id: s.id,
      name: s.name,
      specialistId: s.specialistId,
      cabinetNumber: s.cabinetNumber
    }))
  });
});
router.get('/debug-slots', async (req, res) => {
  try {
    const date = new Date();
    const service = SERVICES[0]; // Use first service for testing
    
    const slots = await getSlots(date, service.id);
    
    res.json({
      success: true,
      debug: {
        date: date.toISOString(),
        service: service,
        totalSlots: slots.length,
        firstSlot: slots[0],
        lastSlot: slots[slots.length - 1]
      },
      slots: slots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});
router.get('/test-service-slots/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const date = new Date();
    
    console.log('Testing slots for service:', serviceId);
    const slots = await getSlots(date, serviceId);
    
    res.json({
      success: true,
      serviceId,
      date: date.toISOString(),
      slotsCount: slots.length,
      slots: slots
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 