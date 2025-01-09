import express from "express";
import { protect } from "../middleware/auth.js";
import { sanitizeData } from "../middleware/sanitize.js";
import validations from "../middleware/validateRequest.js";
import {
  getUserAppointments,
  createAppointment,
  cancelAppointment,
  getAvailableTimeSlots,
  updateAppointment,
  deleteAppointmentRecord,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log("=== Appointments Route ===");
  console.log({
    method: req.method,
    path: req.path,
    auth: req.headers.authorization ? "Bearer ..." : "none",
    body: req.body,
    query: req.query,
    user: req.user,
    params: req.params,
  });
  next();
});

// Public routes
router.get("/available", getAvailableTimeSlots);
router.post(
  "/",
  validations.appointmentValidation.create,
  sanitizeData,
  createAppointment
);

// Protected routes
router.get(
  "/user",
  protect,
  (req, res, next) => {
    // Ensure email is present in query
    if (!req.query.email && req.user?.email) {
      req.query.email = req.user.email;
    }
    next();
  },
  getUserAppointments
);

router.put(
  "/:id/cancel",
  protect,
  validations.appointmentValidation.cancel,
  sanitizeData,
  cancelAppointment
);

router.put(
  "/:id",
  protect,
  validations.appointmentValidation.update,
  sanitizeData,
  updateAppointment
);

router.delete(
  "/:id",
  protect,
  validations.appointmentValidation.delete,
  sanitizeData,
  deleteAppointmentRecord
);

export default router;
