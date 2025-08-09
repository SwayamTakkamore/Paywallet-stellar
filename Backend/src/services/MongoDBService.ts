/**
 * MongoDB Service Layer
 * Handles all database operations for PayWallet
 */

import { User, Company, Payroll, Transaction, Wallet, IUser, ICompany, IPayroll } from '../models/mongodb/schemas';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

export class MongoDBService {
  // User Operations
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Hash password before saving
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    const user = new User(userData);
    return await user.save();
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email, isActive: true }).populate('companyId');
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).populate('companyId');
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Company Operations
  static async createCompany(companyData: Partial<ICompany>): Promise<ICompany> {
    const company = new Company(companyData);
    return await company.save();
  }

  static async getCompanyById(companyId: string): Promise<ICompany | null> {
    return await Company.findById(companyId).populate('employees ownerId');
  }

  static async getCompaniesByOwner(ownerId: string): Promise<ICompany[]> {
    return await Company.find({ ownerId, isActive: true });
  }

  static async addEmployeeToCompany(companyId: string, employeeId: string): Promise<ICompany | null> {
    return await Company.findByIdAndUpdate(
      companyId,
      { $addToSet: { employees: employeeId } },
      { new: true }
    );
  }

  // Payroll Operations
  static async createPayroll(payrollData: Partial<IPayroll>): Promise<IPayroll> {
    const payroll = new Payroll(payrollData);
    return await payroll.save();
  }

  static async getPayrollById(payrollId: string): Promise<IPayroll | null> {
    return await Payroll.findById(payrollId)
      .populate('companyId employerId')
      .populate('employees.userId');
  }

  static async getPayrollsByCompany(companyId: string, limit = 50): Promise<IPayroll[]> {
    return await Payroll.find({ companyId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('employerId', 'firstName lastName email');
  }

  static async updatePayrollStatus(payrollId: string, status: string, additionalData?: any): Promise<IPayroll | null> {
    const updateData: any = { status };
    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    return await Payroll.findByIdAndUpdate(payrollId, updateData, { new: true });
  }

  // Transaction Operations
  static async createTransaction(transactionData: any): Promise<any> {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  static async getTransactionsByUser(userId: string, limit = 100): Promise<any[]> {
    return await Transaction.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('fromUserId toUserId', 'firstName lastName email');
  }

  static async updateTransactionStatus(transactionId: string, status: string, stellarTxHash?: string): Promise<any> {
    const updateData: any = { status };
    if (stellarTxHash) {
      updateData.stellarTxHash = stellarTxHash;
    }

    return await Transaction.findByIdAndUpdate(transactionId, updateData, { new: true });
  }

  // Wallet Operations
  static async createWallet(walletData: any): Promise<any> {
    const wallet = new Wallet(walletData);
    return await wallet.save();
  }

  static async getWalletByUserId(userId: string): Promise<any> {
    return await Wallet.findOne({ userId, isActive: true });
  }

  static async updateWalletBalance(userId: string, currency: string, amount: number): Promise<any> {
    return await Wallet.findOneAndUpdate(
      { userId, 'balance.currency': currency },
      { 
        $set: { 
          'balance.$.amount': amount,
          'balance.$.lastUpdated': new Date()
        }
      },
      { new: true }
    );
  }

  // Analytics Operations
  static async getCompanyStats(companyId: string): Promise<any> {
    const [employeeCount, payrollCount, totalPaid, recentTransactions] = await Promise.all([
      User.countDocuments({ companyId, role: 'worker', isActive: true }),
      Payroll.countDocuments({ companyId }),
      Payroll.aggregate([
        { $match: { companyId: new Types.ObjectId(companyId), status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Transaction.find({ 
        $or: [
          { fromUserId: { $in: await User.find({ companyId }).distinct('_id') } },
          { toUserId: { $in: await User.find({ companyId }).distinct('_id') } }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('fromUserId toUserId', 'firstName lastName')
    ]);

    return {
      employeeCount,
      payrollCount,
      totalPaid: totalPaid[0]?.total || 0,
      recentTransactions
    };
  }

  // Search Operations
  static async searchUsers(query: string, companyId?: string): Promise<IUser[]> {
    const searchRegex = new RegExp(query, 'i');
    const matchCriteria: any = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ],
      isActive: true
    };

    if (companyId) {
      matchCriteria.companyId = companyId;
    }

    return await User.find(matchCriteria).limit(20);
  }

  // Utility Methods
  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateObjectId(): string {
    return new Types.ObjectId().toString();
  }
}

export default MongoDBService;
