import mongoose from 'mongoose';

const cabinetSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    enum: ['consultation', 'restorative', 'prosthetic', 'pediatric', 'surgery'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Cabinet', cabinetSchema); 