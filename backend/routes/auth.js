import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  loginValidation,
  registerValidation,
} from "../middleware/validateRequest.js";
import { handleValidationErrors } from "../middleware/validateResults.js";

const router = express.Router();

router.post("/register", registerValidation, handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors, login);

export default router;
