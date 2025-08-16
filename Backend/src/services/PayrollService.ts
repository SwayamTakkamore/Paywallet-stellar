/**
 * Payroll Service
 * Core business logic for payroll operations
 */

import { Types } from 'mongoose';
import { PayrollResponse, PayrollCreateRequest } from '../models/PayrollTypes';
import { Payroll, IPayroll } from '../models/schemas/Payroll';
import { Employee } from '../models/schemas/Employee';
import { User } from '../models/schemas/User';
import { Company } from '../models/schemas/Company';
import { SorobanService } from './SorobanService';
import { logger } from '../utils/logger';

export class PayrollService {
  private sorobanService: SorobanService;

  constructor() {
    this.sorobanService = new SorobanService();
  }

  // =============================================================================
  // EMPLOYEE MANAGEMENT FUNCTIONS
  // =============================================================================

  /**
   * Add a new employee (saves to both database and smart contract)
   */
  async addEmployee(employerAddress: string, employeeData: any): Promise<any> {
    try {
      logger.info('Adding employee:', { employerAddress, employeeData });

      // Step 1: Add employee to smart contract first
      const contractResult = await this.sorobanService.addEmployee(employerAddress, {
        walletAddress: employeeData.walletAddress || 'PLACEHOLDER_' + Date.now(),
        email: employeeData.email,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        position: employeeData.position,
        salary: employeeData.salary,
        currency: employeeData.currency,
        paymentSchedule: employeeData.paymentSchedule
      });

      // Step 2: Save to database with contract employee ID
      const employee = new Employee({
        ...employeeData,
        contractEmployeeId: contractResult.employeeId,
        blockchainTxHash: contractResult.txHash,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedEmployee = await employee.save();

      logger.info('Employee added successfully:', {
        databaseId: savedEmployee._id,
        contractId: contractResult.employeeId,
        txHash: contractResult.txHash
      });

      return {
        success: true,
        employee: savedEmployee,
        contractEmployeeId: contractResult.employeeId,
        txHash: contractResult.txHash
      };
    } catch (error) {
      logger.error('Error adding employee:', error);
      throw new Error('Failed to add employee: ' + error.message);
    }
  }

  /**
   * Get all employees for an employer (fetches from smart contract)
   */
  async getEmployerEmployees(employerAddress: string): Promise<any> {
    try {
      logger.info('Fetching employees for employer:', employerAddress);

      // Fetch from smart contract
      const contractEmployees = await this.sorobanService.getEmployerEmployees(employerAddress);

      // Also fetch from database for additional fields
      const dbEmployees = await Employee.find({ 
        employerId: employerAddress,
        status: { $ne: 'deleted' }
      }).populate('userId', 'firstName lastName email');

      // Merge contract data with database data
      const mergedEmployees = contractEmployees.map(contractEmp => {
        const dbEmp = dbEmployees.find(emp => emp.contractEmployeeId === contractEmp.id);
        return {
          id: contractEmp.id,
          contractData: contractEmp,
          databaseData: dbEmp,
          // Use contract data as source of truth
          firstName: contractEmp.first_name,
          lastName: contractEmp.last_name,
          email: contractEmp.email,
          position: contractEmp.position,
          salary: contractEmp.salary,
          currency: contractEmp.currency,
          paymentSchedule: contractEmp.payment_schedule,
          status: contractEmp.status.toLowerCase(),
          walletAddress: contractEmp.wallet_address,
          createdAt: new Date(contractEmp.created_at * 1000),
          updatedAt: new Date(contractEmp.updated_at * 1000)
        };
      });

      logger.info('Successfully fetched employees:', { count: mergedEmployees.length });

      return {
        success: true,
        employees: mergedEmployees,
        fromBlockchain: true
      };
    } catch (error) {
      logger.error('Error fetching employees:', error);
      
      // Fallback to database if contract fails
      try {
        const dbEmployees = await Employee.find({ 
          employerId: employerAddress,
          status: { $ne: 'deleted' }
        }).populate('userId', 'firstName lastName email');

        return {
          success: true,
          employees: dbEmployees,
          fromBlockchain: false,
          fallback: true
        };
      } catch (dbError) {
        throw new Error('Failed to fetch employees from both blockchain and database');
      }
    }
  }

  /**
   * Update employee (updates both database and smart contract)
   */
  async updateEmployee(employerAddress: string, employeeId: string, updates: any): Promise<any> {
    try {
      logger.info('Updating employee:', { employerAddress, employeeId, updates });

      // Find employee in database
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Update smart contract first
      const contractResult = await this.sorobanService.updateEmployee(
        employerAddress, 
        employee.contractEmployeeId, 
        updates
      );

      // Update database
      Object.assign(employee, updates, { updatedAt: new Date() });
      const updatedEmployee = await employee.save();

      logger.info('Employee updated successfully:', {
        databaseId: updatedEmployee._id,
        contractId: employee.contractEmployeeId,
        txHash: contractResult.txHash
      });

      return {
        success: true,
        employee: updatedEmployee,
        txHash: contractResult.txHash
      };
    } catch (error) {
      logger.error('Error updating employee:', error);
      throw new Error('Failed to update employee: ' + error.message);
    }
  }
  async createPayroll(params: PayrollCreateRequest): Promise<PayrollResponse> {
    try {
      // Validate company exists and user is the owner
      const company = await Company.findById(params.companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      if (company.ownerId.toString() !== params.employerId) {
        throw new Error('Unauthorized: User is not the company owner');
      }

      // Generate contract and escrow account IDs
      const contractId = 'CONTRACT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const escrowAccount = 'ESCROW_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Create payroll document
      const payrollData: Partial<IPayroll> = {
        title: params.title,
        description: params.description,
        companyId: new Types.ObjectId(params.companyId),
        employerId: new Types.ObjectId(params.employerId),
        contractId,
        escrowAccount,
        totalAmount: params.totalAmount,
        asset: params.asset || 'USDC',
        assetIssuer: params.assetIssuer,
        status: 'created',
        scheduleType: params.schedule.type as 'immediate' | 'scheduled',
        scheduleData: params.schedule,
        metadata: params.metadata,
        recipients: params.recipients.map(recipient => ({
          employeeId: new Types.ObjectId(recipient.employeeId),
          stellarAddress: recipient.stellarAddress,
          amount: recipient.amount,
          asset: recipient.asset || params.asset || 'USDC',
          status: 'pending' as const
        }))
      };

      if (params.schedule.type === 'scheduled' && params.schedule.releaseDate) {
        payrollData.releaseDate = new Date(params.schedule.releaseDate);
      }

      const payroll = await Payroll.create(payrollData);
      logger.info(`Created payroll: ${payroll._id}`);

      return this.mapPayrollToResponse(payroll);
    } catch (error) {
      logger.error('Error creating payroll:', error);
      throw error;
    }
  }

  async getPayrollById(id: string, employerId: string): Promise<PayrollResponse> {
    try {
      const payroll = await Payroll.findOne({
        _id: id,
        employerId: new Types.ObjectId(employerId)
      }).populate('companyId', 'companyName');

      if (!payroll) {
        throw new Error('Payroll not found');
      }

      return this.mapPayrollToResponse(payroll);
    } catch (error) {
      logger.error(`Error fetching payroll ${id}:`, error);
      throw error;
    }
  }

  async getPayrollsForEmployer(employerId: string, filters: any = {}) {
    try {
      const query: any = { employerId: new Types.ObjectId(employerId) };

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.companyId) {
        query.companyId = new Types.ObjectId(filters.companyId);
      }

      if (filters.asset) {
        query.asset = filters.asset;
      }

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const [payrolls, total] = await Promise.all([
        Payroll.find(query)
          .populate('companyId', 'companyName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Payroll.countDocuments(query)
      ]);

      return {
        payrolls: payrolls.map(p => this.mapPayrollToResponse(p)),
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error(`Error fetching payrolls for employer ${employerId}:`, error);
      throw error;
    }
  }

  async updatePayrollStatus(id: string, status: string, updateData: any = {}) {
    try {
      const updateFields: any = { status, updatedAt: new Date() };

      if (updateData.txHash) updateFields.txHash = updateData.txHash;
      if (updateData.fundingTxHash) updateFields.fundingTxHash = updateData.fundingTxHash;
      if (updateData.fundedAmount) updateFields.fundedAmount = updateData.fundedAmount;
      if (updateData.distributionTxHashes) updateFields.distributionTxHashes = updateData.distributionTxHashes;
      if (updateData.errorMessage) updateFields.errorMessage = updateData.errorMessage;

      if (status === 'funded') {
        updateFields.fundedAt = new Date();
      } else if (status === 'distributed') {
        updateFields.distributedAt = new Date();
      } else if (status === 'cancelled') {
        updateFields.cancelledAt = new Date();
      }

      const payroll = await Payroll.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );

      if (!payroll) {
        throw new Error('Payroll not found');
      }

      logger.info(`Updated payroll ${id} status to ${status}`);
      return this.mapPayrollToResponse(payroll);
    } catch (error) {
      logger.error(`Error updating payroll ${id} status:`, error);
      throw error;
    }
  }

  async getPayrollRecipients(id: string, employerId: string) {
    try {
      const payroll = await Payroll.findOne({
        _id: id,
        employerId: new Types.ObjectId(employerId)
      }).populate({
        path: 'recipients.employeeId',
        select: 'firstName lastName email position department'
      });

      if (!payroll) {
        throw new Error('Payroll not found');
      }

      return payroll.recipients.map(recipient => ({
        employeeId: recipient.employeeId._id,
        employee: recipient.employeeId,
        stellarAddress: recipient.stellarAddress,
        amount: recipient.amount,
        asset: recipient.asset,
        status: recipient.status,
        txHash: recipient.txHash,
        paidAt: recipient.paidAt
      }));
    } catch (error) {
      logger.error(`Error fetching payroll recipients for ${id}:`, error);
      throw error;
    }
  }

  private mapPayrollToResponse(payroll: any): PayrollResponse {
    return {
      id: payroll._id.toString(),
      title: payroll.title,
      description: payroll.description,
      employerId: payroll.employerId.toString(),
      companyId: payroll.companyId._id?.toString() || payroll.companyId.toString(),
      companyName: payroll.companyId.companyName,
      contractId: payroll.contractId,
      escrowAccount: payroll.escrowAccount,
      totalAmount: payroll.totalAmount,
      fundedAmount: payroll.fundedAmount,
      asset: payroll.asset,
      assetIssuer: payroll.assetIssuer,
      status: payroll.status,
      schedule: {
        type: payroll.scheduleType,
        ...payroll.scheduleData
      },
      recipients: payroll.recipients.map((r: any) => ({
        employeeId: r.employeeId.toString(),
        stellarAddress: r.stellarAddress,
        amount: r.amount,
        asset: r.asset,
        status: r.status,
        txHash: r.txHash,
        paidAt: r.paidAt
      })),
      txHash: payroll.txHash,
      fundingTxHash: payroll.fundingTxHash,
      distributionTxHashes: payroll.distributionTxHashes,
      errorMessage: payroll.errorMessage,
      releaseDate: payroll.releaseDate,
      metadata: payroll.metadata,
      createdAt: payroll.createdAt,
      updatedAt: payroll.updatedAt,
      fundedAt: payroll.fundedAt,
      distributedAt: payroll.distributedAt,
      cancelledAt: payroll.cancelledAt
    };
  }
}
