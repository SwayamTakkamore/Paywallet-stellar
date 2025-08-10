/**
 * MongoDB Seed Data
 * Creates sample data for development and testing
 */

import { connectDB, disconnectDB } from './connection';
import { User, Company, Payroll } from '../models/mongodb/schemas';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Starting MongoDB seed process...');

  try {
    await connectDB();

    // Clear existing data (development only)
    await User.deleteMany({});
    await Company.deleteMany({});
    await Payroll.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const employer = await User.create({
      email: 'employer@paywallet.dev',
      firstName: 'John',
      lastName: 'Employer',
      password: hashedPassword,
      role: 'employer',
      kycStatus: 'verified',
      country: 'US',
      phoneNumber: '+1234567890'
    });

    const workers = await User.create([
      {
        email: 'alice@paywallet.dev',
        firstName: 'Alice',
        lastName: 'Worker',
        password: hashedPassword,
        role: 'worker',
        kycStatus: 'verified',
        country: 'US'
      },
      {
        email: 'bob@paywallet.dev',
        firstName: 'Bob',
        lastName: 'Developer',
        password: hashedPassword,
        role: 'worker',
        kycStatus: 'verified',
        country: 'IN'
      },
      {
        email: 'carol@paywallet.dev',
        firstName: 'Carol',
        lastName: 'Designer',
        password: hashedPassword,
        role: 'worker',
        kycStatus: 'verified',
        country: 'UK'
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample company
    const company = await Company.create({
      name: 'TechCorp Inc',
      description: 'Leading technology company',
      website: 'https://techcorp.dev',
      industry: 'Technology',
      size: '50-100',
      country: 'US',
      ownerId: employer._id,
      employees: workers.map(w => w._id)
    });

    // Update users with company reference
    await User.updateOne({ _id: employer._id }, { companyId: company._id });
    await User.updateMany(
      { _id: { $in: workers.map(w => w._id) } },
      { companyId: company._id }
    );

    console.log('🏢 Created sample company');

    // Create sample payrolls
    const payrolls = await Payroll.create([
      {
        companyId: company._id,
        employerId: employer._id,
        title: 'December 2024 Salaries',
        description: 'Monthly salary payment',
        totalAmount: 15000,
        currency: 'USDC',
        status: 'completed',
        scheduledDate: new Date('2024-12-01'),
        employees: [
          { userId: workers[0]._id, amount: 5000, status: 'completed' },
          { userId: workers[1]._id, amount: 4500, status: 'completed' },
          { userId: workers[2]._id, amount: 5500, status: 'completed' }
        ],
        processedAt: new Date('2024-12-01')
      },
      {
        companyId: company._id,
        employerId: employer._id,
        title: 'January 2025 Salaries',
        description: 'Monthly salary payment',
        totalAmount: 15500,
        currency: 'USDC',
        status: 'scheduled',
        scheduledDate: new Date('2025-01-01'),
        employees: [
          { userId: workers[0]._id, amount: 5200, status: 'pending' },
          { userId: workers[1]._id, amount: 4800, status: 'pending' },
          { userId: workers[2]._id, amount: 5500, status: 'pending' }
        ]
      },
      {
        companyId: company._id,
        employerId: employer._id,
        title: 'Holiday Bonus 2024',
        description: 'Year-end bonus payments',
        totalAmount: 6000,
        currency: 'USDC',
        status: 'draft',
        scheduledDate: new Date('2024-12-25'),
        employees: [
          { userId: workers[0]._id, amount: 2000, status: 'pending' },
          { userId: workers[1]._id, amount: 2000, status: 'pending' },
          { userId: workers[2]._id, amount: 2000, status: 'pending' }
        ]
      }
    ]);

    console.log('💰 Created sample payrolls');

    console.log(`
🎉 MongoDB Seed Completed Successfully!
┌─────────────────────────────────────────────────┐
│  Created:                                       │
│  • 1 Employer: employer@paywallet.dev          │
│  • 3 Workers: alice@, bob@, carol@paywallet.dev│
│  • 1 Company: TechCorp Inc                     │
│  • 3 Payrolls: Dec completed, Jan scheduled    │
│  • Password for all: password123               │
└─────────────────────────────────────────────────┘
    `);

  } catch (error) {
    console.error('💥 Seed failed:', error);
  } finally {
    await disconnectDB();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
