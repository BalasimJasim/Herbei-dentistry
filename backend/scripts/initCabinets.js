import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cabinet from '../models/Cabinet.js';
import { CABINETS } from '../config/services.js';

dotenv.config();

const initCabinets = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cabinets
    await Cabinet.deleteMany({});
    console.log('Cleared existing cabinets');

    // Insert new cabinets
    const result = await Cabinet.insertMany(CABINETS);
    console.log('Initialized cabinets:', result);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing cabinets:', error);
    process.exit(1);
  }
};

initCabinets(); 