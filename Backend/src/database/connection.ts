/**
 * MongoDB Atlas Database Connection
 * Using Mongoose ODM for MongoDB Atlas integration
 */

import mongoose from 'mongoose';
import { database } from '../utils/config';

// MongoDB Atlas connection state
let isConnected = false;

/**
 * Connect to MongoDB Atlas
 */
export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('🔗 MongoDB Atlas already connected');
    return;
  }

  try {
    const mongoUri = database.uri;
    
    await mongoose.connect(mongoUri, {
      dbName: database.name,
      // MongoDB Atlas optimized options
      maxPoolSize: 10, // Connection pool size
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority'
    });

    isConnected = true;
    console.log('� MongoDB Atlas connected successfully');
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('📡 MongoDB Atlas connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Atlas connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 MongoDB Atlas disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB Atlas connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('💥 MongoDB Atlas connection failed:', error);
    console.error('🔧 Check your connection string and network access');
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log('🔌 MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnect error:', error);
  }
}

/**
 * Get connection status
 */
export function getConnectionStatus(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

// Export mongoose for direct usage
export { mongoose };
export default mongoose;
