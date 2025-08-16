import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { employeeApi, demoApiClient } from '@/lib/api';

// =============================================================================
// EMPLOYEE MANAGEMENT HOOKS - Smart Contract Integration
// =============================================================================

export const useEmployees = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['employees', user?.id],
    queryFn: () => employeeApi.getEmployees(user?.id || ''),
    enabled: !!user?.id && user?.role === 'employer',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (employeeData: any) => {
      console.log('Adding employee to smart contract...', employeeData);
      
      // Call smart contract API with automatic delay simulation
      const contractResponse = await employeeApi.addEmployee(employeeData);
      
      console.log('Employee added to smart contract:', contractResponse);
      return contractResponse;
    },
    onSuccess: (data) => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: ['employees', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['employer-stats', user?.id] });
      
      console.log('Employee successfully added to blockchain!', {
        employeeId: data.employeeId,
        txHash: data.txHash,
        blockHeight: data.blockHeight
      });
    },
    onError: (error: any) => {
      console.error('Failed to add employee to blockchain:', error);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ employeeId, updates }: { employeeId: string; updates: any }) => {
      console.log('Updating employee in smart contract...', employeeId, updates);
      
      const response = await employeeApi.updateEmployee(employeeId, updates);
      
      console.log('Employee updated in smart contract:', response);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: ['employees', user?.id] });
      console.log('Employee updated successfully in blockchain!');
    },
    onError: (error: any) => {
      console.error('Failed to update employee in blockchain:', error);
    },
  });
};

export const useEmployerStats = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['employer-stats', user?.id],
    queryFn: () => employeeApi.getEmployeeStats(user?.id || ''),
    enabled: !!user?.id && user?.role === 'employer',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// AUTH HOOKS
// =============================================================================

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await demoApiClient.login({ email, password });
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Store token in localStorage
        if (data.data.token) {
          localStorage.setItem('auth-token', data.data.token);
        }
        
        // Update store state directly
        useAuthStore.setState({
          user: data.data.user,
          token: data.data.token,
          isAuthenticated: true,
          loading: false,
        });
        
        console.log('Login successful!');
      }
    },
    onError: (error: any) => {
      useAuthStore.setState({ loading: false });
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, user: { id: '1', ...userData }, token: 'demo-token' };
    },
    onSuccess: (data) => {
      if (data.success) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
        }
        
        // Update store state directly
        useAuthStore.setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        });
        
        console.log('Registration successful!');
      }
    },
    onError: (error: any) => {
      useAuthStore.setState({ loading: false });
      console.error('Registration failed:', error);
    },
  });
};

// =============================================================================
// DASHBOARD HOOKS
// =============================================================================

export const useEmployerDashboard = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['employer-dashboard', user?.id],
    queryFn: () => demoApiClient.getEmployerStats(),
    enabled: !!user?.id && user?.role === 'employer',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkerDashboard = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['worker-dashboard', user?.id],
    queryFn: () => demoApiClient.getWorkerStats(),
    enabled: !!user?.id && user?.role === 'worker',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// TRANSACTION HOOKS
// =============================================================================

export const useTransactions = (page = 1, limit = 10) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['transactions', user?.id, page, limit],
    queryFn: () => demoApiClient.getTransactions(page, limit),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// =============================================================================
// PAYMENT HOOKS
// =============================================================================

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentData: any) => {
      console.log('Creating payment...', paymentData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, data: { id: Math.random().toString(36), ...paymentData } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      console.log('Payment created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create payment:', error);
    },
  });
};

export const useExecutePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentId: string) => {
      console.log('Executing payment...', paymentId);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate blockchain transaction
      return { success: true, txHash: `stellar_${Date.now()}` };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['employer-dashboard'] });
      console.log('Payment executed successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to execute payment:', error);
    },
  });
};

// =============================================================================
// WITHDRAWAL HOOKS
// =============================================================================

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (withdrawalData: any) => {
      console.log('Creating withdrawal request...', withdrawalData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, data: { id: Math.random().toString(36), ...withdrawalData } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['worker-dashboard'] });
      console.log('Withdrawal request created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create withdrawal request:', error);
    },
  });
};

// =============================================================================
// KYC HOOKS
// =============================================================================

export const useSubmitKYC = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (kycData: any) => {
      console.log('Submitting KYC data...', kycData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, status: 'pending' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      console.log('KYC submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to submit KYC:', error);
    },
  });
};

// =============================================================================
// PROFILE HOOKS
// =============================================================================

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      console.log('Updating profile...', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, user: profileData };
    },
    onSuccess: (data) => {
      if (data.success) {
        updateUser(data.user);
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        console.log('Profile updated successfully!');
      }
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
    },
  });
};
