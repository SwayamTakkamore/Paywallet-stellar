import { ApiResponse, PaginatedResponse } from '@/types';
import { config } from './config';

// Base API configuration using environment variables
const API_BASE_URL = config.api.baseUrl;

// API client class
class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth-token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('auth-token');
    
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  }
}

// Export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  UPLOAD_AVATAR: '/user/avatar',
  
  // KYC
  SUBMIT_KYC: '/user/kyc',
  KYC_STATUS: '/user/kyc/status',
  
  // Company (Employer)
  COMPANY: '/company',
  UPDATE_COMPANY: '/company',
  
  // Employees
  EMPLOYEES: '/employees',
  ADD_EMPLOYEE: '/employees',
  UPDATE_EMPLOYEE: '/employees',
  DELETE_EMPLOYEE: '/employees',
  
  // Payments
  PAYMENT_SCHEDULES: '/payments/schedules',
  CREATE_SCHEDULE: '/payments/schedules',
  UPDATE_SCHEDULE: '/payments/schedules',
  DELETE_SCHEDULE: '/payments/schedules',
  EXECUTE_PAYMENT: '/payments/execute',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAILS: '/transactions',
  
  // Withdrawals
  WITHDRAWAL_REQUEST: '/withdrawals',
  WITHDRAWAL_HISTORY: '/withdrawals',
  
  // Dashboard
  EMPLOYER_STATS: '/dashboard/employer',
  WORKER_STATS: '/dashboard/worker',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: '/notifications/read',
} as const;

// Demo API functions (these will simulate real API calls)
export class DemoApiClient {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async login(credentials: any): Promise<ApiResponse<any>> {
    await this.delay(1000);
    // Simulate login success
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'employer',
          kycStatus: 'verified',
        },
        token: 'demo-jwt-token',
      },
    };
  }

  async getEmployerStats(): Promise<ApiResponse<any>> {
    await this.delay(800);
    return {
      success: true,
      data: {
        totalBalance: 125000,
        totalEmployees: 25,
        monthlyPayroll: 85000,
        pendingPayments: 5,
      },
    };
  }

  async getWorkerStats(): Promise<ApiResponse<any>> {
    await this.delay(800);
    return {
      success: true,
      data: {
        totalBalance: 8500,
        monthlyEarnings: 5000,
        pendingWithdrawals: 1,
      },
    };
  }

  async getTransactions(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<any>>> {
    await this.delay(600);
    return {
      success: true,
      data: {
        data: Array.from({ length: limit }, (_, i) => ({
          id: `tx-${page}-${i}`,
          type: 'salary',
          amount: 5000,
          currency: 'USD',
          status: 'completed',
          description: 'Monthly Salary',
          createdAt: new Date().toISOString(),
        })),
        pagination: {
          page,
          limit,
          total: 100,
          pages: 10,
        },
      },
    };
  }
}

export const demoApiClient = new DemoApiClient();
