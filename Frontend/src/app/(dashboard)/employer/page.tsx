'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, DollarSign, Calendar, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useDashboardStore } from '@/store';

export default function EmployerDashboard() {
  const { stats, loading, fetchEmployerStats } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    fetchEmployerStats();
  }, [fetchEmployerStats]);

  // Mock data for recent transactions
  const recentTransactions = [
    { id: '1', employee: 'John Doe', amount: 5000, status: 'completed', date: '2025-01-08' },
    { id: '2', employee: 'Jane Smith', amount: 4500, status: 'processing', date: '2025-01-08' },
    { id: '3', employee: 'Mike Johnson', amount: 6000, status: 'completed', date: '2025-01-07' },
    { id: '4', employee: 'Sarah Wilson', amount: 4000, status: 'pending', date: '2025-01-07' },
  ];

  // Mock data for upcoming payments
  const upcomingPayments = [
    { id: '1', description: 'Monthly Payroll - Engineering', amount: 25000, date: '2025-01-15', employees: 5 },
    { id: '2', description: 'Bonus Payments - Q4', amount: 12000, date: '2025-01-20', employees: 3 },
    { id: '3', description: 'Monthly Payroll - Marketing', amount: 18000, date: '2025-01-15', employees: 4 },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in-50 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your payroll.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => router.push('/employer/payroll')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Payment
          </Button>
          <Button 
            className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => router.push('/employer/employees')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalBalance || 0)}</div>
            <p className="text-xs text-muted-foreground">Available for payroll</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthlyPayroll || 0)}</div>
            <p className="text-xs text-muted-foreground">This month&apos;s total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingPayments || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest salary payments and transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.employee}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'success' : 
                          transaction.status === 'processing' ? 'warning' : 'secondary'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/employer/payments')}
              >
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Scheduled payroll and bonus payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-500">{payment.employees} employees • {formatDate(payment.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(payment.amount)}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-1"
                      onClick={() => router.push('/employer/payroll')}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/employer/payroll')}
              >
                View All Schedules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col"
              onClick={() => router.push('/employer/employees')}
            >
              <Users className="h-6 w-6 mb-2" />
              Add New Employee
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col"
              onClick={() => router.push('/employer/payments')}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              Send Payment
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col"
              onClick={() => router.push('/employer/payroll')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Payroll
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col"
              onClick={() => router.push('/employer/analytics')}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
