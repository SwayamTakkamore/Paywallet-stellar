import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { demoApiClient } from '@/lib/api';

// Auth hooks
export const useLogin = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      await login(email, password);
    },
    onSuccess: () => {
      console.log('Login successful');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

// Dashboard hooks
export const useEmployerStats = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['employer-stats', user?.id],
    queryFn: () => demoApiClient.getEmployerStats(),
    enabled: user?.role === 'employer',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkerStats = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['worker-stats', user?.id],
    queryFn: () => demoApiClient.getWorkerStats(),
    enabled: user?.role === 'worker',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Transactions hooks
export const useTransactions = (page = 1, limit = 10) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['transactions', user?.id, page, limit],
    queryFn: () => demoApiClient.getTransactions(page, limit),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Employees hooks (for employers)
export const useEmployees = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['employees', user?.id],
    queryFn: async () => {
      // Mock data for now
      return {
        success: true,
        data: Array.from({ length: 8 }, (_, i) => ({
          id: `emp-${i + 1}`,
          user: {
            firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma'][i],
            lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Taylor'][i],
            email: `employee${i + 1}@company.com`,
            avatar: null,
          },
          position: ['Developer', 'Designer', 'Manager', 'Analyst', 'QA Engineer', 'DevOps', 'Product Manager', 'Marketing'][i],
          salary: [5000, 4500, 7000, 4000, 4800, 5500, 8000, 3500][i],
          currency: 'USD',
          paymentSchedule: 'monthly' as const,
          status: 'active' as const,
          joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        })),
      };
    },
    enabled: user?.role === 'employer',
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Payment schedules hooks
export const usePaymentSchedules = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['payment-schedules', user?.id],
    queryFn: async () => {
      // Mock data for now
      return {
        success: true,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: `schedule-${i + 1}`,
          companyId: user?.id,
          employeeIds: [`emp-${i + 1}`, `emp-${i + 2}`],
          amount: [10000, 15000, 8000, 12000, 20000][i],
          currency: 'USD',
          scheduledDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          frequency: 'monthly' as const,
          status: ['scheduled', 'processing', 'completed', 'scheduled', 'failed'][i] as any,
          createdAt: new Date().toISOString(),
        })),
      };
    },
    enabled: user?.role === 'employer',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (employeeData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, data: { id: Math.random().toString(36), ...employeeData } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', user?.id] });
      console.log('Employee added successfully!');
    },
    onError: () => {
      console.error('Failed to add employee. Please try again.');
    },
  });
};

export const useCreatePaymentSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (scheduleData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, data: { id: Math.random().toString(36), ...scheduleData } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-schedules', user?.id] });
      console.log('Payment schedule created successfully!');
    },
    onError: () => {
      console.error('Failed to create payment schedule. Please try again.');
    },
  });
};

export const useWithdrawFunds = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (withdrawalData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, data: { id: Math.random().toString(36), ...withdrawalData } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-stats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      console.log('Withdrawal request submitted successfully!');
    },
    onError: () => {
      console.error('Failed to process withdrawal. Please try again.');
    },
  });
};
