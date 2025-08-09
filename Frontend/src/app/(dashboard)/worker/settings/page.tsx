'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Wallet, Globe, Eye, EyeOff, Save } from 'lucide-react';

interface WorkerSettingsData {
  notifications: {
    salaryAlerts: boolean;
    withdrawalUpdates: boolean;
    systemUpdates: boolean;
    promotionalEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };
  wallet: {
    autoWithdraw: boolean;
    withdrawalLimit: number;
    requireConfirmation: boolean;
  };
  general: {
    timezone: string;
    currency: string;
    language: string;
  };
}

const mockSettings: WorkerSettingsData = {
  notifications: {
    salaryAlerts: true,
    withdrawalUpdates: true,
    systemUpdates: false,
    promotionalEmails: false
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 60
  },
  wallet: {
    autoWithdraw: false,
    withdrawalLimit: 5000,
    requireConfirmation: true
  },
  general: {
    timezone: 'UTC-5',
    currency: 'USD',
    language: 'English'
  }
};

export default function WorkerSettingsPage() {
  const [settings, setSettings] = useState<WorkerSettingsData>(mockSettings);
  const [showWalletKey, setShowWalletKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateNotificationSetting = (key: keyof WorkerSettingsData['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateSecuritySetting = (key: keyof WorkerSettingsData['security'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateWalletSetting = (key: keyof WorkerSettingsData['wallet'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      wallet: { ...prev.wallet, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateGeneralSetting = (key: keyof WorkerSettingsData['general'], value: string) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to API
    console.log('Saving settings:', settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Notifications Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Salary Payment Alerts</p>
              <p className="text-sm text-gray-600">Get notified when your salary is processed</p>
            </div>
            <Switch
              checked={settings.notifications.salaryAlerts}
              onCheckedChange={(checked) => updateNotificationSetting('salaryAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Withdrawal Updates</p>
              <p className="text-sm text-gray-600">Notifications about withdrawal status</p>
            </div>
            <Switch
              checked={settings.notifications.withdrawalUpdates}
              onCheckedChange={(checked) => updateNotificationSetting('withdrawalUpdates', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">System Updates</p>
              <p className="text-sm text-gray-600">Updates about platform features and maintenance</p>
            </div>
            <Switch
              checked={settings.notifications.systemUpdates}
              onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Promotional Emails</p>
              <p className="text-sm text-gray-600">Marketing emails about new features</p>
            </div>
            <Switch
              checked={settings.notifications.promotionalEmails}
              onCheckedChange={(checked) => updateNotificationSetting('promotionalEmails', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Login Alerts</p>
              <p className="text-sm text-gray-600">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={settings.security.loginAlerts}
              onCheckedChange={(checked) => updateSecuritySetting('loginAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Wallet Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Wallet className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Wallet & Withdrawals</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-withdraw</p>
              <p className="text-sm text-gray-600">Automatically withdraw salary when received</p>
            </div>
            <Switch
              checked={settings.wallet.autoWithdraw}
              onCheckedChange={(checked) => updateWalletSetting('autoWithdraw', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Daily Withdrawal Limit</p>
              <p className="text-sm text-gray-600">Maximum amount per day</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">$</span>
              <input
                type="number"
                value={settings.wallet.withdrawalLimit}
                onChange={(e) => updateWalletSetting('withdrawalLimit', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Require Withdrawal Confirmation</p>
              <p className="text-sm text-gray-600">Manual confirmation for all withdrawals</p>
            </div>
            <Switch
              checked={settings.wallet.requireConfirmation}
              onCheckedChange={(checked) => updateWalletSetting('requireConfirmation', checked)}
            />
          </div>
        </div>
      </Card>

      {/* General Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">General</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Timezone</p>
              <p className="text-sm text-gray-600">Your local timezone</p>
            </div>
            <select
              value={settings.general.timezone}
              onChange={(e) => updateGeneralSetting('timezone', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">GMT (UTC+0)</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Preferred Currency</p>
              <p className="text-sm text-gray-600">Display currency for amounts</p>
            </div>
            <select
              value={settings.general.currency}
              onChange={(e) => updateGeneralSetting('currency', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="USDC">USDC - USD Coin</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Language</p>
              <p className="text-sm text-gray-600">Interface language</p>
            </div>
            <select
              value={settings.general.language}
              onChange={(e) => updateGeneralSetting('language', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Wallet Information */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Wallet Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-900 mb-2">Wallet Address</p>
            <div className="flex items-center space-x-2">
              <input
                type={showWalletKey ? 'text' : 'password'}
                value="Connect wallet to display address"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={() => setShowWalletKey(!showWalletKey)}
              >
                {showWalletKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Your Stellar wallet address for receiving payments
            </p>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Keep your wallet private key secure. Never share it with anyone.
            </p>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Download Account Data</p>
              <p className="text-sm text-gray-600">Export all your account information</p>
            </div>
            <Button variant="outline">
              Download
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Deactivate Account</p>
              <p className="text-sm text-gray-600">Temporarily disable your account</p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Deactivate
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
