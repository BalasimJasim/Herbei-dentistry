import { body, param } from "express-validator";

const appointmentValidation = {
  create: [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("phone")
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage("Please provide a valid phone number"),
    body("dateTime")
      .isISO8601()
      .withMessage("Please provide a valid date and time"),
    body("serviceId").notEmpty().withMessage("Service is required"),
  ],
  cancel: [param("id").isMongoId().withMessage("Invalid appointment ID")],
  update: [
    param("id").isMongoId().withMessage("Invalid appointment ID"),
    body("firstName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name cannot be empty"),
    body("lastName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Last name cannot be empty"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage("Please provide a valid phone number"),
    body("dateTime")
      .optional()
      .isISO8601()
      .withMessage("Please provide a valid date and time"),
    body("notes").optional().trim(),
  ],
  delete: [param("id").isMongoId().withMessage("Invalid appointment ID")],
};

const registerValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage("Please provide a valid phone number"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export default {
  appointmentValidation,
  registerValidation,
  loginValidation,
};
