/**
 * Payroll Data Types and Interfaces
 */

export interface PayrollRecipient {
  id?: string;
  walletAddress?: string;
  stellarAddress: string;
  employeeId: string;
  amount: number;
  currency?: string;
  asset: string;
  name?: string;
  email?: string;
}

export interface PayrollSchedule {
  type: 'immediate' | 'scheduled' | 'recurring' | 'streaming';
  releaseDate?: Date;
  recurringInterval?: 'weekly' | 'biweekly' | 'monthly';
  streamRate?: number; // tokens per second for streaming
  endDate?: Date;
}

export interface PayrollCreateRequest {
  title: string;
  description?: string;
  companyId: string;
  employerId: string;
  recipients: PayrollRecipient[];
  totalAmount: number;
  asset?: string; // Default: USDC
  assetIssuer?: string;
  schedule: PayrollSchedule;
  metadata?: Record<string, any>;
}

export interface FundPayrollRequest {
  amount: number;
  asset?: string;
  sourceAccount: string; // Stellar account public key
  sourceSecretKey: string; // For signing (should be encrypted/handled securely)
}

export interface ReleasePayrollRequest {
  releaseType?: 'full' | 'partial';
  recipientIds?: string[]; // For partial releases
  memo?: string;
}

export interface PayrollResponse {
  id: string;
  title: string;
  description?: string;
  employerId: string;
  companyId?: string;
  companyName?: string;
  contractId: string;
  escrowAccount?: string;
  totalAmount: number;
  fundedAmount?: number;
  asset: string;
  assetIssuer?: string;
  status: PayrollStatus;
  schedule: PayrollSchedule;
  recipients: PayrollRecipient[];
  txHash?: string;
  fundingTxHash?: string;
  distributionTxHashes?: string[];
  errorMessage?: string;
  releaseDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  fundedAt?: Date;
  distributedAt?: Date;
  cancelledAt?: Date;
  releasedAt?: Date;
}

export interface PayrollRecipientsResponse {
  payrollId: string;
  recipients: (PayrollRecipient & {
    status: 'pending' | 'paid' | 'failed';
    paidAt?: Date;
    txHash?: string;
    failureReason?: string;
  })[];
}

export interface TransactionResponse {
  success: boolean;
  transactionHash: string;
  amount?: number;
  asset?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
}

export interface PaginatedPayrollResponse {
  payrolls: PayrollResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type PayrollStatus = 
  | 'created'      // Payroll created, not yet funded
  | 'funded'       // Funds deposited to escrow
  | 'scheduled'    // Release scheduled
  | 'releasing'    // Payments being processed
  | 'released'     // All payments completed
  | 'partial'      // Some payments completed
  | 'cancelled'    // Payroll cancelled, funds refunded
  | 'failed';      // Release failed

export interface DatabasePayroll {
  id: string;
  title: string;
  description?: string;
  employer_id: string;
  contract_id: string;
  escrow_account?: string;
  total_amount: number;
  funded_amount?: number;
  asset: string;
  status: PayrollStatus;
  schedule_type: string;
  schedule_data: any; // JSON
  created_at: Date;
  updated_at: Date;
  funded_at?: Date;
  released_at?: Date;
  tx_hash?: string;
  funding_tx_hash?: string;
  release_tx_hash?: string;
  metadata?: any; // JSON
}

export interface DatabasePayrollRecipient {
  id: string;
  payroll_id: string;
  wallet_address: string;
  employee_id?: string;
  amount: number;
  currency: string;
  name?: string;
  email?: string;
  status: 'pending' | 'paid' | 'failed';
  paid_at?: Date;
  tx_hash?: string;
  failure_reason?: string;
  created_at: Date;
  updated_at: Date;
}

// Service layer types
export interface CreatePayrollEscrowParams {
  employer: string;
  recipients: PayrollRecipient[];
  schedule: PayrollSchedule;
  totalAmount: number;
  asset: string;
}

export interface CreatePayrollEscrowResult {
  contractId: string;
  txHash: string;
  escrowAccount?: string;
}

export interface DepositToPayrollParams {
  contractId: string;
  payrollId: string;
  amount: number;
  asset: string;
}

export interface ReleasePaymentsParams {
  contractId: string;
  payrollId: string;
  releaseType: 'full' | 'partial';
  recipientIds?: string[];
}

export interface PayrollServiceCreateParams extends PayrollCreateRequest {
  employerId: string;
  contractId: string;
  txHash: string;
  status: PayrollStatus;
}

export interface PayrollFilters {
  page: number;
  limit: number;
  status?: string;
}
