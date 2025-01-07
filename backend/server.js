import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import appointmentRoutes from "./routes/appointments.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeData } from "./middleware/sanitize.js";

// Load env vars
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
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dentalis-utyh02dip-balasim-jasim-s-projects.vercel.app',
    'https://dentalis.vercel.app',
    /\.vercel\.app$/  // Allow all subdomains of vercel.app
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes with middleware
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

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
