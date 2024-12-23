import express from 'express';
import { loginAdmin, getDashboardStats } from '../controllers/adminController.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/login', loginAdmin);

// Protected routes (auth required)
router.get('/me', adminProtect, (req, res) => {
  res.json(req.user);
});
router.get('/dashboard/stats', adminProtect, getDashboardStats);

export default router; 