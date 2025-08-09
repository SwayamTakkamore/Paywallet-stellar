'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from '@/components/ui/modal';
import { FormField, Select } from '@/components/ui/form';
import { useEmployees, useCreateEmployee } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    firstName: '',
    lastName: '',
    position: '',
    salary: '',
    currency: 'USD',
    paymentSchedule: 'monthly',
  });

  const { data: employeesData, isLoading } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();

  const employees = employeesData?.data || [];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (field: string, value: string) => {
    setNewEmployee(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEmployeeMutation.mutateAsync({
        ...newEmployee,
        salary: parseFloat(newEmployee.salary),
      });
      setShowAddModal(false);
      setNewEmployee({
        email: '',
        firstName: '',
        lastName: '',
        position: '',
        salary: '',
        currency: 'USD',
        paymentSchedule: 'monthly',
      });
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const positionOptions = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'qa_engineer', label: 'QA Engineer' },
    { value: 'devops', label: 'DevOps' },
    { value: 'product_manager', label: 'Product Manager' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const scheduleOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'XLM', label: 'XLM (Stellar)' },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your employees and their salary information</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-gray-500">Active team members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(employees.reduce((sum, emp) => sum + emp.salary, 0))}
            </div>
            <p className="text-xs text-gray-500">Total monthly cost</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(employees.length > 0 ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length : 0)}
            </div>
            <p className="text-xs text-gray-500">Per employee</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            {filteredEmployees.length} of {employees.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">
                          {employee.user.firstName[0]}{employee.user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{employee.user.firstName} {employee.user.lastName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{employee.position}</span>
                  </TableCell>
                  <TableCell>{formatCurrency(employee.salary, employee.currency)}</TableCell>
                  <TableCell>
                    <span className="capitalize">{employee.paymentSchedule}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(employee.joinedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No employees found matching your criteria</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddModal(true)}>
                Add Your First Employee
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <Modal open={showAddModal} onOpenChange={setShowAddModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add New Employee</ModalTitle>
            <ModalClose onClose={() => setShowAddModal(false)} />
          </ModalHeader>
          
          <form onSubmit={handleAddEmployee}>
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="First Name" required>
                  <Input
                    value={newEmployee.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </FormField>
                
                <FormField label="Last Name" required>
                  <Input
                    value={newEmployee.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Email Address" required>
                <Input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </FormField>

              <FormField label="Position" required>
                <Select
                  value={newEmployee.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  options={positionOptions}
                  placeholder="Select position"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Salary Amount" required>
                  <Input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </FormField>
                
                <FormField label="Currency" required>
                  <Select
                    value={newEmployee.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    options={currencyOptions}
                  />
                </FormField>
              </div>

              <FormField label="Payment Schedule" required>
                <Select
                  value={newEmployee.paymentSchedule}
                  onChange={(e) => handleInputChange('paymentSchedule', e.target.value)}
                  options={scheduleOptions}
                />
              </FormField>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={createEmployeeMutation.isPending}>
                {createEmployeeMutation.isPending ? 'Adding...' : 'Add Employee'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
