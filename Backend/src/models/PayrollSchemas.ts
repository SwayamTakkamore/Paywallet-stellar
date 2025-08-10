/**
 * Payroll Request Validation Schemas
 * Using Joi for input validation
 */

import Joi from 'joi';

// Recipient schema
const recipientSchema = Joi.object({
  walletAddress: Joi.string().required()
    .pattern(/^G[A-Z0-9]{55}$/) // Stellar public key format
    .message('Invalid Stellar wallet address'),
  employeeId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USDC'),
  name: Joi.string().optional(),
  email: Joi.string().email().optional()
});

// Schedule schema
const scheduleSchema = Joi.object({
  type: Joi.string().valid('immediate', 'scheduled', 'recurring', 'streaming').required(),
  releaseDate: Joi.date().when('type', {
    is: 'scheduled',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  recurringInterval: Joi.string().valid('weekly', 'biweekly', 'monthly').when('type', {
    is: 'recurring', 
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  streamRate: Joi.number().positive().when('type', {
    is: 'streaming',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  endDate: Joi.date().optional()
});

// Create payroll schema
export const createPayrollSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  recipients: Joi.array().items(recipientSchema).min(1).max(1000).required(),
  totalAmount: Joi.number().positive().required(),
  asset: Joi.string().default('USDC'),
  schedule: scheduleSchema.required(),
  metadata: Joi.object().optional()
}).custom((value, helpers) => {
  // Validate that totalAmount matches sum of recipient amounts
  const recipientTotal = value.recipients.reduce((sum: number, recipient: any) => sum + recipient.amount, 0);
  if (Math.abs(recipientTotal - value.totalAmount) > 0.01) { // Allow small floating point differences
    return helpers.error('any.custom', { message: 'Total amount must equal sum of recipient amounts' });
  }
  return value;
});

// Fund payroll schema
export const fundPayrollSchema = Joi.object({
  amount: Joi.number().positive().required(),
  asset: Joi.string().default('USDC'),
  sourceAccount: Joi.string().required()
    .pattern(/^G[A-Z0-9]{55}$/)
    .message('Invalid Stellar source account'),
  sourceSecretKey: Joi.string().required()
    .pattern(/^S[A-Z0-9]{55}$/)
    .message('Invalid Stellar secret key')
});

// Release payroll schema
export const releasePayrollSchema = Joi.object({
  releaseType: Joi.string().valid('full', 'partial').default('full'),
  recipientIds: Joi.array().items(Joi.string().uuid()).when('releaseType', {
    is: 'partial',
    then: Joi.array().required().min(1),
    otherwise: Joi.optional()
  }),
  memo: Joi.string().max(255).optional()
});

// Query parameters for getting payrolls
export const getPayrollsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(
    'created', 'funded', 'scheduled', 'releasing', 
    'released', 'partial', 'cancelled', 'failed'
  ).optional()
});

// Schedule payroll schema
export const schedulePayrollSchema = Joi.object({
  executeAt: Joi.date().min('now').required(),
  recurringInterval: Joi.string().valid('weekly', 'biweekly', 'monthly').optional(),
  endDate: Joi.date().greater(Joi.ref('executeAt')).optional()
});
