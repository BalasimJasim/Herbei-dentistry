import express from "express";
import { protect } from "../middleware/auth.js";
import { sanitizeData } from "../middleware/sanitize.js";
import validations from "../middleware/validateRequest.js";
import {
  getUserAppointments,
  createAppointment,
  cancelAppointment,
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

// Public routes
router.post(
  "/",
  validations.appointmentValidation.create,
  sanitizeData,
  createAppointment
);

export default router;
