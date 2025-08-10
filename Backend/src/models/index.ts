// Export all database models
export { User, IUser } from './schemas/User';
export { Company, ICompany } from './schemas/Company';
export { Employee, IEmployee } from './schemas/Employee';
export { Payroll, IPayroll } from './schemas/Payroll';

// Export database utilities
export { database, getDatabaseConfig } from '../utils/database';
