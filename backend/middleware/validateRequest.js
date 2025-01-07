import { body, param } from "express-validator";

// Validation chains
export const appointmentValidation = {
  create: [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("phone")
      .matches(/^\+?[\d\s-]{10,}$/)
      .withMessage("Please enter a valid phone number"),
    body("serviceId").notEmpty().withMessage("Service is required"),
    body("dateTime")
      .isISO8601()
      .withMessage("Please enter a valid date and time"),
  ],
  get: [], // Empty array for GET requests - no validation needed
  cancel: [param("id").isMongoId().withMessage("Invalid appointment ID")],
};

// Skip validation for specific routes/methods
export const skipValidation = (req, res, next) => {
  if (req.method === "GET") {
    return next();
  }
  next();
};
