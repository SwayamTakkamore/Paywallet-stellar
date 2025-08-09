'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download } from 'lucide-react';

interface AnalyticsData {
  totalPayroll: number;
  totalEmployees: number;
  averageSalary: number;
  payrollGrowth: number;
  monthlyData: {
    month: string;
    amount: number;
    employees: number;
  }[];
  departmentData: {
    department: string;
    employees: number;
    totalSalary: number;
  }[];
}

const mockAnalytics: AnalyticsData = {
  totalPayroll: 540000,
  totalEmployees: 15,
  averageSalary: 3600,
  payrollGrowth: 12.5,
  monthlyData: [
    { month: 'Aug', amount: 42000, employees: 12 },
    { month: 'Sep', amount: 44000, employees: 13 },
    { month: 'Oct', amount: 43500, employees: 15 },
    { month: 'Nov', amount: 45000, employees: 15 },
    { month: 'Dec', amount: 46000, employees: 15 },
    { month: 'Jan', amount: 45000, employees: 15 }
  ],
  departmentData: [
    { department: 'Engineering', employees: 8, totalSalary: 32000 },
    { department: 'Sales', employees: 3, totalSalary: 10500 },
    { department: 'Marketing', employees: 2, totalSalary: 7000 },
    { department: 'Operations', employees: 2, totalSalary: 6500 }
  ]
};

export default function AnalyticsPage() {
  const [analytics] = useState<AnalyticsData>(mockAnalytics);
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Payroll insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline" className="hover:scale-105 transition-transform">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-left-6 duration-700 delay-300">
        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analytics.totalPayroll.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+{analytics.payrollGrowth}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalEmployees}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+3 this month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analytics.averageSalary.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                <span className="text-xs text-red-600">-2.1%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.payrollGrowth}%</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-6 duration-700 delay-500">
        {/* Payroll Trend Chart */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payroll Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Monthly Payroll</span>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {analytics.monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t-sm min-h-[20px]"
                  style={{ 
                    height: `${(data.amount / Math.max(...analytics.monthlyData.map(d => d.amount))) * 200}px` 
                  }}
                  title={`${data.month}: $${data.amount.toLocaleString()}`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Department Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Department Breakdown</h3>
          </div>
          <div className="space-y-4">
            {analytics.departmentData.map((dept, index) => {
              const percentage = (dept.totalSalary / analytics.monthlyData[analytics.monthlyData.length - 1].amount) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <span className="text-sm text-gray-600">
                      ${dept.totalSalary.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{dept.employees} employees</span>
                    <span>Avg: ${(dept.totalSalary / dept.employees).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Payment Success Rate</p>
            <p className="text-2xl font-bold text-green-600">98.5%</p>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Average Processing Time</p>
            <p className="text-2xl font-bold text-blue-600">2.3 mins</p>
            <p className="text-xs text-gray-500">Per transaction</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Cost Savings</p>
            <p className="text-2xl font-bold text-purple-600">$12,450</p>
            <p className="text-xs text-gray-500">Vs traditional banking</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Payroll processed for January 2025</span>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-900">New employee added to Engineering</span>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Bonus payments distributed</span>
            </div>
            <span className="text-xs text-gray-500">3 days ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
