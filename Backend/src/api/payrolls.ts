/**
 * Payrolls API Routes
 * Handles payroll creation, funding, release, and management
 * Also handles employee management
 */

import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { authMiddleware } from '../utils/auth';
import { validateRequest } from '../utils/validation';
import { 
  createPayrollSchema, 
  fundPayrollSchema, 
  releasePayrollSchema 
} from '../models/PayrollSchemas';

const router = Router();
const payrollController = new PayrollController();

// =============================================================================
// EMPLOYEE MANAGEMENT ROUTES
// =============================================================================

/**
 * POST /api/payrolls/employees
 * Add a new employee
 * @body {EmployeeCreateRequest}
 * @returns {EmployeeResponse}
 */
router.post(
  '/employees',
  authMiddleware,
  payrollController.addEmployee
);

/**
 * GET /api/payrolls/employees
 * Get all employees for authenticated employer
 * @returns {EmployeeListResponse}
 */
router.get(
  '/employees',
  authMiddleware,
  payrollController.getEmployees
);

/**
 * PUT /api/payrolls/employees/:id
 * Update an employee
 * @param {string} id - Employee ID
 * @body {EmployeeUpdateRequest}
 * @returns {EmployeeResponse}
 */
router.put(
  '/employees/:id',
  authMiddleware,
  payrollController.updateEmployee
);

/**
 * GET /api/payrolls/employees/stats
 * Get employee statistics
 * @returns {EmployeeStatsResponse}
 */
router.get(
  '/employees/stats',
  authMiddleware,
  payrollController.getEmployeeStats
);

// =============================================================================
// PAYROLL ROUTES
// =============================================================================

/**
 * POST /api/payrolls
 * Create a new payroll escrow
 * @body {PayrollCreateRequest}
 * @returns {PayrollResponse}
 */
router.post(
  '/',
  authMiddleware,
  validateRequest(createPayrollSchema),
  payrollController.createPayroll
);

/**
 * GET /api/payrolls/:id
 * Get payroll details by ID
 * @param {string} id - Payroll ID
 * @returns {PayrollResponse}
 */
router.get(
  '/:id',
  authMiddleware,
  payrollController.getPayroll
);

/**
 * GET /api/payrolls
 * Get all payrolls for authenticated employer
 * @query {number} page - Page number
 * @query {number} limit - Items per page
 * @query {string} status - Filter by status
 * @returns {PaginatedPayrollResponse}
 */
router.get(
  '/',
  authMiddleware,
  payrollController.getPayrolls
);

/**
 * POST /api/payrolls/:id/fund
 * Fund a payroll escrow with USDC
 * @param {string} id - Payroll ID
 * @body {FundPayrollRequest}
 * @returns {TransactionResponse}
 */
router.post(
  '/:id/fund',
  authMiddleware,
  validateRequest(fundPayrollSchema),
  payrollController.fundPayroll
);

/**
 * POST /api/payrolls/:id/release
 * Manually release payroll payments
 * @param {string} id - Payroll ID
 * @body {ReleasePayrollRequest}
 * @returns {TransactionResponse}
 */
router.post(
  '/:id/release',
  authMiddleware,
  validateRequest(releasePayrollSchema),
  payrollController.releasePayroll
);

/**
 * POST /api/payrolls/:id/cancel
 * Cancel a payroll and refund employer
 * @param {string} id - Payroll ID
 * @returns {TransactionResponse}
 */
router.post(
  '/:id/cancel',
  authMiddleware,
  payrollController.cancelPayroll
);

/**
 * GET /api/payrolls/:id/recipients
 * Get payroll recipients and their payment status
 * @param {string} id - Payroll ID
 * @returns {PayrollRecipientsResponse}
 */
router.get(
  '/:id/recipients',
  authMiddleware,
  payrollController.getPayrollRecipients
);

/**
 * POST /api/payrolls/:id/schedule
 * Schedule automated payroll release
 * @param {string} id - Payroll ID
 * @body {SchedulePayrollRequest}
 * @returns {ScheduleResponse}
 */
router.post(
  '/:id/schedule',
  authMiddleware,
  payrollController.schedulePayroll
);

export default router;
