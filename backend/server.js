// Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import appointmentRoutes from "./routes/appointments.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeData } from "./middleware/sanitize.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log("\n=== New Request ===");
  console.log({
    method: req.method,
    path: req.path,
    headers: {
      auth: req.headers.authorization ? "Bearer ..." : "none",
      contentType: req.headers["content-type"],
    },
    body: req.body,
  });
  next();
});

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://dentalis.vercel.app",
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Additional headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use(
  "/api/appointments",
  (req, res, next) => {
    console.log("Processing appointment request:", {
      method: req.method,
      path: req.path,
    });
    next();
  },
  appointmentRoutes
);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
