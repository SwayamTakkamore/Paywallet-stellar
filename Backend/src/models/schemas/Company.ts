import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  companyName: string;
  companyType?: string;
  taxId?: string;
  address?: string;
  country?: string; // ISO country code
  industry?: string;
  website?: string;
  stellarAccount?: string; // Company's Stellar account
  escrowAccount?: string; // Default escrow account for payrolls
  settings: Record<string, any>; // Company-specific settings
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  companyType: {
    type: String,
    maxlength: 50,
    trim: true
  },
  taxId: {
    type: String,
    maxlength: 50,
    trim: true,
    sparse: true,
    index: true
  },
  address: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    maxlength: 2,
    uppercase: true
  },
  industry: {
    type: String,
    maxlength: 100,
    trim: true
  },
  website: {
    type: String,
    maxlength: 255,
    trim: true
  },
  stellarAccount: {
    type: String,
    maxlength: 56,
    sparse: true
  },
  escrowAccount: {
    type: String,
    maxlength: 56,
    sparse: true
  },
  settings: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date
}, {
  timestamps: true,
  collection: 'companies'
});

// Indexes for performance
companySchema.index({ ownerId: 1 });
companySchema.index({ companyName: 'text' });
companySchema.index({ stellarAccount: 1 }, { sparse: true });
companySchema.index({ isVerified: 1 });
companySchema.index({ createdAt: -1 });

export const Company = mongoose.model<ICompany>('Company', companySchema);
