@echo off
cd /d "D:\Stellar\hahahaah\Paywallet-stellar\Backend"
set MONGODB_URI=mongodb+srv://yashdharme:yash@cluster0.blgov.mongodb.net/paywallet
set PORT=3001
set NODE_ENV=development
set JWT_SECRET=your-super-secret-jwt-key-change-in-production
set JWT_EXPIRES_IN=7d
set STELLAR_NETWORK=testnet
set STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
set LOG_LEVEL=info
node dist/index.js
