import { body, param } from "express-validator";

const validations = {
  // Auth validation chains
  loginValidation: [
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],

  registerValidation: [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s-]{10,}$/)
      .withMessage("Please enter a valid phone number"),
  ],

  // Appointment validation chains
  appointmentValidation: {
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
  },

  // Skip validation for specific routes/methods
  skipValidation: (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    next();
  },
};

export default validations;
