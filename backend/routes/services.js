import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getService);

// Admin routes
// router.use(protect, adminAuth);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router; 