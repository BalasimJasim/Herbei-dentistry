import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  specialistId: {
    type: String,
    required: true
  },
  cabinetNumber: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['consultation', 'restorative', 'pediatric', 'prosthetic', 'surgery'],
    required: true
  }
});

export default mongoose.model('Service', serviceSchema); 