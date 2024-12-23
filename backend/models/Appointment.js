import mongoose from 'mongoose';
import { SPECIALIZATIONS } from '../config/services.js';

const appointmentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed"],
      default: "scheduled",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Appointment', appointmentSchema); 