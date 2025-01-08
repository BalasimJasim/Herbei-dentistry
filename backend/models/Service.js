import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cabinetNumber: {
      type: Number,
      required: [true, "Cabinet number is required"],
      min: [1, "Cabinet number must be at least 1"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service; 