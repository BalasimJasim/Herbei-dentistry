import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import appointmentRoutes from './routes/appointments.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeData } from './middleware/auth.js';
import { testEmailConfig } from './utils/email.js';
import { testSMSConfig } from './utils/sendSMS.js';
import adminRoutes from './routes/admin.js';
import serviceRoutes from './routes/services.js';
import { validateEnv } from "./config/validateEnv.js";
import { validateCredentials } from "./config/validateCredentials.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Test configurations without blocking server start
const initializeServices = async () => {
  try {
    const emailConfigured = await testEmailConfig();
    console.log('Email service status:', emailConfigured ? 'configured' : 'disabled');
  } catch (error) {
    console.warn('Email service initialization warning:', error.message);
  }

  try {
    const smsConfigured = await testSMSConfig();
    console.log('SMS service status:', smsConfigured ? 'configured' : 'disabled');
  } catch (error) {
    console.warn('SMS service initialization warning:', error.message);
  }
};

const checkRequiredEnvVars = () => {
  const required = [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    return false;
  }

  console.log("All required environment variables are present");
  return true;
};

const envVars = validateEnv();

const { email: emailConfigured, twilio: twilioConfigured } =
  validateCredentials();

if (!emailConfigured) {
  console.warn("Email service will be disabled - missing credentials");
}

if (!twilioConfigured) {
  console.warn("SMS service will be disabled - missing credentials");
}

const startServer = async () => {
  try {
    // Check environment variables first
    if (!checkRequiredEnvVars()) {
      throw new Error("Missing required environment variables");
    }

    // Connect to database
    const dbConnected = await connectDB();
    if (!dbConnected) {
      throw new Error("Database connection failed");
    }

    const app = express();

    // Body parser
    app.use(express.json());

    // Basic security middleware
    app.use(sanitizeData);

    // CORS configuration
    app.use(
      cors({
        origin: [
          "https://dentalis-k4x6w70g0-balasim-jasim-s-projects.vercel.app",
          "https://dentalis-two.vercel.app",
          "http://localhost:5173",
          "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Mount routers
    app.use("/api/services", serviceRoutes);
    app.use("/api/appointments", appointmentRoutes);
    app.use("/api/admin", adminRoutes);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok" });
    });

    // Error Handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      initializeServices();
    });
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  // Exit process
  process.exit(1);
}); 