'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Wallet, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface WithdrawalData {
  availableBalance: number;
  pendingWithdrawals: number;
  totalWithdrawn: number;
  currency: string;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  requestDate: string;
  completedDate?: string;
  transactionHash?: string;
  method: 'bank' | 'crypto' | 'card';
}

const mockWithdrawalData: WithdrawalData = {
  availableBalance: 3780,
  pendingWithdrawals: 0,
  totalWithdrawn: 15200,
  currency: 'USDC'
};

const mockWithdrawalHistory: WithdrawalHistory[] = [
  {
    id: '1',
    amount: 2000,
    currency: 'USDC',
    status: 'completed',
    requestDate: '2025-01-10',
    completedDate: '2025-01-11',
    transactionHash: '0x1234...abcd',
    method: 'bank'
  },
  {
    id: '2',
    amount: 1500,
    currency: 'USDC',
    status: 'completed',
    requestDate: '2024-12-20',
    completedDate: '2024-12-21',
    transactionHash: '0x5678...efgh',
    method: 'crypto'
  },
  {
    id: '3',
    amount: 3000,
    currency: 'USDC',
    status: 'completed',
    requestDate: '2024-11-25',
    completedDate: '2024-11-26',
    transactionHash: '0x9abc...ijkl',
    method: 'bank'
  }
];

export default function WithdrawPage() {
  const [withdrawalData] = useState<WithdrawalData>(mockWithdrawalData);
  const [withdrawalHistory] = useState<WithdrawalHistory[]>(mockWithdrawalHistory);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto' | 'card'>('bank');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

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

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'bank':
        return 'bg-blue-100 text-blue-800';
      case 'crypto':
        return 'bg-purple-100 text-purple-800';
      case 'card':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (parseFloat(withdrawAmount) > withdrawalData.availableBalance) {
      alert('Insufficient balance');
      return;
    }
    
    // Here you would typically call an API
    console.log('Withdrawing:', withdrawAmount, 'via', withdrawMethod);
    setShowWithdrawForm(false);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
          <p className="text-gray-600">Transfer your earnings to your preferred account</p>
        </div>
        <Button 
          onClick={() => setShowWithdrawForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <ArrowDownToLine className="w-4 h-4 mr-2" />
          Withdraw Funds
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${withdrawalData.availableBalance.toLocaleString()} {withdrawalData.currency}
              </p>
              <p className="text-xs text-green-600">Ready to withdraw</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900">
                ${withdrawalData.pendingWithdrawals.toLocaleString()} {withdrawalData.currency}
              </p>
              <p className="text-xs text-gray-600">Processing</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowDownToLine className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
              <p className="text-2xl font-bold text-gray-900">
                ${withdrawalData.totalWithdrawn.toLocaleString()} {withdrawalData.currency}
              </p>
              <p className="text-xs text-gray-600">All time</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawForm && (
        <Card className="p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">New Withdrawal</h3>
            <Button 
              variant="outline" 
              onClick={() => setShowWithdrawForm(false)}
            >
              Cancel
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  max={withdrawalData.availableBalance}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {withdrawalData.currency}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ${withdrawalData.availableBalance.toLocaleString()} {withdrawalData.currency}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Method
              </label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="bank">Bank Transfer</option>
                <option value="crypto">Crypto Wallet</option>
                <option value="card">Debit Card</option>
              </select>
            </div>

            {/* Method-specific information */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2" />
                <div className="text-sm text-blue-700">
                  {withdrawMethod === 'bank' && (
                    <>
                      <p className="font-medium">Bank Transfer</p>
                      <p>Processing time: 1-3 business days. Fee: $2.50</p>
                    </>
                  )}
                  {withdrawMethod === 'crypto' && (
                    <>
                      <p className="font-medium">Crypto Wallet</p>
                      <p>Processing time: 10-30 minutes. Network fee applies.</p>
                    </>
                  )}
                  {withdrawMethod === 'card' && (
                    <>
                      <p className="font-medium">Debit Card</p>
                      <p>Processing time: Instant. Fee: 1.5% of amount</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleWithdraw}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Confirm Withdrawal
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setWithdrawAmount(withdrawalData.availableBalance.toString());
                }}
              >
                Max
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Withdrawal History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Withdrawal History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawalHistory.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${withdrawal.amount.toLocaleString()} {withdrawal.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(withdrawal.method)}`}>
                      {withdrawal.method === 'bank' && 'Bank Transfer'}
                      {withdrawal.method === 'crypto' && 'Crypto Wallet'}
                      {withdrawal.method === 'card' && 'Debit Card'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                      <span className="ml-1 capitalize">{withdrawal.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {withdrawal.completedDate 
                        ? new Date(withdrawal.completedDate).toLocaleDateString()
                        : '-'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal.transactionHash ? (
                      <div className="text-sm text-blue-600 hover:text-blue-900 cursor-pointer font-mono">
                        {withdrawal.transactionHash}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
