import mongoose from 'mongoose';
import { SPECIALIZATIONS } from "../config/servicesConfig.js";

const specialistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    enum: Object.values(SPECIALIZATIONS),
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String }
  }
});

export default mongoose.model('Specialist', specialistSchema); 