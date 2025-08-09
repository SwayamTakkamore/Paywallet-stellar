/**
 * MongoDB Schemas using Mongoose
 * PayWallet Data Models
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// Base interface for all documents
interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
export interface IUser extends BaseDocument {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'employer' | 'worker';
  kycStatus: 'pending' | 'verified' | 'rejected';
  stellarPublicKey?: string;
  stellarSecretKey?: string; // Encrypted
  phoneNumber?: string;
  country?: string;
  companyId?: Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'worker'], required: true },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  stellarPublicKey: { type: String },
  stellarSecretKey: { type: String }, // Will be encrypted
  phoneNumber: { type: String },
  country: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, {
  timestamps: true,
  collection: 'users'
});

// Company Schema
export interface ICompany extends BaseDocument {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  country: string;
  stellarPublicKey?: string;
  stellarSecretKey?: string; // Encrypted
  ownerId: Types.ObjectId;
  employees: Types.ObjectId[];
  isActive: boolean;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  industry: { type: String },
  size: { type: String },
  country: { type: String, required: true },
  stellarPublicKey: { type: String },
  stellarSecretKey: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'companies'
});

// Payroll Schema
export interface IPayroll extends BaseDocument {
  companyId: Types.ObjectId;
  employerId: Types.ObjectId;
  title: string;
  description?: string;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'failed';
  scheduledDate: Date;
  employees: {
    userId: Types.ObjectId;
    amount: number;
    status: 'pending' | 'sent' | 'completed' | 'failed';
    stellarTxHash?: string;
    paidAt?: Date;
  }[];
  stellarContractId?: string;
  stellarTxHash?: string;
  processedAt?: Date;
}

const PayrollSchema = new Schema<IPayroll>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USDC' },
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'processing', 'completed', 'failed'], 
    default: 'draft' 
  },
  scheduledDate: { type: Date, required: true },
  employees: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'sent', 'completed', 'failed'], 
      default: 'pending' 
    },
    stellarTxHash: { type: String },
    paidAt: { type: Date }
  }],
  stellarContractId: { type: String },
  stellarTxHash: { type: String },
  processedAt: { type: Date }
}, {
  timestamps: true,
  collection: 'payrolls'
});

// Transaction Schema
export interface ITransaction extends BaseDocument {
  payrollId?: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'payroll' | 'bonus' | 'refund' | 'withdrawal';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stellarTxHash?: string;
  stellarContractId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

const TransactionSchema = new Schema<ITransaction>({
  payrollId: { type: Schema.Types.ObjectId, ref: 'Payroll' },
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USDC' },
  type: { 
    type: String, 
    enum: ['payroll', 'bonus', 'refund', 'withdrawal'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  stellarTxHash: { type: String },
  stellarContractId: { type: String },
  description: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true,
  collection: 'transactions'
});

// Wallet Schema
export interface IWallet extends BaseDocument {
  userId: Types.ObjectId;
  stellarPublicKey: string;
  stellarSecretKey: string; // Encrypted
  balance: {
    currency: string;
    amount: number;
    lastUpdated: Date;
  }[];
  isActive: boolean;
}

const WalletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stellarPublicKey: { type: String, required: true, unique: true },
  stellarSecretKey: { type: String, required: true },
  balance: [{
    currency: { type: String, required: true },
    amount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'wallets'
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ companyId: 1, role: 1 });
CompanySchema.index({ ownerId: 1 });
PayrollSchema.index({ companyId: 1, status: 1 });
PayrollSchema.index({ scheduledDate: 1, status: 1 });
TransactionSchema.index({ fromUserId: 1, toUserId: 1 });
TransactionSchema.index({ stellarTxHash: 1 });
WalletSchema.index({ stellarPublicKey: 1 });

// Export models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Company = mongoose.model<ICompany>('Company', CompanySchema);
export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);
export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);

// Export all models as default
export default {
  User,
  Company,
  Payroll,
  Transaction,
  Wallet
};
