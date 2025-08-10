/**
 * Frontend Environment Configuration
 * Type-safe access to environment variables
 */

// Validation helper for client-side environment variables
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  return value || '';
}

// API Configuration
export const apiConfig = {
  baseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3001/api'),
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001'),
  timeout: 10000, // 10 seconds
};

// Stellar Configuration
export const stellarConfig = {
  network: getEnvVar('NEXT_PUBLIC_STELLAR_NETWORK', 'testnet'),
  horizonUrl: getEnvVar('NEXT_PUBLIC_STELLAR_HORIZON_URL', 'https://horizon-testnet.stellar.org'),
  sorobanRpcUrl: getEnvVar('NEXT_PUBLIC_SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'),
  networkPassphrase: getEnvVar('NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE', 'Test SDF Network ; September 2015'),
};

// Contract Configuration
export const contractConfig = {
  payrollContractId: getEnvVar('NEXT_PUBLIC_PAYROLL_CONTRACT_ID'),
  usdcContractId: getEnvVar('NEXT_PUBLIC_USDC_CONTRACT_ID'),
};

// Asset Configuration
export const assetConfig = {
  usdc: {
    code: getEnvVar('NEXT_PUBLIC_USDC_ASSET_CODE', 'USDC'),
    issuer: getEnvVar('NEXT_PUBLIC_USDC_ISSUER', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'),
  },
};

// App Configuration
export const appConfig = {
  name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'PayWallet'),
  version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
  url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  deploymentEnv: getEnvVar('NEXT_PUBLIC_DEPLOYMENT_ENV', 'development'),
};

// Feature Flags
export const features = {
  enableStreaming: getEnvVar('NEXT_PUBLIC_ENABLE_STREAMING', 'true') === 'true',
  enableMultiCurrency: getEnvVar('NEXT_PUBLIC_ENABLE_MULTI_CURRENCY', 'true') === 'true',
  enableKYC: getEnvVar('NEXT_PUBLIC_ENABLE_KYC', 'true') === 'true',
  enableAnalytics: getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', 'true') === 'true',
  debugMode: getEnvVar('NEXT_PUBLIC_DEBUG_MODE', 'false') === 'true',
  enableMockData: getEnvVar('NEXT_PUBLIC_ENABLE_MOCK_DATA', 'false') === 'true',
};

// Payment Gateway Configuration
export const paymentGateways = {
  stripe: {
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  },
  paypal: {
    clientId: getEnvVar('NEXT_PUBLIC_PAYPAL_CLIENT_ID'),
  },
  razorpay: {
    keyId: getEnvVar('NEXT_PUBLIC_RAZORPAY_KEY_ID'),
  },
  square: {
    applicationId: getEnvVar('NEXT_PUBLIC_SQUARE_APPLICATION_ID'),
  },
};

// External Services
export const externalServices = {
  googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID'),
  sentryDsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
  mixpanelToken: getEnvVar('NEXT_PUBLIC_MIXPANEL_TOKEN'),
  hotjarId: getEnvVar('NEXT_PUBLIC_HOTJAR_ID'),
  walletConnectProjectId: getEnvVar('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'),
  
  // Social Login
  social: {
    googleClientId: getEnvVar('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
    githubClientId: getEnvVar('NEXT_PUBLIC_GITHUB_CLIENT_ID'),
    linkedinClientId: getEnvVar('NEXT_PUBLIC_LINKEDIN_CLIENT_ID'),
    microsoftClientId: getEnvVar('NEXT_PUBLIC_MICROSOFT_CLIENT_ID'),
  },
  
  // Maps & Location
  maps: {
    mapboxToken: getEnvVar('NEXT_PUBLIC_MAPBOX_TOKEN'),
    googleMapsApiKey: getEnvVar('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'),
  },
  
  // File Storage
  storage: {
    cloudinaryCloudName: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  },
  
  // KYC Services
  kyc: {
    jumioApiToken: getEnvVar('JUMIO_API_TOKEN'),
    onfidoApiToken: getEnvVar('ONFIDO_API_TOKEN'),
    personaApiKey: getEnvVar('PERSONA_API_KEY'),
  },
  
  // Firebase (for push notifications)
  firebase: {
    config: getEnvVar('NEXT_PUBLIC_FIREBASE_CONFIG'),
    vapidPublicKey: getEnvVar('NEXT_PUBLIC_VAPID_PUBLIC_KEY'),
  },
};

// Development helpers
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Validation function
export function validateClientEnvironment() {
  const warnings: string[] = [];

  if (!apiConfig.baseUrl) {
    warnings.push('API URL not configured');
  }

  if (!stellarConfig.horizonUrl) {
    warnings.push('Stellar Horizon URL not configured');
  }

  if (!contractConfig.payrollContractId && !features.enableMockData) {
    warnings.push('Payroll contract ID not configured - using mock data');
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Environment configuration warnings:', warnings);
  }

  if (features.debugMode) {
    console.log('🔧 Debug mode enabled');
    console.log('Environment config:', {
      apiConfig,
      stellarConfig,
      contractConfig,
      features,
    });
  }
}

// Export combined config
export const config = {
  api: apiConfig,
  stellar: stellarConfig,
  contracts: contractConfig,
  assets: assetConfig,
  app: appConfig,
  features,
  payments: paymentGateways,
  external: externalServices,
};
