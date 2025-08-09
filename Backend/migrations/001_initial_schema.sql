/**
 * Database Migration: Initial Schema
 * Creates all core tables for PayWallet backend
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (both employers and workers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('employer', 'worker', 'admin')),
    stellar_public_key VARCHAR(56), -- Stellar public key format: G...
    stellar_secret_key_encrypted TEXT, -- Encrypted secret key
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'approved', 'rejected')),
    kyc_submitted_at TIMESTAMP,
    kyc_approved_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies/Employers table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(50),
    tax_id VARCHAR(50),
    address TEXT,
    country VARCHAR(2), -- ISO country code
    industry VARCHAR(100),
    website VARCHAR(255),
    stellar_account VARCHAR(56), -- Company's Stellar account
    escrow_account VARCHAR(56), -- Default escrow account for payrolls
    settings JSONB DEFAULT '{}', -- Company-specific settings
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table (workers associated with companies)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- If user account exists
    employee_id VARCHAR(50) NOT NULL, -- Company's internal employee ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    position VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USDC',
    stellar_address VARCHAR(56) NOT NULL, -- Where to send payments
    hire_date DATE,
    employment_status VARCHAR(20) DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'terminated')),
    payment_schedule VARCHAR(20) DEFAULT 'monthly' CHECK (payment_schedule IN ('weekly', 'biweekly', 'monthly')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, employee_id)
);

-- Payrolls table (main payroll escrows)
CREATE TABLE payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contract_id VARCHAR(100), -- Soroban contract ID
    escrow_account VARCHAR(56), -- Stellar escrow account
    total_amount DECIMAL(18,6) NOT NULL,
    funded_amount DECIMAL(18,6) DEFAULT 0,
    asset VARCHAR(50) DEFAULT 'USDC', -- Asset code (USDC, XLM, etc.)
    asset_issuer VARCHAR(56), -- Asset issuer address (for non-native assets)
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN (
        'created', 'funded', 'scheduled', 'releasing', 'released', 'partial', 'cancelled', 'failed'
    )),
    schedule_type VARCHAR(20) NOT NULL CHECK (schedule_type IN ('immediate', 'scheduled', 'recurring', 'streaming')),
    schedule_data JSONB DEFAULT '{}', -- Schedule configuration
    release_date TIMESTAMP, -- For scheduled releases
    stream_rate DECIMAL(18,6), -- Tokens per second for streaming
    stream_duration INTEGER, -- Stream duration in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    funded_at TIMESTAMP,
    released_at TIMESTAMP,
    tx_hash VARCHAR(64), -- Creation transaction hash
    funding_tx_hash VARCHAR(64), -- Funding transaction hash
    release_tx_hash VARCHAR(64), -- Release transaction hash
    contract_tx_hash VARCHAR(64), -- Soroban contract transaction hash
    metadata JSONB DEFAULT '{}'
);

-- Payroll recipients table (individual payments within a payroll)
CREATE TABLE payroll_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    wallet_address VARCHAR(56) NOT NULL, -- Stellar address
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    amount DECIMAL(18,6) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USDC',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMP,
    tx_hash VARCHAR(64), -- Individual payment transaction hash
    failure_reason TEXT, -- If payment failed
    retry_count INTEGER DEFAULT 0,
    stream_id BIGINT, -- Associated stream ID (for streaming payments)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (all financial transactions)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tx_hash VARCHAR(64) UNIQUE NOT NULL, -- Stellar transaction hash
    tx_type VARCHAR(30) NOT NULL CHECK (tx_type IN (
        'payroll_funding', 'payroll_release', 'withdrawal', 'deposit', 'fee', 'refund', 'stream_payment'
    )),
    from_address VARCHAR(56) NOT NULL,
    to_address VARCHAR(56) NOT NULL,
    amount DECIMAL(18,6) NOT NULL,
    asset VARCHAR(50) NOT NULL,
    asset_issuer VARCHAR(56),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    ledger_sequence BIGINT, -- Stellar ledger sequence
    memo_text TEXT,
    memo_hash VARCHAR(64),
    fee DECIMAL(18,6), -- Transaction fee
    payroll_id UUID REFERENCES payrolls(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Payment schedules table (for recurring payrolls)
CREATE TABLE payment_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    schedule_type VARCHAR(20) NOT NULL CHECK (schedule_type IN ('recurring', 'streaming')),
    frequency VARCHAR(20) CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_execution TIMESTAMP,
    payroll_template JSONB NOT NULL, -- Template for creating payrolls
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    max_executions INTEGER, -- Null for unlimited
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streaming payments table
CREATE TABLE streams (
    id BIGSERIAL PRIMARY KEY,
    from_address VARCHAR(56) NOT NULL,
    to_address VARCHAR(56) NOT NULL,
    rate_per_second DECIMAL(18,6) NOT NULL,
    total_amount DECIMAL(18,6) NOT NULL,
    amount_withdrawn DECIMAL(18,6) DEFAULT 0,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    last_withdrawal TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    contract_stream_id BIGINT, -- ID in the smart contract
    payroll_id UUID REFERENCES payrolls(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC documents table
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'passport', 'drivers_license', 'national_id', 'proof_of_address', 'bank_statement', 'business_registration'
    )),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- Encrypted file storage path
    file_hash VARCHAR(64), -- For integrity verification
    file_size BIGINT,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table (for compliance and security)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- Action performed
    resource_type VARCHAR(50) NOT NULL, -- Type of resource (payroll, user, etc.)
    resource_id UUID, -- ID of the affected resource
    details JSONB, -- Additional details about the action
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'payroll_funded', 'payment_received', 'kyc_approved', 'kyc_rejected', 
        'payroll_released', 'system_maintenance', 'security_alert'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks table (for external integrations)
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    events TEXT[] NOT NULL, -- Array of event types to listen for
    secret VARCHAR(100) NOT NULL, -- For webhook signature verification
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stellar_key ON users(stellar_public_key);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);

CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_companies_verified ON companies(is_verified);

CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_employees_stellar ON employees(stellar_address);

CREATE INDEX idx_payrolls_company ON payrolls(company_id);
CREATE INDEX idx_payrolls_employer ON payrolls(employer_id);
CREATE INDEX idx_payrolls_status ON payrolls(status);
CREATE INDEX idx_payrolls_created_at ON payrolls(created_at);
CREATE INDEX idx_payrolls_contract ON payrolls(contract_id);

CREATE INDEX idx_payroll_recipients_payroll ON payroll_recipients(payroll_id);
CREATE INDEX idx_payroll_recipients_employee ON payroll_recipients(employee_id);
CREATE INDEX idx_payroll_recipients_status ON payroll_recipients(status);
CREATE INDEX idx_payroll_recipients_wallet ON payroll_recipients(wallet_address);

CREATE INDEX idx_transactions_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_type ON transactions(tx_type);
CREATE INDEX idx_transactions_from ON transactions(from_address);
CREATE INDEX idx_transactions_to ON transactions(to_address);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_payroll ON transactions(payroll_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);

CREATE INDEX idx_streams_from ON streams(from_address);
CREATE INDEX idx_streams_to ON streams(to_address);
CREATE INDEX idx_streams_active ON streams(is_active);
CREATE INDEX idx_streams_payroll ON streams(payroll_id);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payrolls_updated_at BEFORE UPDATE ON payrolls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_recipients_updated_at BEFORE UPDATE ON payroll_recipients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streams_updated_at BEFORE UPDATE ON streams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON kyc_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
