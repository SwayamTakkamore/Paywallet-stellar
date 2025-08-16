'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Calendar, Plus, Search, Filter, Download, CheckCircle, Clock, AlertCircle, Eye, Edit, FileDown } from 'lucide-react';

interface PayrollEntry {
  id: string;
  period: string;
  totalAmount: number;
  employeesCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
}

const mockPayrollData: PayrollEntry[] = [
  {
    id: '1',
    period: 'January 2025',
    totalAmount: 45000,
    employeesCount: 15,
    status: 'completed',
    createdAt: '2025-01-01',
    processedAt: '2025-01-02'
  },
  {
    id: '2',
    period: 'December 2024',
    totalAmount: 42000,
    employeesCount: 14,
    status: 'completed',
    createdAt: '2024-12-01',
    processedAt: '2024-12-02'
  },
  {
    id: '3',
    period: 'November 2024',
    totalAmount: 43500,
    employeesCount: 15,
    status: 'processing',
    createdAt: '2024-11-01'
  }
];

export default function PayrollPage() {
  const [payrollData] = useState<PayrollEntry[]>(mockPayrollData);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayroll = payrollData.filter(entry => 
    filter === 'all' || entry.status === filter
  );

  const handleCreatePayroll = () => {
    setShowCreateModal(true);
  };

  const handleViewPayroll = (payroll: PayrollEntry) => {
    setSelectedPayroll(payroll);
    setShowViewModal(true);
  };

  const handleEditPayroll = (payroll: PayrollEntry) => {
    setSelectedPayroll(payroll);
    setShowEditModal(true);
  };

  const handleDownloadPayroll = async (payroll: PayrollEntry) => {
    try {
      setExporting(true);
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock CSV download
      const csvContent = `Period,Total Amount,Employees,Status,Created Date
${payroll.period},$${payroll.totalAmount},${payroll.employeesCount},${payroll.status},${payroll.createdAt}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `payroll-${payroll.period.replace(' ', '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setExporting(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const csvContent = `Period,Total Amount,Employees,Status,Created Date
${filteredPayroll.map(entry => 
  `${entry.period},$${entry.totalAmount},${entry.employeesCount},${entry.status},${entry.createdAt}`
).join('\n')}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'payroll-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600">Manage employee salaries and payment schedules</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={handleCreatePayroll}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Payroll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">$45,000</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payroll entries..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <Button 
              variant="outline"
              onClick={handleExportAll}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Payroll Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payroll History</h3>
          <Button 
            variant="outline"
            onClick={handleExportAll}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayroll.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entry.period}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${entry.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.employeesCount} employees</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(entry.status)}>
                      {getStatusIcon(entry.status)}
                      <span className="ml-1 capitalize">{entry.status}</span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-green-600 hover:text-green-900 flex items-center"
                        onClick={() => handleViewPayroll(entry)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        onClick={() => handleEditPayroll(entry)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      {entry.status === 'completed' && (
                        <button 
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                          onClick={() => handleDownloadPayroll(entry)}
                          disabled={exporting}
                        >
                          <FileDown className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Payroll Modal */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create New Payroll</ModalTitle>
            <ModalClose onClose={() => setShowCreateModal(false)} />
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pay Period
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>February 2025</option>
                  <option>March 2025</option>
                  <option>April 2025</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <div className="text-sm text-gray-600">
                  <p>Total Employees: 15</p>
                  <p>Estimated Total: $45,000</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Create Payroll
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Payroll Modal */}
      <Modal open={showViewModal} onOpenChange={setShowViewModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Payroll Details - {selectedPayroll?.period}</ModalTitle>
            <ModalClose onClose={() => setShowViewModal(false)} />
          </ModalHeader>
          <ModalBody>
            {selectedPayroll && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Period</h4>
                    <p className="text-gray-600">{selectedPayroll.period}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                    <Badge className={getStatusColor(selectedPayroll.status)}>
                      {getStatusIcon(selectedPayroll.status)}
                      <span className="ml-1 capitalize">{selectedPayroll.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Total Amount</h4>
                    <p className="text-gray-600">${selectedPayroll.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Employees</h4>
                    <p className="text-gray-600">{selectedPayroll.employeesCount} employees</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Created Date</h4>
                    <p className="text-gray-600">{new Date(selectedPayroll.createdAt).toLocaleDateString()}</p>
                  </div>
                  {selectedPayroll.processedAt && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Processed Date</h4>
                      <p className="text-gray-600">{new Date(selectedPayroll.processedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Payroll Modal */}
      <Modal open={showEditModal} onOpenChange={setShowEditModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Payroll - {selectedPayroll?.period}</ModalTitle>
            <ModalClose onClose={() => setShowEditModal(false)} />
          </ModalHeader>
          <ModalBody>
            {selectedPayroll && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    defaultValue={selectedPayroll.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about this payroll..."
                  />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
