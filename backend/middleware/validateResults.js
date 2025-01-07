import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  // Skip validation for GET requests
  if (req.method === "GET") {
    return next();
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};
