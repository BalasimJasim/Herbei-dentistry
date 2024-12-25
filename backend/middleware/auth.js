import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if no token
    if (!token) {
      throw new ApiError(401, "Not authorized to access this route");
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      throw new ApiError(401, "Not authorized to access this route");
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'User role is not authorized to access this route'));
    }
    next();
  };
};

// Sanitize data middleware
export const sanitizeData = (req, res, next) => {
  // Remove any potential XSS attacks from req.body
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '');
      }
    }
  }
  next();
}; 