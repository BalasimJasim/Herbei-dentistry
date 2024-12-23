import { body, validationResult } from 'express-validator';

export const validateAppointment = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').matches(/^\+?[\d\s-]{10,}$/).withMessage('Please enter a valid phone number'),
  body('service').notEmpty().withMessage('Service is required'),
  body('dateTime').isISO8601().withMessage('Please enter a valid date and time'),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 