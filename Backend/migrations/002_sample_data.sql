/**
 * Sample Data Migration
 * Inserts test data for development and testing
 */

-- Sample admin user
INSERT INTO users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    stellar_public_key,
    kyc_status,
    is_active,
    email_verified
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@paywallet.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: secret
    'Admin',
    'User',
    'admin',
    'GADMINXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'approved',
    true,
    true
);

-- Sample employer user
INSERT INTO users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    stellar_public_key,
    kyc_status,
    is_active,
    email_verified
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'employer@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'John',
    'Employer',
    'employer',
    'GEMPLOYERXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'approved',
    true,
    true
);

-- Sample worker users
INSERT INTO users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    stellar_public_key,
    kyc_status,
    is_active,
    email_verified
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440002',
    'alice@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Alice',
    'Worker',
    'worker',
    'GALICEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'approved',
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'bob@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Bob',
    'Worker',
    'worker',
    'GBOBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'approved',
    true,
    true
);

-- Sample company
INSERT INTO companies (
    id,
    owner_id,
    company_name,
    company_type,
    tax_id,
    address,
    country,
    industry,
    website,
    stellar_account,
    escrow_account,
    is_verified
) VALUES (
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'TechCorp Inc.',
    'LLC',
    '12-3456789',
    '123 Tech Street, Silicon Valley, CA 94000',
    'US',
    'Technology',
    'https://techcorp.example.com',
    'GTECHCORPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'GESCROWTECHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    true
);

-- Sample employees
INSERT INTO employees (
    id,
    company_id,
    user_id,
    employee_id,
    first_name,
    last_name,
    email,
    position,
    department,
    salary,
    currency,
    stellar_address,
    hire_date,
    employment_status,
    payment_schedule
) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'EMP001',
    'Alice',
    'Worker',
    'alice@example.com',
    'Software Engineer',
    'Engineering',
    4200.00,
    'USDC',
    'GALICEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '2024-01-15',
    'active',
    'monthly'
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    'EMP002',
    'Bob',
    'Worker',
    'bob@example.com',
    'Product Manager',
    'Product',
    3800.00,
    'USDC',
    'GBOBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    '2024-02-01',
    'active',
    'monthly'
);

-- Sample payroll
INSERT INTO payrolls (
    id,
    title,
    description,
    company_id,
    employer_id,
    contract_id,
    escrow_account,
    total_amount,
    funded_amount,
    asset,
    status,
    schedule_type,
    schedule_data,
    release_date,
    tx_hash,
    metadata
) VALUES (
    '880e8400-e29b-41d4-a716-446655440000',
    'January 2025 Payroll',
    'Monthly payroll for all employees',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'contract_12345',
    'GESCROWTECHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    8000.00,
    8000.00,
    'USDC',
    'funded',
    'scheduled',
    '{"release_date": "2025-01-31T12:00:00Z"}',
    '2025-01-31 12:00:00',
    'abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234',
    '{"department": "all", "period": "2025-01"}'
);

-- Sample payroll recipients
INSERT INTO payroll_recipients (
    id,
    payroll_id,
    employee_id,
    wallet_address,
    recipient_name,
    recipient_email,
    amount,
    currency,
    status
) VALUES 
(
    '990e8400-e29b-41d4-a716-446655440000',
    '880e8400-e29b-41d4-a716-446655440000',
    '770e8400-e29b-41d4-a716-446655440000',
    'GALICEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'Alice Worker',
    'alice@example.com',
    4200.00,
    'USDC',
    'pending'
),
(
    '990e8400-e29b-41d4-a716-446655440001',
    '880e8400-e29b-41d4-a716-446655440000',
    '770e8400-e29b-41d4-a716-446655440001',
    'GBOBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'Bob Worker',
    'bob@example.com',
    3800.00,
    'USDC',
    'pending'
);

-- Sample transactions
INSERT INTO transactions (
    id,
    tx_hash,
    tx_type,
    from_address,
    to_address,
    amount,
    asset,
    status,
    ledger_sequence,
    memo_text,
    fee,
    payroll_id,
    user_id,
    company_id,
    processed_at
) VALUES (
    'aa0e8400-e29b-41d4-a716-446655440000',
    'abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234',
    'payroll_funding',
    'GTECHCORPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'GESCROWTECHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    8000.00,
    'USDC',
    'success',
    12345678,
    'Fund January 2025 payroll',
    0.01,
    '880e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP
);
