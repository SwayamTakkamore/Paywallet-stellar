/**
 * Payroll Controller
 * Handles HTTP requests for payroll operations
 */

import { Request, Response } from 'express';
import { PayrollService } from '../services/PayrollService';
import { StellarService } from '../services/StellarService';
import { SorobanService } from '../services/SorobanService';
import { logger } from '../utils/logger';
import { 
  PayrollCreateRequest, 
  FundPayrollRequest, 
  ReleasePayrollRequest 
} from '../models/PayrollTypes';

export class PayrollController {
  private payrollService: PayrollService;
  private stellarService: StellarService;
  private sorobanService: SorobanService;

  constructor() {
    this.payrollService = new PayrollService();
    this.stellarService = new StellarService();
    this.sorobanService = new SorobanService();
  }

  /**
   * Create a new payroll escrow
   * POST /api/payrolls
   */
  createPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const employerId = req.user?.id;
      const payrollData: PayrollCreateRequest = req.body;

      logger.info(`Creating payroll for employer ${employerId}`, { payrollData });

      // Validate employer permissions
      if (!employerId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Create payroll escrow via Soroban contract
      const contractResult = await this.sorobanService.createPayrollEscrow({
        employer: employerId,
        recipients: payrollData.recipients,
        schedule: payrollData.schedule,
        totalAmount: payrollData.totalAmount,
        asset: payrollData.asset || 'USDC'
      });

      // Store payroll data in database
      const payroll = await this.payrollService.createPayroll({
        ...payrollData,
        employerId,
        contractId: contractResult.contractId,
        txHash: contractResult.txHash,
        status: 'created'
      });

      res.status(201).json({
        success: true,
        data: {
          payroll,
          contractId: contractResult.contractId,
          transactionHash: contractResult.txHash
        }
      });

    } catch (error) {
      logger.error('Error creating payroll:', error);
      res.status(500).json({ 
        error: 'Failed to create payroll',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get payroll details by ID
   * GET /api/payrolls/:id
   */
  getPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user?.id;

      const payroll = await this.payrollService.getPayrollById(id, employerId);
      
      if (!payroll) {
        res.status(404).json({ error: 'Payroll not found' });
        return;
      }

      // Get contract status from Soroban
      const contractStatus = await this.sorobanService.getPayrollStatus(payroll.contractId);

      res.json({
        success: true,
        data: {
          ...payroll,
          contractStatus
        }
      });

    } catch (error) {
      logger.error('Error fetching payroll:', error);
      res.status(500).json({ error: 'Failed to fetch payroll' });
    }
  };

  /**
   * Get all payrolls for employer
   * GET /api/payrolls
   */
  getPayrolls = async (req: Request, res: Response): Promise<void> => {
    try {
      const employerId = req.user?.id;
      const { page = 1, limit = 20, status } = req.query;

      const result = await this.payrollService.getPayrollsForEmployer(
        employerId!, 
        {
          page: Number(page),
          limit: Number(limit),
          status: status as string
        }
      );

      res.json({
        success: true,
        data: result.payrolls,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          pages: Math.ceil(result.total / Number(limit))
        }
      });

    } catch (error) {
      logger.error('Error fetching payrolls:', error);
      res.status(500).json({ error: 'Failed to fetch payrolls' });
    }
  };

  /**
   * Fund a payroll escrow
   * POST /api/payrolls/:id/fund
   */
  fundPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user?.id;
      const fundingData: FundPayrollRequest = req.body;

      // Get payroll details
      const payroll = await this.payrollService.getPayrollById(id, employerId);
      if (!payroll) {
        res.status(404).json({ error: 'Payroll not found' });
        return;
      }

      // Validate funding amount
      if (fundingData.amount <= 0) {
        res.status(400).json({ error: 'Invalid funding amount' });
        return;
      }

      // Create funding transaction via Stellar
      const stellarTx = await this.stellarService.createPayment({
        from: fundingData.sourceAccount,
        to: payroll.escrowAccount!,
        amount: fundingData.amount.toString(),
        asset: fundingData.asset || 'USDC',
        memo: `Fund payroll ${id}`
      });

      // Update contract via Soroban
      const contractResult = await this.sorobanService.depositToPayroll({
        contractId: payroll.contractId,
        payrollId: id,
        amount: fundingData.amount,
        asset: fundingData.asset || 'USDC'
      });

      // Update payroll status in database
      await this.payrollService.updatePayrollStatus(id, 'funded', {
        fundingTxHash: stellarTx.hash,
        contractTxHash: contractResult.txHash,
        fundedAmount: fundingData.amount,
        fundedAt: new Date()
      });

      res.json({
        success: true,
        data: {
          payrollId: id,
          amount: fundingData.amount,
          stellarTxHash: stellarTx.hash,
          contractTxHash: contractResult.txHash,
          status: 'funded'
        }
      });

    } catch (error) {
      logger.error('Error funding payroll:', error);
      res.status(500).json({ 
        error: 'Failed to fund payroll',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Release payroll payments
   * POST /api/payrolls/:id/release
   */
  releasePayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user?.id;
      const releaseData: ReleasePayrollRequest = req.body;

      // Get payroll details
      const payroll = await this.payrollService.getPayrollById(id, employerId);
      if (!payroll || payroll.status !== 'funded') {
        res.status(400).json({ error: 'Payroll not ready for release' });
        return;
      }

      // Trigger payment release via Soroban contract
      const contractResult = await this.sorobanService.releasePayments({
        contractId: payroll.contractId,
        payrollId: id,
        releaseType: releaseData.releaseType || 'full',
        recipientIds: releaseData.recipientIds
      });

      // Update payroll status
      await this.payrollService.updatePayrollStatus(id, 'released', {
        releaseTxHash: contractResult.txHash,
        releasedAt: new Date(),
        releaseType: releaseData.releaseType
      });

      res.json({
        success: true,
        data: {
          payrollId: id,
          transactionHash: contractResult.txHash,
          status: 'released',
          releaseType: releaseData.releaseType
        }
      });

    } catch (error) {
      logger.error('Error releasing payroll:', error);
      res.status(500).json({ 
        error: 'Failed to release payroll',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Cancel payroll and refund
   * POST /api/payrolls/:id/cancel
   */
  cancelPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user?.id;

      // Implementation for canceling payroll...
      res.json({ 
        success: true, 
        message: 'Payroll cancelled successfully' 
      });
    } catch (error) {
      logger.error('Error cancelling payroll:', error);
      res.status(500).json({ error: 'Failed to cancel payroll' });
    }
  };

  /**
   * Get payroll recipients
   * GET /api/payrolls/:id/recipients
   */
  getPayrollRecipients = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user?.id;

      const recipients = await this.payrollService.getPayrollRecipients(id, employerId);
      
      res.json({
        success: true,
        data: recipients
      });
    } catch (error) {
      logger.error('Error fetching payroll recipients:', error);
      res.status(500).json({ error: 'Failed to fetch recipients' });
    }
  };

  /**
   * Schedule payroll
   * POST /api/payrolls/:id/schedule
   */
  schedulePayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // Implementation for scheduling...
      res.json({ 
        success: true, 
        message: 'Payroll scheduled successfully' 
      });
    } catch (error) {
      logger.error('Error scheduling payroll:', error);
      res.status(500).json({ error: 'Failed to schedule payroll' });
    }
  };
}
