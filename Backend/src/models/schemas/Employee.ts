import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // If user account exists
  employeeId: string; // Company's internal employee ID
  firstName: string;
  lastName: string;
  email?: string;
  position?: string;
  department?: string;
  salary?: number;
  currency: string;
  stellarAddress: string; // Where to send payments
  hireDate?: Date;
  employmentStatus: 'active' | 'inactive' | 'terminated';
  paymentSchedule: 'weekly' | 'biweekly' | 'monthly';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  employeeId: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    maxlength: 255,
    lowercase: true,
    trim: true,
    sparse: true
  },
  position: {
    type: String,
    maxlength: 100,
    trim: true
  },
  department: {
    type: String,
    maxlength: 100,
    trim: true
  },
  salary: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USDC',
    maxlength: 10,
    uppercase: true
  },
  stellarAddress: {
    type: String,
    required: true,
    maxlength: 56
  },
  hireDate: Date,
  employmentStatus: {
    type: String,
    enum: ['active', 'inactive', 'terminated'],
    default: 'active'
  },
  paymentSchedule: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    default: 'monthly'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'employees'
});

// Compound index for unique employee ID per company
employeeSchema.index({ companyId: 1, employeeId: 1 }, { unique: true });

// Other indexes for performance
employeeSchema.index({ companyId: 1, employmentStatus: 1 });
employeeSchema.index({ stellarAddress: 1 });
employeeSchema.index({ email: 1 }, { sparse: true });
employeeSchema.index({ firstName: 'text', lastName: 'text' });

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);
