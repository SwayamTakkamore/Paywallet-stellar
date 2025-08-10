import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { database, getDatabaseConfig, User, Company, Employee, Payroll } from '../models';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const dbConfig = getDatabaseConfig();
    await database.connect(dbConfig);
    
    logger.info('🌱 Starting database seeding...');

    // Clear existing data (in development only)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await Company.deleteMany({});
      await Employee.deleteMany({});
      await Payroll.deleteMany({});
      logger.info('🧹 Cleared existing data');
    }

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const employer = await User.create({
      email: 'employer@demo.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'employer',
      stellarPublicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      kycStatus: 'approved',
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      kycApprovedAt: new Date()
    });

    const worker = await User.create({
      email: 'worker@demo.com',
      passwordHash: hashedPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'worker',
      stellarPublicKey: 'GYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
      kycStatus: 'approved',
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      kycApprovedAt: new Date()
    });

    logger.info('👥 Created test users');

    // Create a test company
    const company = await Company.create({
      ownerId: employer._id,
      companyName: 'Tech Innovations Inc.',
      companyType: 'Technology',
      taxId: 'TX123456789',
      address: '123 Tech Street, Silicon Valley, CA 94000',
      country: 'US',
      industry: 'Software Development',
      website: 'https://techinnovations.com',
      stellarAccount: 'GZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
      escrowAccount: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      isVerified: true,
      verifiedAt: new Date(),
      settings: {
        defaultCurrency: 'USDC',
        paymentSchedule: 'monthly',
        autoPayroll: false
      }
    });

    logger.info('🏢 Created test company');

    // Create test employees
    const employees = await Employee.insertMany([
      {
        companyId: company._id,
        userId: worker._id,
        employeeId: 'EMP001',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@techinnovations.com',
        position: 'Senior Developer',
        department: 'Engineering',
        salary: 8500,
        currency: 'USDC',
        stellarAddress: 'GYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
        hireDate: new Date('2024-01-15'),
        employmentStatus: 'active',
        paymentSchedule: 'monthly',
        metadata: {
          level: 'senior',
          skills: ['React', 'Node.js', 'TypeScript']
        }
      },
      {
        companyId: company._id,
        employeeId: 'EMP002',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@techinnovations.com',
        position: 'Product Manager',
        department: 'Product',
        salary: 7500,
        currency: 'USDC',
        stellarAddress: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        hireDate: new Date('2024-02-01'),
        employmentStatus: 'active',
        paymentSchedule: 'monthly',
        metadata: {
          level: 'mid',
          skills: ['Product Strategy', 'Analytics', 'User Research']
        }
      },
      {
        companyId: company._id,
        employeeId: 'EMP003',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@techinnovations.com',
        position: 'UI/UX Designer',
        department: 'Design',
        salary: 6500,
        currency: 'USDC',
        stellarAddress: 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        hireDate: new Date('2024-03-01'),
        employmentStatus: 'active',
        paymentSchedule: 'monthly',
        metadata: {
          level: 'mid',
          skills: ['Figma', 'User Research', 'Prototyping']
        }
      }
    ]);

    logger.info(`👨‍💼 Created ${employees.length} test employees`);

    // Create test payrolls
    const payroll = await Payroll.create({
      title: 'March 2024 Monthly Payroll',
      description: 'Regular monthly salary payments for all employees',
      companyId: company._id,
      employerId: employer._id,
      contractId: 'CONTRACT_' + Date.now(),
      escrowAccount: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      totalAmount: 22500, // Sum of all employee salaries
      fundedAmount: 22500,
      asset: 'USDC',
      assetIssuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      status: 'funded',
      scheduleType: 'scheduled',
      scheduleData: {
        frequency: 'monthly',
        dayOfMonth: 1
      },
      releaseDate: new Date('2024-04-01'),
      txHash: 'TX_CREATE_' + Date.now(),
      fundingTxHash: 'TX_FUND_' + Date.now(),
      fundedAt: new Date()
    });

    logger.info('💰 Created test payroll');

    logger.info('✅ Database seeding completed successfully!');
    logger.info(`
    Demo Credentials:
    - Employer: employer@demo.com / password123
    - Worker: worker@demo.com / password123
    
    Test Data Created:
    - 2 Users (1 employer, 1 worker)
    - 1 Company
    - 3 Employees
    - 1 Payroll
    `);

  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
  } finally {
    await database.disconnect();
    process.exit(0);
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
