'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Wallet, Globe, Eye, EyeOff, Save } from 'lucide-react';

interface SettingsData {
  notifications: {
    payrollAlerts: boolean;
    paymentFailures: boolean;
    newEmployees: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };
  wallet: {
    autoApprove: boolean;
    dailyLimit: number;
    requireConfirmation: boolean;
  };
  general: {
    timezone: string;
    currency: string;
    language: string;
  };
}

const mockSettings: SettingsData = {
  notifications: {
    payrollAlerts: true,
    paymentFailures: true,
    newEmployees: false,
    systemUpdates: true
  },
  security: {
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: 30
  },
  wallet: {
    autoApprove: false,
    dailyLimit: 50000,
    requireConfirmation: true
  },
  general: {
    timezone: 'UTC-5',
    currency: 'USD',
    language: 'English'
  }
};

export default function EmployerSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(mockSettings);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateNotificationSetting = (key: keyof SettingsData['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateSecuritySetting = (key: keyof SettingsData['security'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateWalletSetting = (key: keyof SettingsData['wallet'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      wallet: { ...prev.wallet, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateGeneralSetting = (key: keyof SettingsData['general'], value: string) => {
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
              <p className="font-medium text-gray-900">Payroll Processing Alerts</p>
              <p className="text-sm text-gray-600">Get notified when payroll is processed</p>
            </div>
            <Switch
              checked={settings.notifications.payrollAlerts}
              onCheckedChange={(checked) => updateNotificationSetting('payrollAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Payment Failures</p>
              <p className="text-sm text-gray-600">Alert for failed payment transactions</p>
            </div>
            <Switch
              checked={settings.notifications.paymentFailures}
              onCheckedChange={(checked) => updateNotificationSetting('paymentFailures', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">New Employee Registrations</p>
              <p className="text-sm text-gray-600">Notify when new employees join</p>
            </div>
            <Switch
              checked={settings.notifications.newEmployees}
              onCheckedChange={(checked) => updateNotificationSetting('newEmployees', checked)}
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
          <h3 className="text-lg font-semibold text-gray-900">Wallet & Payments</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-approve Payments</p>
              <p className="text-sm text-gray-600">Automatically approve routine payments</p>
            </div>
            <Switch
              checked={settings.wallet.autoApprove}
              onCheckedChange={(checked) => updateWalletSetting('autoApprove', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Daily Payment Limit</p>
              <p className="text-sm text-gray-600">Maximum amount per day</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">$</span>
              <input
                type="number"
                value={settings.wallet.dailyLimit}
                onChange={(e) => updateWalletSetting('dailyLimit', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Require Payment Confirmation</p>
              <p className="text-sm text-gray-600">Manual confirmation for all payments</p>
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
              <p className="text-sm text-gray-600">Your local timezone for scheduling</p>
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
              <p className="font-medium text-gray-900">Default Currency</p>
              <p className="text-sm text-gray-600">Primary currency for payments</p>
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

      {/* API Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">API Access</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-900 mb-2">API Key</p>
            <div className="flex items-center space-x-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'Configure Stripe key in .env.local'}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline">
                Regenerate
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Use this key to integrate with the PayWallet API
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
