import mongoose, { Document, Schema } from 'mongoose';

export interface IPayroll extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  companyId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  contractId?: string; // Soroban contract ID
  escrowAccount?: string; // Stellar escrow account
  totalAmount: number;
  fundedAmount: number;
  asset: string; // Asset code (USDC, XLM, etc.)
  assetIssuer?: string; // Asset issuer address (for non-native assets)
  status: 'created' | 'funded' | 'scheduled' | 'releasing' | 'released' | 'partial' | 'cancelled' | 'failed';
  scheduleType: 'immediate' | 'scheduled' | 'recurring' | 'streaming';
  scheduleData: Record<string, any>; // Schedule configuration
  recipients: Array<{
    employeeId: mongoose.Types.ObjectId;
    stellarAddress: string;
    amount: number;
    asset: string;
    status: 'pending' | 'paid' | 'failed';
    txHash?: string;
    paidAt?: Date;
    errorMessage?: string;
  }>;
  releaseDate?: Date; // For scheduled releases
  streamRate?: number; // Tokens per second for streaming
  streamDuration?: number; // Stream duration in seconds
  txHash?: string; // Creation transaction hash
  fundingTxHash?: string; // Funding transaction hash
  distributionTxHashes?: string[]; // Distribution transaction hashes
  errorMessage?: string; // Error message if failed
  metadata?: Record<string, any>; // Additional metadata
  releaseTxHash?: string; // Release transaction hash
  fundedAt?: Date;
  distributedAt?: Date;
  cancelledAt?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new Schema<IPayroll>({
  title: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractId: {
    type: String,
    maxlength: 100,
    sparse: true
  },
  escrowAccount: {
    type: String,
    maxlength: 56,
    sparse: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  fundedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  asset: {
    type: String,
    default: 'USDC',
    maxlength: 50,
    uppercase: true
  },
  assetIssuer: {
    type: String,
    maxlength: 56
  },
  status: {
    type: String,
    enum: ['created', 'funded', 'scheduled', 'releasing', 'released', 'partial', 'cancelled', 'failed'],
    default: 'created',
    index: true
  },
  scheduleType: {
    type: String,
    enum: ['immediate', 'scheduled', 'recurring', 'streaming'],
    required: true
  },
  scheduleData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  releaseDate: Date,
  streamRate: {
    type: Number,
    min: 0
  },
  streamDuration: {
    type: Number,
    min: 0
  },
  recipients: [{
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    stellarAddress: {
      type: String,
      required: true,
      maxlength: 56
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    asset: {
      type: String,
      default: 'USDC',
      maxlength: 50,
      uppercase: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    txHash: {
      type: String,
      maxlength: 64,
      sparse: true
    },
    paidAt: Date,
    errorMessage: String
  }],
  txHash: {
    type: String,
    maxlength: 64,
    sparse: true
  },
  fundingTxHash: {
    type: String,
    maxlength: 64,
    sparse: true
  },
  distributionTxHashes: [{
    type: String,
    maxlength: 64
  }],
  errorMessage: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  releaseTxHash: {
    type: String,
    maxlength: 64,
    sparse: true
  },
  fundedAt: Date,
  distributedAt: Date,
  cancelledAt: Date,
  releasedAt: Date
}, {
  timestamps: true,
  collection: 'payrolls'
});

// Indexes for performance
payrollSchema.index({ companyId: 1, status: 1 });
payrollSchema.index({ employerId: 1, status: 1 });
payrollSchema.index({ status: 1, releaseDate: 1 });
payrollSchema.index({ contractId: 1 }, { sparse: true });
payrollSchema.index({ createdAt: -1 });

export const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
