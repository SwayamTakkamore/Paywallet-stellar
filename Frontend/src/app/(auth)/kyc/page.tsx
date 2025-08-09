'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, Select } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

export default function KYCPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Identity Verification
    idType: 'passport',
    idNumber: '',
    idFrontFile: null as File | null,
    idBackFile: null as File | null,
    
    // Business Information (for employers)
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessRegistration: '',
    taxId: '',
    
    // Financial Information
    sourceOfFunds: '',
    expectedTransactionVolume: '',
    bankAccountNumber: '',
    bankName: '',
    routingNumber: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API call for KYC submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to appropriate dashboard based on user type
      const userType = new URLSearchParams(window.location.search).get('type') || 'worker';
      if (userType === 'employer') {
        router.push('/employer');
      } else {
        router.push('/worker');
      }
    } catch (error) {
      console.error('KYC submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Information', description: 'Basic personal details' },
    { number: 2, title: 'Identity Verification', description: 'Upload ID documents' },
    { number: 3, title: 'Business Information', description: 'Company details (employers only)' },
    { number: 4, title: 'Financial Information', description: 'Banking and transaction details' },
  ];

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in-50 duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="absolute left-4 top-4 text-green-700 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-green-900">Complete Your Verification</h1>
          <p className="mt-2 text-green-700">
            We need to verify your identity to comply with financial regulations and ensure platform security.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-in slide-in-from-left-6 duration-700 delay-300">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-105
                  ${currentStep >= step.number 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-green-300 text-green-600'}`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-24 mx-4 transition-colors duration-500
                    ${currentStep > step.number ? 'bg-green-600' : 'bg-green-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map(step => (
              <div key={step.number} className="text-center max-w-32">
                <div className="text-sm font-medium text-green-900">{step.title}</div>
                <div className="text-xs text-green-600">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-green-200 animate-in slide-in-from-bottom-6 duration-700 delay-500">
          <CardHeader>
            <CardTitle className="text-green-900">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-green-700">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 slide-in-from-right-4 duration-500">
                <FormField label="Date of Birth" required>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </FormField>
                
                <FormField label="Nationality" required>
                  <Select
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    options={[
                      { value: "", label: "Select nationality" },
                      { value: "US", label: "United States" },
                      { value: "CA", label: "Canada" },
                      { value: "UK", label: "United Kingdom" },
                      { value: "AU", label: "Australia" },
                      { value: "DE", label: "Germany" },
                      { value: "FR", label: "France" },
                      { value: "JP", label: "Japan" },
                      { value: "SG", label: "Singapore" }
                    ]}
                  />
                </FormField>
                
                <FormField label="Phone Number" required>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormField>
                
                <FormField label="Address" required>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                </FormField>
                
                <FormField label="City" required>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </FormField>
                
                <FormField label="State/Province" required>
                  <Input
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </FormField>
                
                <FormField label="ZIP/Postal Code" required>
                  <Input
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </FormField>
                
                <FormField label="Country" required>
                  <Select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    options={[
                      { value: "", label: "Select country" },
                      { value: "US", label: "United States" },
                      { value: "CA", label: "Canada" },
                      { value: "UK", label: "United Kingdom" },
                      { value: "AU", label: "Australia" }
                    ]}
                  />
                </FormField>
              </div>
            )}

            {/* Step 2: Identity Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <FormField label="ID Type" required>
                  <Select
                    value={formData.idType}
                    onChange={(e) => handleInputChange('idType', e.target.value)}
                    options={[
                      { value: "passport", label: "Passport" },
                      { value: "drivers_license", label: "Driver's License" },
                      { value: "national_id", label: "National ID Card" }
                    ]}
                  />
                </FormField>
                
                <FormField label="ID Number" required>
                  <Input
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    placeholder="Enter your ID number"
                  />
                </FormField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-900">
                      ID Front Photo <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
                      <div className="text-sm text-green-700">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        PNG, JPG up to 10MB
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('idFrontFile', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                    {formData.idFrontFile && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ {formData.idFrontFile.name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-900">
                      ID Back Photo <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
                      <div className="text-sm text-green-700">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        PNG, JPG up to 10MB
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('idBackFile', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                    {formData.idBackFile && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ {formData.idBackFile.name}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div className="text-sm text-green-700">
                      <div className="font-medium mb-1">Document Requirements:</div>
                      <ul className="text-xs space-y-1">
                        <li>• Documents must be clear and readable</li>
                        <li>• All four corners must be visible</li>
                        <li>• Documents must be current and valid</li>
                        <li>• No screenshots or photocopies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Information (for employers) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-green-700">
                    <strong>Note:</strong> Business information is required for employer accounts to process payroll payments.
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Business Name" required>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Your Company Ltd."
                    />
                  </FormField>
                  
                  <FormField label="Business Type" required>
                    <Select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      options={[
                        { value: "", label: "Select business type" },
                        { value: "corporation", label: "Corporation" },
                        { value: "llc", label: "LLC" },
                        { value: "partnership", label: "Partnership" },
                        { value: "sole_proprietorship", label: "Sole Proprietorship" },
                        { value: "nonprofit", label: "Nonprofit" }
                      ]}
                    />
                  </FormField>
                  
                  <FormField label="Business Address" required>
                    <Input
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      placeholder="Business street address"
                    />
                  </FormField>
                  
                  <FormField label="Business Registration Number">
                    <Input
                      value={formData.businessRegistration}
                      onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                      placeholder="Registration/License number"
                    />
                  </FormField>
                  
                  <FormField label="Tax ID (EIN)" required>
                    <Input
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      placeholder="XX-XXXXXXX"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Step 4: Financial Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <FormField label="Source of Funds" required>
                  <Select
                    value={formData.sourceOfFunds}
                    onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)}
                    options={[
                      { value: "", label: "Select source" },
                      { value: "salary", label: "Salary/Employment" },
                      { value: "business_income", label: "Business Income" },
                      { value: "investments", label: "Investments" },
                      { value: "savings", label: "Savings" },
                      { value: "inheritance", label: "Inheritance" },
                      { value: "other", label: "Other" }
                    ]}
                  />
                </FormField>
                
                <FormField label="Expected Monthly Transaction Volume" required>
                  <Select
                    value={formData.expectedTransactionVolume}
                    onChange={(e) => handleInputChange('expectedTransactionVolume', e.target.value)}
                    options={[
                      { value: "", label: "Select range" },
                      { value: "under_10k", label: "Under $10,000" },
                      { value: "10k_50k", label: "$10,000 - $50,000" },
                      { value: "50k_100k", label: "$50,000 - $100,000" },
                      { value: "100k_500k", label: "$100,000 - $500,000" },
                      { value: "over_500k", label: "Over $500,000" }
                    ]}
                  />
                </FormField>
                
                <div className="border-t border-green-200 pt-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Bank Name" required>
                      <Input
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        placeholder="Bank of America"
                      />
                    </FormField>
                    
                    <FormField label="Account Number" required>
                      <Input
                        value={formData.bankAccountNumber}
                        onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                        placeholder="Account number"
                        type="password"
                      />
                    </FormField>
                    
                    <FormField label="Routing Number" required>
                      <Input
                        value={formData.routingNumber}
                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                        placeholder="9-digit routing number"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 animate-in slide-in-from-bottom-4 duration-700 delay-700">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-green-300 text-green-700 hover:bg-green-50 hover:scale-105 transition-all"
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 hover:scale-105 transition-all"
            >
              Skip for now
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all">
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all disabled:hover:scale-100"
              >
                {loading ? 'Submitting...' : 'Complete Verification'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
