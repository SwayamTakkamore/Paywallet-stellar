import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'employer' | 'worker' | 'admin';
  stellarPublicKey?: string;
  stellarSecretKeyEncrypted?: string;
  kycStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
  kycSubmittedAt?: Date;
  kycApprovedAt?: Date;
  isActive: boolean;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    required: true,
    enum: ['employer', 'worker', 'admin'],
    default: 'worker'
  },
  stellarPublicKey: {
    type: String,
    maxlength: 56,
    sparse: true
  },
  stellarSecretKeyEncrypted: {
    type: String,
    select: false // Don't return by default for security
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    default: 'pending'
  },
  kycSubmittedAt: Date,
  kycApprovedAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: Date,
  lastLoginAt: Date
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'users'
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ stellarPublicKey: 1 }, { sparse: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
