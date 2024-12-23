import { ApiError } from './errorHandler.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const adminProtect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized to access this route');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized as admin');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized to access this route'));
  }
}; 