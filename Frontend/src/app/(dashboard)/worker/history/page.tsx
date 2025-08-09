'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, Filter, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface SalaryRecord {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  currency: string;
  status: 'paid' | 'pending' | 'processing';
  paymentDate: string;
  transactionHash?: string;
}

const mockSalaryHistory: SalaryRecord[] = [
  {
    id: '1',
    month: 'January',
    year: 2025,
    grossSalary: 4200,
    deductions: 420,
    netSalary: 3780,
    currency: 'USDC',
    status: 'paid',
    paymentDate: '2025-01-15',
    transactionHash: '0x1234...abcd'
  },
  {
    id: '2',
    month: 'December',
    year: 2024,
    grossSalary: 4200,
    deductions: 420,
    netSalary: 3780,
    currency: 'USDC',
    status: 'paid',
    paymentDate: '2024-12-15',
    transactionHash: '0x5678...efgh'
  },
  {
    id: '3',
    month: 'November',
    year: 2024,
    grossSalary: 4200,
    deductions: 420,
    netSalary: 3780,
    currency: 'USDC',
    status: 'paid',
    paymentDate: '2024-11-15',
    transactionHash: '0x9abc...ijkl'
  },
  {
    id: '4',
    month: 'October',
    year: 2024,
    grossSalary: 4000,
    deductions: 400,
    netSalary: 3600,
    currency: 'USDC',
    status: 'paid',
    paymentDate: '2024-10-15',
    transactionHash: '0xdef0...mnop'
  },
  {
    id: '5',
    month: 'September',
    year: 2024,
    grossSalary: 4000,
    deductions: 400,
    netSalary: 3600,
    currency: 'USDC',
    status: 'paid',
    paymentDate: '2024-09-15',
    transactionHash: '0x1357...qrst'
  },
  {
    id: '6',
    month: 'August',
    year: 2024,
    grossSalary: 3800,
    deductions: 380,
    netSalary: 3420,
    currency: 'USDC',
    status: 'paid',
    paymentDate: '2024-08-15',
    transactionHash: '0x2468...uvwx'
  }
];

export default function SalaryHistoryPage() {
  const [salaryHistory] = useState<SalaryRecord[]>(mockSalaryHistory);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'processing'>('all');
  const [yearFilter, setYearFilter] = useState<string>('2025');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = salaryHistory.filter(record => {
    const statusMatch = filter === 'all' || record.status === filter;
    const yearMatch = yearFilter === 'all' || record.year.toString() === yearFilter;
    return statusMatch && yearMatch;
  });

  const totalEarned = salaryHistory
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.netSalary, 0);

  const currentYearEarnings = salaryHistory
    .filter(r => r.year === 2025 && r.status === 'paid')
    .reduce((sum, r) => sum + r.netSalary, 0);

  const averageSalary = salaryHistory.length > 0 
    ? salaryHistory.reduce((sum, r) => sum + r.netSalary, 0) / salaryHistory.length
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary History</h1>
          <p className="text-gray-600">View your payment history and earnings</p>
        </div>
        <Button variant="outline" className="hover:scale-105 transition-transform">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-left-6 duration-700 delay-300">
        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalEarned.toLocaleString()} USDC
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">All time</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Year</p>
              <p className="text-2xl font-bold text-gray-900">
                ${currentYearEarnings.toLocaleString()} USDC
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">2025 earnings</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-gray-900">
                ${averageSalary.toLocaleString()} USDC
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">Monthly average</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 animate-in slide-in-from-right-6 duration-700 delay-500">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search salary records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Salary History Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
          <div className="text-sm text-gray-500">
            Showing {filteredHistory.length} of {salaryHistory.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.month} {record.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${record.grossSalary.toLocaleString()} {record.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      -${record.deductions.toLocaleString()} {record.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">
                      ${record.netSalary.toLocaleString()} {record.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.paymentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.transactionHash ? (
                      <div className="text-sm text-blue-600 hover:text-blue-900 cursor-pointer font-mono">
                        {record.transactionHash}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-900">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Earnings Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {salaryHistory.slice(-6).reverse().map((record, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t-sm min-h-[20px]"
                style={{ 
                  height: `${(record.netSalary / Math.max(...salaryHistory.map(r => r.netSalary))) * 200}px` 
                }}
                title={`${record.month} ${record.year}: $${record.netSalary.toLocaleString()}`}
              ></div>
              <span className="text-xs text-gray-600 mt-2 transform rotate-45 origin-bottom-left">
                {record.month.slice(0, 3)} {record.year}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Net Salary</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
