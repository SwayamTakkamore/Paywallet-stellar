// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employer' | 'worker';
  avatar?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'employer' | 'worker';
}

// Employer Types
export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  country: string;
  employerId: string;
  walletAddress?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  companyId: string;
  position: string;
  salary: number;
  currency: string;
  paymentSchedule: 'weekly' | 'bi-weekly' | 'monthly';
  status: 'active' | 'inactive';
  user: Pick<User, 'firstName' | 'lastName' | 'email' | 'avatar'>;
  joinedAt: string;
}

// Payment Types
export interface PaymentSchedule {
  id: string;
  companyId: string;
  employeeIds: string[];
  amount: number;
  currency: string;
  scheduledDate: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId?: string;
  companyId?: string;
  type: 'salary' | 'withdrawal' | 'bonus' | 'refund';
  amount: number;
  currency: string;
  stellarTxHash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
  completedAt?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalBalance: number;
  totalEmployees?: number;
  monthlyPayroll?: number;
  pendingPayments?: number;
  monthlyEarnings?: number;
  pendingWithdrawals?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface KYCData {
  documentType: 'passport' | 'license' | 'id_card';
  documentNumber: string;
  documentImage: File;
  selfieImage: File;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface WithdrawalRequest {
  amount: number;
  currency: string;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  walletAddress?: string;
  withdrawalMethod: 'bank' | 'crypto';
}

// UI Types
export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}
