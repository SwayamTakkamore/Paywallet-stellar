import mongoose from 'mongoose';
import { logger } from './logger';

interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

class Database {
  private static instance: Database;
  private isConnected = false;

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(config: DatabaseConfig): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    try {
      const defaultOptions: mongoose.ConnectOptions = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };

      const options = { ...defaultOptions, ...config.options };

      await mongoose.connect(config.uri, options);
      this.isConnected = true;
      
      logger.info('Successfully connected to MongoDB', {
        database: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      });

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        this.isConnected = true;
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  isHealthy(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getConnectionInfo() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections)
    };
  }
}

export const database = Database.getInstance();

// Helper function to get database configuration from environment
export function getDatabaseConfig(): DatabaseConfig {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  return {
    uri,
    options: {
      // Add any additional options here based on environment
      ...(process.env.NODE_ENV === 'production' && {
        ssl: true,
        sslValidate: true,
      })
    }
  };
}
