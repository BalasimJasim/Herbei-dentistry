import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { ApiError } from "./errorHandler.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log("=== Auth Middleware Start ===");
    console.log("Headers:", req.headers);
    console.log("Original Query:", req.query);

    if (!req.headers.authorization?.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token.substring(0, 20) + "...");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Validate token payload
      if (!decoded.userId || !decoded.email) {
        console.error("Invalid token payload:", decoded);
        return res.status(401).json({
          success: false,
          message: "Invalid token format - missing required fields",
        });
      }

      // Set user data directly from token
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || "user",
      };

      // Add token data to query if not already present
      if (!req.query.email) {
        req.query.email = decoded.email;
      }
      if (!req.query.userId) {
        req.query.userId = decoded.userId;
      }

      console.log("Final request state:", {
        user: req.user,
        query: req.query,
      });

      next();
    } catch (err) {
      console.error("Token verification failed:", {
        error: err.message,
        name: err.name,
        stack: err.stack,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: err.message,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "User role is not authorized to access this route")
      );
    }
    next();
  };
}; 