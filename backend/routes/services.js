import express from 'express';
import { getServices, getServiceById } from '../controllers/serviceController.js';
import { SERVICES } from '../config/servicesConfig.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('Received request for services');
  next();
}, getServices);
router.get('/:id', getServiceById);
router.get('/debug', (req, res) => {
  const uniqueIds = new Set();
  const duplicates = [];
  
  SERVICES.forEach(service => {
    if (uniqueIds.has(service.id)) {
      duplicates.push(service.id);
    }
    uniqueIds.add(service.id);
  });

  res.json({
    totalServices: SERVICES.length,
    uniqueServices: uniqueIds.size,
    duplicates,
    allServices: SERVICES.map(s => ({ id: s.id, name: s.name }))
  });
});

export default router; 