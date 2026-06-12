import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Prevent multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (!MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI is missing');
      throw new Error('MONGODB_URI not defined in environment variables');
    }

    // Return cached connection if exists
    if (cached.conn) {
      return cached.conn;
    }

    // Create new connection only if needed
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;