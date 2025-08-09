# Environment Setup Guide

This guide explains how to set up environment variables for the PayWallet application.

## 📁 Environment Files Structure

```
PayWallet-stellar/
├── .env                    # Root-level variables (optional)
├── .gitignore             # Ignores all .env* files
├── backend/
│   ├── .env               # Backend environment variables
│   ├── .env.example       # Backend example template
│   └── .gitignore         # Backend-specific gitignore
└── frontend/
    ├── .env.local         # Frontend environment variables
    ├── .env.example       # Frontend example template
    └── .gitignore         # Frontend-specific gitignore (already configured)
```

## 🔧 Setup Instructions

### 1. Backend Environment Setup

```bash
cd backend/
cp .env.example .env
```

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `STELLAR_MASTER_KEY` - Stellar master account secret key (testnet)
- `STELLAR_MASTER_PUBLIC` - Stellar master account public key (testnet)
- `SOROBAN_RPC_URL` - Soroban RPC endpoint for testnet
- `ENCRYPTION_KEY` - 32-character encryption key for sensitive data
- `CRYPTO_SECRET` - Secret for wallet key encryption

**Example .env values:**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/paywallet_dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STELLAR_MASTER_KEY=SCDMOXMHPQDCIBBAN76VHAP2GHJK74BJJTRQGJ23UJKGVNQRWHFGCRJX
STELLAR_MASTER_PUBLIC=GDMOXMHPQDCIBBAN76VHAP2GHJK74BJJTRQGJ23UJKGVNQRWHFGCRJX
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
ENCRYPTION_KEY=paywallet-dev-32char-key-2024!!
```

### 2. Frontend Environment Setup

```bash
cd frontend/
cp .env.example .env.local
```

**Required Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_STELLAR_HORIZON_URL` - Stellar Horizon API endpoint
- `NEXT_PUBLIC_SOROBAN_RPC_URL` - Soroban RPC endpoint

**Example .env.local values:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

## 🌍 Environment-Specific Configuration

### Development
- Uses testnet for Stellar/Soroban
- Local PostgreSQL database
- Debug logging enabled
- CORS allows localhost

### Production
- Mainnet for Stellar/Soroban (when ready)
- Managed database service
- Error logging only
- Restricted CORS origins
- SSL/TLS encryption required

## 🔐 Security Best Practices

### ❌ Never Commit
- `.env` files with real secrets
- Private keys or passwords
- API keys or tokens
- Database credentials

### ✅ Always Do
- Use `.env.example` as templates
- Rotate secrets regularly
- Use strong, unique passwords
- Encrypt sensitive data at rest

## 🚀 Stellar Testnet Setup

### 1. Create Testnet Accounts

```bash
# Install Stellar CLI
npm install -g @stellar/cli

# Create testnet account
stellar account generate --network testnet

# Fund account with testnet lumens
stellar account fund <PUBLIC_KEY> --network testnet
```

### 2. USDC Testnet Asset

```bash
# USDC Testnet Issuer
USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
```

## 🔧 Configuration Files

The application uses configuration files that load environment variables:

- **Backend**: `src/utils/config.ts` - Validates and exports all config
- **Frontend**: `src/lib/config.ts` - Type-safe client configuration

### Backend Config Usage
```typescript
import { config, validateEnvironment } from '@/utils/config';

// Validate on startup
validateEnvironment();

// Use configuration
const db = new Database(config.database.url);
const stellar = new StellarService(config.stellar);
```

### Frontend Config Usage
```typescript
import { config, validateClientEnvironment } from '@/lib/config';

// Validate in development
if (config.features.debugMode) {
  validateClientEnvironment();
}

// Use configuration
const apiClient = new ApiClient(config.api.baseUrl);
```

## 🛠️ Development Tools

### Environment Validation

Both frontend and backend have validation functions:

```bash
# Backend - validates required variables
npm run validate:env

# Frontend - warns about missing variables
npm run dev # Shows warnings in console
```

### Hot Reload

Both environments support hot reload:
- Backend: Changes to `.env` require server restart
- Frontend: Changes to `.env.local` require page refresh

## 📝 Environment Variables Reference

### Backend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | JWT signing secret |
| `STELLAR_MASTER_KEY` | ✅ | Stellar account secret key |
| `SOROBAN_RPC_URL` | ✅ | Soroban RPC endpoint |
| `ENCRYPTION_KEY` | ✅ | Data encryption key |
| `PORT` | ❌ | Server port (default: 3001) |
| `REDIS_URL` | ❌ | Redis connection string |
| `SMTP_HOST` | ❌ | Email server host |

### Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API endpoint |
| `NEXT_PUBLIC_STELLAR_HORIZON_URL` | ✅ | Stellar Horizon API |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | ✅ | Soroban RPC endpoint |
| `NEXT_PUBLIC_APP_NAME` | ❌ | Application name |
| `NEXT_PUBLIC_DEBUG_MODE` | ❌ | Enable debug logging |

## 🚨 Troubleshooting

### Common Issues

1. **"Environment variable X is required"**
   - Check if the variable is set in your `.env` file
   - Ensure no spaces around the `=` sign
   - Restart the application after changes

2. **"API connection failed"**
   - Verify `NEXT_PUBLIC_API_URL` matches backend port
   - Check if backend server is running
   - Ensure CORS is configured correctly

3. **"Stellar network error"**
   - Verify testnet URLs are correct
   - Check if Stellar testnet is operational
   - Ensure accounts have sufficient XLM balance

### Debug Commands

```bash
# Check loaded environment variables
node -e "require('dotenv').config(); console.log(process.env)"

# Test API connection
curl $NEXT_PUBLIC_API_URL/health

# Check Stellar account
stellar account get <PUBLIC_KEY> --network testnet
```

## 📞 Support

If you encounter issues with environment setup:

1. Check this documentation
2. Verify all required variables are set
3. Test with provided example values
4. Check application logs for specific error messages

Remember: Keep your secrets secure and never commit real environment files to version control! 🔒
