import { body, validationResult } from 'express-validator';

export const validateAppointment = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").optional().isEmail().withMessage("Please enter a valid email"),
  body("phone")
    .matches(/^\+?[\d\s-]{10,}$/)
    .withMessage("Please enter a valid phone number"),
  body("serviceId").notEmpty().withMessage("Service is required"),
  body("dateTime")
    .isISO8601()
    .withMessage("Please enter a valid date and time"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]; 