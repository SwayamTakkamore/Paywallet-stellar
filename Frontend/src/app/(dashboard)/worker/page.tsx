'use client';

import { useEffect } from 'react';
import { Wallet, TrendingUp, Download, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useDashboardStore } from '@/store';

export default function WorkerDashboard() {
  const { stats, loading, fetchWorkerStats } = useDashboardStore();

  useEffect(() => {
    fetchWorkerStats();
  }, [fetchWorkerStats]);

  // Mock data for recent salary payments
  const recentPayments = [
    { id: '1', type: 'Salary', amount: 5000, status: 'completed', date: '2025-01-01', description: 'Monthly Salary - December' },
    { id: '2', type: 'Bonus', amount: 1000, status: 'completed', date: '2024-12-25', description: 'Year-end Bonus' },
    { id: '3', type: 'Salary', amount: 5000, status: 'completed', date: '2024-12-01', description: 'Monthly Salary - November' },
    { id: '4', type: 'Overtime', amount: 500, status: 'completed', date: '2024-11-28', description: 'Overtime Payment' },
  ];

  // Mock data for pending withdrawals
  const pendingWithdrawals = [
    { id: '1', amount: 2000, method: 'Bank Transfer', status: 'processing', date: '2025-01-07', estimatedArrival: '2025-01-09' },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {[...Array(3)].map((_, i) => (
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
          <p className="text-gray-600">Track your earnings and manage your wallet</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <Eye className="mr-2 h-4 w-4" />
            View History
          </Button>
          <Button className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalBalance || 0)}</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthlyEarnings || 0)}</div>
            <p className="text-xs text-muted-foreground">This month&apos;s total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingWithdrawals || 0}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your latest salary and bonus payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.type}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="success">{payment.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Payments</Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Status */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Status</CardTitle>
            <CardDescription>Track your pending and recent withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingWithdrawals.length > 0 ? (
                pendingWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div>
                      <p className="font-medium">{formatCurrency(withdrawal.amount)} • {withdrawal.method}</p>
                      <p className="text-sm text-gray-500">
                        Estimated arrival: {formatDate(withdrawal.estimatedArrival)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">{withdrawal.status}</Badge>
                      <Button size="sm" variant="outline" className="mt-1 ml-2">
                        Track
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending withdrawals</p>
                  <Button className="mt-4">Make a Withdrawal</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Your payment history and breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Earned</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(50000)}</p>
              <p className="text-sm text-green-600">All time</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">This Year</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(15000)}</p>
              <p className="text-sm text-blue-600">January 2025</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Last Month</h3>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(5000)}</p>
              <p className="text-sm text-purple-600">December 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your wallet and profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Withdraw Funds
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              View History
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Earnings Report
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Wallet className="h-6 w-6 mb-2" />
              Wallet Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
