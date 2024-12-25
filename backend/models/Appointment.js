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
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

appointmentSchema.pre("save", async function (next) {
  if (this.isModified("dateTime") || this.isModified("endTime")) {
    const overlapping = await this.constructor.findOne({
      _id: { $ne: this._id },
      serviceId: this.serviceId,
      status: { $ne: "cancelled" },
      $or: [
        {
          dateTime: { $lt: this.endTime },
          endTime: { $gt: this.dateTime },
        },
      ],
    });

    if (overlapping) {
      next(new Error("This time slot overlaps with another appointment"));
    }
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema); 