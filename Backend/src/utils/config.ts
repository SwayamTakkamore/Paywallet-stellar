/**
 * Environment Configuration
 * Loads and validates environment variables for the backend
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validation helper
function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

// Database Configuration
export const database = {
  url: requireEnv('DATABASE_URL'),
  host: requireEnv('DATABASE_HOST', 'localhost'),
  port: parseInt(requireEnv('DATABASE_PORT', '5432')),
  name: requireEnv('DATABASE_NAME'),
  user: requireEnv('DATABASE_USER'),
  password: requireEnv('DATABASE_PASSWORD'),
};

// Server Configuration
export const server = {
  port: parseInt(requireEnv('PORT', '3001')),
  nodeEnv: requireEnv('NODE_ENV', 'development'),
  apiBaseUrl: requireEnv('API_BASE_URL'),
  corsOrigin: requireEnv('CORS_ORIGIN', 'http://localhost:3000'),
};

// JWT Configuration
export const jwt = {
  secret: requireEnv('JWT_SECRET'),
  expiresIn: requireEnv('JWT_EXPIRES_IN', '7d'),
  refreshSecret: requireEnv('REFRESH_TOKEN_SECRET'),
  refreshExpiresIn: requireEnv('REFRESH_TOKEN_EXPIRES_IN', '30d'),
};

// Stellar Configuration
export const stellar = {
  network: requireEnv('STELLAR_NETWORK', 'testnet'),
  horizonUrl: requireEnv('STELLAR_HORIZON_URL'),
  masterKey: requireEnv('STELLAR_MASTER_KEY'),
  masterPublic: requireEnv('STELLAR_MASTER_PUBLIC'),
  usdcAssetCode: requireEnv('USDC_ASSET_CODE', 'USDC'),
  usdcIssuer: requireEnv('USDC_ISSUER_ADDRESS'),
};

// Soroban Configuration
export const soroban = {
  rpcUrl: requireEnv('SOROBAN_RPC_URL'),
  networkPassphrase: requireEnv('SOROBAN_NETWORK_PASSPHRASE'),
  contractAddress: process.env.SOROBAN_CONTRACT_ADDRESS || '',
};

// Redis Configuration
export const redis = {
  url: requireEnv('REDIS_URL', 'redis://localhost:6379'),
  host: requireEnv('REDIS_HOST', 'localhost'),
  port: parseInt(requireEnv('REDIS_PORT', '6379')),
  password: process.env.REDIS_PASSWORD || '',
};

// Payment Gateway Configuration
export const paymentGateways = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    secretKey: process.env.RAZORPAY_SECRET_KEY || '',
  },
  square: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
    applicationId: process.env.SQUARE_APPLICATION_ID || '',
  },
};

// Communication Services
export const communications = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },
};

// Push Notifications
export const notifications = {
  firebase: {
    serverKey: process.env.FIREBASE_SERVER_KEY || '',
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
  },
};

// KYC/Identity Services
export const kycServices = {
  jumio: {
    apiToken: process.env.JUMIO_API_TOKEN || '',
    secret: process.env.JUMIO_SECRET || '',
  },
  onfido: {
    apiToken: process.env.ONFIDO_API_TOKEN || '',
  },
  persona: {
    apiKey: process.env.PERSONA_API_KEY || '',
  },
  sumsub: {
    appToken: process.env.SUMSUB_APP_TOKEN || '',
    secretKey: process.env.SUMSUB_SECRET_KEY || '',
  },
};

// Analytics & Monitoring
export const analytics = {
  mixpanel: {
    secret: process.env.MIXPANEL_SECRET || '',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
  datadog: {
    apiKey: process.env.DATADOG_API_KEY || '',
  },
};

// Email Configuration
export const email = {
  smtpHost: requireEnv('SMTP_HOST'),
  smtpPort: parseInt(requireEnv('SMTP_PORT', '587')),
  smtpUser: requireEnv('SMTP_USER'),
  smtpPassword: requireEnv('SMTP_PASSWORD'),
  fromEmail: requireEnv('FROM_EMAIL'),
  fromName: requireEnv('FROM_NAME'),
};

// Storage Configuration
export const storage = {
  type: requireEnv('STORAGE_TYPE', 'local'),
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsBucketName: process.env.AWS_BUCKET_NAME || '',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
};

// Security Configuration
export const security = {
  encryptionKey: requireEnv('ENCRYPTION_KEY'),
  cryptoSecret: requireEnv('CRYPTO_SECRET'),
  bcryptRounds: parseInt(requireEnv('BCRYPT_ROUNDS', '12')),
  sessionSecret: requireEnv('SESSION_SECRET'),
  webhookSecret: requireEnv('WEBHOOK_SECRET'),
};

// Rate Limiting
export const rateLimit = {
  windowMs: parseInt(requireEnv('RATE_LIMIT_WINDOW_MS', '900000')),
  maxRequests: parseInt(requireEnv('RATE_LIMIT_MAX_REQUESTS', '100')),
};

// External APIs
export const externalApis = {
  coingeckoApiKey: process.env.COINGECKO_API_KEY || '',
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY || '',
};

// Development/Testing
export const development = {
  skipEmailVerification: process.env.SKIP_EMAIL_VERIFICATION === 'true',
  enableApiDocs: process.env.ENABLE_API_DOCS === 'true',
  enableMetrics: process.env.ENABLE_METRICS === 'true',
  logLevel: requireEnv('LOG_LEVEL', 'info'),
  logFilePath: process.env.LOG_FILE_PATH || './logs/paywallet.log',
};

// Environment validation
export function validateEnvironment() {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'STELLAR_MASTER_KEY',
    'SOROBAN_RPC_URL',
    'ENCRYPTION_KEY',
    'CRYPTO_SECRET',
  ];

  const missingVars = requiredVars.filter(key => !process.env[key]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  console.log('✅ Environment configuration validated successfully');
}

// Export all configurations
export const config = {
  database,
  server,
  jwt,
  stellar,
  soroban,
  redis,
  email,
  storage,
  security,
  rateLimit,
  externalApis,
  development,
  payments: paymentGateways,
  communications,
  notifications,
  kyc: kycServices,
  analytics,
};
