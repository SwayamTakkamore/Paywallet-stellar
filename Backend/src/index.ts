/**
 * PayWallet Backend Server
 * Express.js server with MongoDB integration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './database/connection';
import { config } from './utils/config';

// Load environment variables
dotenv.config();

const app = express();
const PORT = config.server.port;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));

// Logging Middleware
app.use(morgan('combined'));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PayWallet API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MongoDB',
    environment: config.server.nodeEnv
  });
});

// API Routes (will be added)
app.get('/api/test', (req, res) => {
  res.json({
    message: 'PayWallet MongoDB API is working!',
    database: 'Connected to MongoDB',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Server Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(config.server.nodeEnv === 'development' && { stack: error.stack })
  });
});

// Start Server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('🎯 MongoDB connection established');

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`
🚀 PayWallet Backend Server Started!
┌─────────────────────────────────────┐
│  Environment: ${config.server.nodeEnv.padEnd(20)} │
│  Port: ${PORT.toString().padEnd(26)} │  
│  Database: MongoDB                  │
│  API URL: http://localhost:${PORT}/api │
└─────────────────────────────────────┘
      `);
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
