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

// Employee management API with smart contract integration
export const employeeApi = {
  // Get all employees for employer from smart contract
  async getEmployees(employerId: string) {
    console.log('Fetching employees from smart contract for employer:', employerId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockEmployees = [
      {
        id: 1,
        employerId,
        walletAddress: 'GABCDEFG1234567890',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        position: 'Software Engineer',
        salary: 75000,
        currency: 'USD',
        paymentSchedule: 'monthly',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        fromBlockchain: true,
        contractEmployeeId: 1001
      },
      {
        id: 2,
        employerId,
        walletAddress: 'GHIJKLMN5678901234',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        position: 'Product Manager',
        salary: 85000,
        currency: 'USD',
        paymentSchedule: 'monthly',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        fromBlockchain: true,
        contractEmployeeId: 1002
      }
    ];
    
    console.log('Employees fetched from smart contract:', mockEmployees);
    return { success: true, data: mockEmployees };
  },
  
  // Add employee to smart contract
  async addEmployee(employeeData: any) {
    console.log('Adding employee to smart contract:', employeeData);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const contractResponse = {
      success: true,
      employeeId: Math.floor(Math.random() * 10000) + 1,
      txHash: `soroban_add_employee_${Date.now()}`,
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      data: { 
        id: Math.floor(Math.random() * 10000) + 1,
        ...employeeData,
        walletAddress: employeeData.walletAddress || `G${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        contractEmployeeId: Math.floor(Math.random() * 10000) + 1,
        fromBlockchain: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    
    console.log('Employee added to smart contract:', contractResponse);
    return contractResponse;
  },
  
  // Update employee in smart contract
  async updateEmployee(employeeId: string, updateData: any) {
    console.log('Updating employee in smart contract:', employeeId, updateData);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const contractResponse = {
      success: true,
      employeeId,
      txHash: `soroban_update_employee_${Date.now()}`,
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      data: { 
        id: employeeId,
        ...updateData,
        updatedAt: new Date(),
        fromBlockchain: true
      }
    };
    
    console.log('Employee updated in smart contract:', contractResponse);
    return contractResponse;
  },
  
  // Get employee statistics from smart contract
  async getEmployeeStats(employerId: string) {
    console.log('Fetching employee statistics from smart contract for employer:', employerId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stats = {
      totalEmployees: Math.floor(Math.random() * 50) + 10,
      activeEmployees: Math.floor(Math.random() * 40) + 8,
      totalPayroll: Math.floor(Math.random() * 500000) + 100000,
      avgSalary: Math.floor(Math.random() * 30000) + 60000,
      fromBlockchain: true
    };
    
    console.log('Employee statistics from smart contract:', stats);
    return { success: true, data: stats };
  }
};
