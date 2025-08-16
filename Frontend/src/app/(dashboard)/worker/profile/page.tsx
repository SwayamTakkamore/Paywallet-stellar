'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '@/store';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  company: string;
  position: string;
  department: string;
  startDate: string;
  walletAddress: string;
  bankAccount: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize profile with real user data
  useEffect(() => {
    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '', // These fields can be filled later or fetched from a more detailed profile API
        address: '',
        city: '',
        country: '',
        postalCode: '',
        company: '',
        position: '',
        department: '',
        startDate: user.createdAt,
        walletAddress: user.walletAddress || '',
        bankAccount: '',
        emergencyContact: '',
        emergencyPhone: ''
      };
      setProfile(userProfile);
    }
  }, [user]);

  const updateProfile = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile(prev => prev ? { ...prev, [field]: value } : null);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically save to API
      console.log('Saving profile:', profile);
      setHasChanges(false);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        company: '',
        position: '',
        department: '',
        startDate: user.createdAt,
        walletAddress: user.walletAddress || '',
        bankAccount: '',
        emergencyContact: '',
        emergencyPhone: ''
      };
      setProfile(userProfile);
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  // Show loading if profile is not loaded yet
  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={!hasChanges || saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Picture and Basic Info */}
      <Card className="p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.position}</p>
            <p className="text-sm text-gray-500">{profile.department} • {profile.company}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Employee Since</p>
            <p className="text-sm text-gray-600">
              {new Date(profile.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => updateProfile('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => updateProfile('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.address}
                onChange={(e) => updateProfile('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.city}
                onChange={(e) => updateProfile('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.postalCode}
                onChange={(e) => updateProfile('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.postalCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            {isEditing ? (
              <select
                value={profile.country}
                onChange={(e) => updateProfile('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            ) : (
              <p className="text-gray-900">{profile.country}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Employment Information */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Building className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <p className="text-gray-900">{profile.company}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <p className="text-gray-900">{profile.position}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <p className="text-gray-900">{profile.department}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-gray-900">
                {new Date(profile.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Financial Information */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Building className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address
            </label>
            <p className="text-gray-900 font-mono text-sm">{profile.walletAddress}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account
            </label>
            <p className="text-gray-900">{profile.bankAccount}</p>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Phone className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.emergencyContact}
                onChange={(e) => updateProfile('emergencyContact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.emergencyContact}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.emergencyPhone}
                onChange={(e) => updateProfile('emergencyPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.emergencyPhone}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
