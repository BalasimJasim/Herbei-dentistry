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

// Debug middleware - only in development
if (process.env.NODE_ENV === "development") {
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
}

// Allowed origins based on environment
const allowedOrigins = [
  "http://localhost:5173",  // Vite dev server
  "http://localhost:4173",  // Vite preview
  "http://localhost:3000",  // Alternative local
  "https://dentalis.vercel.app",
  /\.vercel\.app$/,        // All Vercel deployments
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const isAllowed = allowedOrigins.some(allowed => 
      typeof allowed === 'string' 
        ? allowed === origin
        : allowed.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
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
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Pre-flight requests
app.options('*', cors(corsOptions));

// Security headers middleware
app.use((req, res, next) => {
  // Set security headers
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Set CORS headers based on origin
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some(allowed => 
    typeof allowed === 'string' 
      ? allowed === origin
      : allowed.test(origin)
  )) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
  }
  
  next();
});

// API Routes
const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/services", serviceRoutes);
apiRouter.use(
  "/appointments",
  (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Processing appointment request:", {
        method: req.method,
        path: req.path,
      });
    }
    next();
  },
  appointmentRoutes
);

// Mount API router
app.use("/api", apiRouter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: process.env.NODE_ENV });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API base URL: ${process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}/api` : 'https://herbei-dentistry.onrender.com/api'}`);
});

export default app;
