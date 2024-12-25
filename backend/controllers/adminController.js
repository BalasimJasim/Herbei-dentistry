import User from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sendEmail } from "../utils/email.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate token
    const token = admin.getSignedToken();

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.firstName + " " + admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Implementation for getting dashboard statistics
    res.json({
      success: true,
      data: {
        // Add your dashboard statistics here
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, registrationKey } = req.body;

    // Verify registration key
    if (registrationKey !== process.env.ADMIN_REGISTRATION_KEY) {
      throw new ApiError(401, 'Invalid registration key');
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      throw new ApiError(400, 'Admin with this email already exists');
    }

    // Create admin user
    const admin = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'admin'
    });

    // Create token
    const token = admin.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
}; 