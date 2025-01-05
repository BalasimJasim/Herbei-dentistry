import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide both email and password" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log("User query result:", user ? "Found" : "Not found");

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found, verifying password");
    // Verify password exists
    if (!user.password) {
      console.error("User has no password set:", email);
      return res.status(500).json({ 
        message: "Account configuration error" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password verified, generating token");
    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ 
        message: "Server configuration error" 
      });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    console.log("Login successful for user:", email);
    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login error details:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
      }
    });
    res.status(500).json({ 
      message: "Server error during login",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
