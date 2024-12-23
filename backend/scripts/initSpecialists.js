import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use absolute paths
const Specialist = (await import(path.join(__dirname, '../models/Specialist.js'))).default;
const { SPECIALISTS } = (await import(path.join(__dirname, '../config/specialists.js')));

dotenv.config({ path: path.join(__dirname, '../.env') });

const initSpecialists = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing specialists
    await Specialist.deleteMany({});
    console.log('Cleared existing specialists');

    // Insert new specialists
    const result = await Specialist.insertMany(SPECIALISTS);
    console.log('Initialized specialists:', result);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing specialists:', error);
    process.exit(1);
  }
};

initSpecialists(); 