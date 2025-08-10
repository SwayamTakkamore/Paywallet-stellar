# MongoDB Migration Guide

This document outlines the migration from PostgreSQL to MongoDB for the PayWallet Stellar backend.

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ 
- MongoDB 6.0+ (local installation or MongoDB Atlas)
- npm or yarn package manager

### 2. Environment Setup

Create a `.env` file in the Backend directory:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/paywallet-stellar
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/paywallet-stellar

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Stellar
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Optional: Logging
LOG_LEVEL=info
```

### 3. Installation and Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

## 📊 Database Schema

### Collections Overview

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | User authentication and profiles | email, role, stellarPublicKey, kycStatus |
| `companies` | Employer company information | companyName, ownerId, stellarAccount |
| `employees` | Employee records per company | companyId, userId, salary, position |
| `payrolls` | Payroll batches and transactions | companyId, totalAmount, status, recipients |

### Schema Migration Details

#### From PostgreSQL Tables to MongoDB Collections:

1. **users table** → **users collection**
   - Added: `_id` (ObjectId), `createdAt`, `updatedAt`
   - Changed: `password_hash` → `passwordHash`
   - Indexed: `email`, `stellarPublicKey`

2. **companies table** → **companies collection**
   - Added: `_id` (ObjectId), `createdAt`, `updatedAt`
   - Changed: `owner_id` → `ownerId` (ObjectId reference)
   - Embedded: `settings` object for company preferences

3. **employees table** → **employees collection**
   - Added: `_id` (ObjectId), `createdAt`, `updatedAt`
   - Changed: `company_id` → `companyId` (ObjectId reference)
   - Changed: `user_id` → `userId` (ObjectId reference)
   - Embedded: `metadata` object for additional data

4. **payrolls table** → **payrolls collection**
   - Added: `_id` (ObjectId), `createdAt`, `updatedAt`
   - Changed: All foreign keys to ObjectId references
   - Embedded: `recipients` array with employee payment details
   - Embedded: `scheduleData` object for scheduling information

## 🔧 Key Changes from PostgreSQL

### 1. Connection Management
- **Before**: PostgreSQL with Knex.js query builder
- **After**: MongoDB with Mongoose ODM

### 2. Query Patterns
- **Before**: SQL joins with multiple tables
- **After**: MongoDB aggregation pipeline and population

### 3. Data Types
- **Before**: PostgreSQL-specific types (UUID, TIMESTAMP)
- **After**: MongoDB types (ObjectId, Date, embedded documents)

### 4. Relationships
- **Before**: Foreign key constraints
- **After**: Referenced documents with Mongoose population

## 📝 API Endpoints (Unchanged)

The API endpoints remain the same, but now use MongoDB:

- `POST /api/payrolls` - Create payroll
- `GET /api/payrolls` - List payrolls
- `GET /api/payrolls/:id` - Get payroll details
- `PUT /api/payrolls/:id/status` - Update payroll status

## 🛠 Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Seed database with sample data
npm run seed

# Lint code
npm run lint
npm run lint:fix
```

## 📦 Sample Data

The seed script creates:

- **2 Users**: 1 employer, 1 worker
- **1 Company**: Tech Innovations Inc.
- **3 Employees**: Various roles and departments
- **1 Payroll**: Sample monthly payroll batch

### Demo Credentials

- **Employer**: `employer@demo.com` / `password123`
- **Worker**: `worker@demo.com` / `password123`

## 🔍 MongoDB Queries Examples

### Find all payrolls for a company:
```javascript
db.payrolls.find({ companyId: ObjectId("...") })
```

### Find employees by department:
```javascript
db.employees.find({ department: "Engineering" })
```

### Aggregate payroll statistics:
```javascript
db.payrolls.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } }
])
```

## 🚨 Troubleshooting

### Connection Issues
1. Ensure MongoDB is running: `mongosh --eval "db.adminCommand('ismaster')"`
2. Check connection string in `.env` file
3. Verify network access for MongoDB Atlas

### Data Issues
1. Clear and reseed database: `npm run seed`
2. Check MongoDB logs for validation errors
3. Verify schema requirements in model files

### Build Issues
1. Clear dependencies: `rm -rf node_modules package-lock.json && npm install`
2. Check TypeScript compilation: `npm run build`
3. Verify all imports and exports

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM Guide](https://mongoosejs.com/docs/guide.html)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Migration Best Practices](https://docs.mongodb.com/manual/core/data-model-design/)

## 🔄 Migration Status

✅ **Completed:**
- MongoDB connection setup
- Schema design and models
- Seed script with sample data
- PayrollService implementation
- Database utilities and configuration

⏳ **Pending:**
- Update remaining service layers (if needed)
- Integration testing with frontend
- Production deployment configuration
