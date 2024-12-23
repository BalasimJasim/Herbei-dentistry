import User from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sendAppointmentConfirmation } from '../utils/email.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    // Check for user
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!admin) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Create token
    const token = admin.getSignedJwtToken();

    res.status(200).json({
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

export const getDashboardStats = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get appointments stats
    const stats = await Appointment.aggregate([
      {
        $facet: {
          'todayAppointments': [
            { $match: { 
              dateTime: { 
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
              }
            }},
            { $count: 'count' }
          ],
          'upcomingAppointments': [
            { $match: { 
              dateTime: { $gte: today },
              status: { $in: ['scheduled', 'confirmed'] }
            }},
            { $count: 'count' }
          ],
          'serviceBreakdown': [
            { $group: { 
              _id: '$service',
              count: { $sum: 1 }
            }}
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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