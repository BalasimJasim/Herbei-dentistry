import express from "express";
import { register, login } from "../controllers/authController.js";
import validations from "../middleware/validateRequest.js";
import { handleValidationErrors } from "../middleware/validateResults.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  validations.registerValidation,
  handleValidationErrors,
  register
);

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
router.post(
  "/login",
  validations.loginValidation,
  handleValidationErrors,
  login
);

export default router;
