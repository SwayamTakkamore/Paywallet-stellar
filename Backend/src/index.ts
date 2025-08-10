/**
 * PayWallet Backend Server
 * Main entry point for the Express.js application
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { database, getDatabaseConfig } from './utils/database';
import { logger } from './utils/logger';
import { PayrollController } from './controllers/PayrollController';
import { AuthController } from './controllers/AuthController';
import { authMiddleware, optionalAuthMiddleware } from './utils/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging middleware
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize controllers
const payrollController = new PayrollController();
const authController = new AuthController();

// Health check endpoint
app.get('/health', (req, res) => {
  const dbInfo = database.getConnectionInfo();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    database: {
      connected: dbInfo.isConnected,
      readyState: dbInfo.readyState
    }
  });
});

// API Routes

// Authentication routes (public)
app.post('/api/auth/signup', authController.signup.bind(authController));
app.post('/api/auth/login', authController.login.bind(authController));
app.post('/api/auth/logout', authController.logout.bind(authController));

// User routes (protected)
app.get('/api/user/profile', authMiddleware, authController.getProfile.bind(authController));
app.put('/api/user/profile', authMiddleware, authController.updateProfile.bind(authController));

// Stats routes (protected)
app.get('/api/user/stats/employer', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      totalBalance: 125000,
      totalEmployees: 12,
      monthlyPayroll: 85000,
      pendingPayments: 3
    }
  });
});

app.get('/api/user/stats/worker', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      availableBalance: 4500,
      monthlyEarnings: 5000,
      totalEarnings: 60000,
      pendingWithdrawals: 1
    }
  });
});

// Payroll routes (protected)
app.get('/api/payrolls', authMiddleware, payrollController.getPayrolls);
app.post('/api/payrolls', authMiddleware, payrollController.createPayroll);
app.get('/api/payrolls/:id', authMiddleware, payrollController.getPayroll);
app.post('/api/payrolls/:id/fund', authMiddleware, payrollController.fundPayroll);
app.post('/api/payrolls/:id/release', authMiddleware, payrollController.releasePayroll);
app.get('/api/payrolls/:id/recipients', authMiddleware, payrollController.getPayrollRecipients);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    const dbConfig = getDatabaseConfig();
    await database.connect(dbConfig);
    
    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 PayWallet Backend Server started on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        database: 'MongoDB'
      });
      logger.info(`📍 API available at: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV === 'development') {
        logger.info('🔧 Development mode enabled');
      }
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await database.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
