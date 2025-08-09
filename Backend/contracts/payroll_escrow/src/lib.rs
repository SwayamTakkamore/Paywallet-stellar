/**
 * PayrollEscrow Smart Contract
 * 
 * A Soroban smart contract for managing payroll escrows with support for:
 * - Creating payroll escrows with multiple recipients
 * - Depositing funds from employers
 * - Releasing payments to recipients (immediate, scheduled, or streaming)
 * - Emergency controls and access management
 * 
 * Security Features:
 * - Only employer or authorized addresses can fund/release
 * - Circuit breaker for emergency stops
 * - Audit events for all critical operations
 */

#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, contractmeta,
    Address, Env, String, Vec, Map, BytesN
};

// Contract metadata
contractmeta!(
    key = "Description",
    val = "PayWallet Payroll Escrow Contract"
);

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Recipient {
    pub address: Address,
    pub amount: u64,
    pub paid: bool,
    pub stream_id: Option<u64>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PayrollStatus {
    Created,
    Funded,
    Releasing,
    Completed,
    Cancelled,
    Paused,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ScheduleType {
    Immediate,
    Scheduled,
    Recurring,
    Streaming,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayrollData {
    pub employer: Address,
    pub recipients: Vec<Recipient>,
    pub total_amount: u64,
    pub deposited_amount: u64,
    pub asset: Address, // Asset contract address (e.g., USDC)
    pub status: PayrollStatus,
    pub schedule_type: ScheduleType,
    pub release_time: u64, // Unix timestamp
    pub created_at: u64,
    pub stream_rate: Option<u64>, // Tokens per second for streaming
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StreamData {
    pub from: Address,
    pub to: Address,
    pub rate_per_sec: u64,
    pub start_time: u64,
    pub end_time: u64,
    pub last_withdrawal: u64,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub active: bool,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotAuthorized = 1,
    PayrollNotFound = 2,
    InsufficientBalance = 3,
    PayrollAlreadyFunded = 4,
    PayrollNotFunded = 5,
    InvalidRecipients = 6,
    PayrollCompleted = 7,
    CircuitBreakerActive = 8,
    StreamNotFound = 9,
    StreamInactive = 10,
    InvalidAmount = 11,
    TooEarly = 12,
}

// Storage keys
const PAYROLL_COUNTER: &str = "PAYROLL_CTR";
const STREAM_COUNTER: &str = "STREAM_CTR";
const CIRCUIT_BREAKER: &str = "BREAKER";
const ADMIN: &str = "ADMIN";

#[contract]
pub struct PayrollEscrowContract;

#[contractimpl]
impl PayrollEscrowContract {
    
    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&CIRCUIT_BREAKER, &false);
        env.storage().instance().set(&PAYROLL_COUNTER, &0u64);
        env.storage().instance().set(&STREAM_COUNTER, &0u64);
    }

    /// Create a new payroll escrow
    /// @param employer: Address of the employer creating the payroll
    /// @param recipients: Vector of recipient addresses and amounts
    /// @param asset: Asset contract address (USDC, XLM, etc.)
    /// @param schedule_type: Type of release schedule
    /// @param release_time: When to release (for scheduled payrolls)
    /// @param stream_rate: Rate for streaming payments (tokens per second)
    pub fn create_payroll(
        env: Env,
        employer: Address,
        recipients: Vec<Recipient>,
        asset: Address,
        schedule_type: ScheduleType,
        release_time: Option<u64>,
        stream_rate: Option<u64>,
    ) -> Result<u64, Error> {
        employer.require_auth();
        
        // Check circuit breaker
        let breaker_active: bool = env.storage().instance().get(&CIRCUIT_BREAKER).unwrap_or(false);
        if breaker_active {
            return Err(Error::CircuitBreakerActive);
        }

        // Validate recipients
        if recipients.is_empty() {
            return Err(Error::InvalidRecipients);
        }

        // Calculate total amount
        let total_amount: u64 = recipients.iter().map(|r| r.amount).sum();
        if total_amount == 0 {
            return Err(Error::InvalidAmount);
        }

        // Get next payroll ID
        let mut counter: u64 = env.storage().instance().get(&PAYROLL_COUNTER).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&PAYROLL_COUNTER, &counter);

        // Create payroll data
        let payroll = PayrollData {
            employer: employer.clone(),
            recipients,
            total_amount,
            deposited_amount: 0,
            asset,
            status: PayrollStatus::Created,
            schedule_type,
            release_time: release_time.unwrap_or(0),
            created_at: env.ledger().timestamp(),
            stream_rate,
        };

        // Store payroll
        env.storage().persistent().set(&counter, &payroll);

        // Emit event
        env.events().publish(
            ("payroll_created",),
            (counter, employer, total_amount)
        );

        Ok(counter)
    }

    /// Deposit funds to a payroll escrow
    /// Only the employer or authorized addresses can deposit
    pub fn deposit(
        env: Env,
        payroll_id: u64,
        from: Address,
        amount: u64,
    ) -> Result<(), Error> {
        from.require_auth();

        let mut payroll: PayrollData = env.storage().persistent()
            .get(&payroll_id)
            .ok_or(Error::PayrollNotFound)?;

        // Verify authorization (employer or authorized depositor)
        if from != payroll.employer {
            return Err(Error::NotAuthorized);
        }

        // Check if already fully funded
        if payroll.deposited_amount >= payroll.total_amount {
            return Err(Error::PayrollAlreadyFunded);
        }

        // Validate amount
        let remaining = payroll.total_amount - payroll.deposited_amount;
        if amount > remaining {
            return Err(Error::InvalidAmount);
        }

        // Update deposited amount
        payroll.deposited_amount += amount;
        
        // Update status if fully funded
        if payroll.deposited_amount >= payroll.total_amount {
            payroll.status = PayrollStatus::Funded;
        }

        // Save updated payroll
        env.storage().persistent().set(&payroll_id, &payroll);

        // Emit event
        env.events().publish(
            ("payroll_deposited",),
            (payroll_id, from, amount, payroll.deposited_amount)
        );

        Ok(())
    }

    /// Release payments to recipients
    /// Can be called by employer or automatically by schedule
    pub fn release_payment(
        env: Env,
        payroll_id: u64,
        caller: Address,
    ) -> Result<(), Error> {
        caller.require_auth();

        let mut payroll: PayrollData = env.storage().persistent()
            .get(&payroll_id)
            .ok_or(Error::PayrollNotFound)?;

        // Verify authorization
        if caller != payroll.employer {
            return Err(Error::NotAuthorized);
        }

        // Check if payroll is funded
        if payroll.status != PayrollStatus::Funded {
            return Err(Error::PayrollNotFunded);
        }

        // Check timing for scheduled releases
        if payroll.schedule_type == ScheduleType::Scheduled {
            if env.ledger().timestamp() < payroll.release_time {
                return Err(Error::TooEarly);
            }
        }

        // Update status
        payroll.status = PayrollStatus::Releasing;
        env.storage().persistent().set(&payroll_id, &payroll);

        // Process payments to recipients
        for (i, recipient) in payroll.recipients.iter().enumerate() {
            if !recipient.paid {
                // In a real implementation, this would transfer tokens
                // For now, we just mark as paid
                let mut updated_recipients = payroll.recipients.clone();
                let mut updated_recipient = updated_recipients.get(i).unwrap().clone();
                updated_recipient.paid = true;
                updated_recipients.set(i, updated_recipient);
                
                payroll.recipients = updated_recipients;

                // Emit payment event
                env.events().publish(
                    ("payment_released",),
                    (payroll_id, recipient.address.clone(), recipient.amount)
                );
            }
        }

        // Mark as completed
        payroll.status = PayrollStatus::Completed;
        env.storage().persistent().set(&payroll_id, &payroll);

        // Emit completion event
        env.events().publish(
            ("payroll_completed",),
            (payroll_id, payroll.total_amount)
        );

        Ok(())
    }

    /// Start a streaming payment
    pub fn start_stream(
        env: Env,
        from: Address,
        to: Address,
        rate_per_sec: u64,
        duration: u64,
        total_amount: u64,
    ) -> Result<u64, Error> {
        from.require_auth();

        if rate_per_sec == 0 || duration == 0 || total_amount == 0 {
            return Err(Error::InvalidAmount);
        }

        // Get next stream ID
        let mut counter: u64 = env.storage().instance().get(&STREAM_COUNTER).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&STREAM_COUNTER, &counter);

        let current_time = env.ledger().timestamp();
        let stream = StreamData {
            from: from.clone(),
            to: to.clone(),
            rate_per_sec,
            start_time: current_time,
            end_time: current_time + duration,
            last_withdrawal: current_time,
            total_deposited: total_amount,
            total_withdrawn: 0,
            active: true,
        };

        // Store stream
        let stream_key = format!("STREAM_{}", counter);
        env.storage().persistent().set(&stream_key, &stream);

        // Emit event
        env.events().publish(
            ("stream_started",),
            (counter, from, to, rate_per_sec, duration)
        );

        Ok(counter)
    }

    /// Withdraw from a stream
    pub fn withdraw_stream(
        env: Env,
        stream_id: u64,
        to: Address,
    ) -> Result<u64, Error> {
        to.require_auth();

        let stream_key = format!("STREAM_{}", stream_id);
        let mut stream: StreamData = env.storage().persistent()
            .get(&stream_key)
            .ok_or(Error::StreamNotFound)?;

        if !stream.active {
            return Err(Error::StreamInactive);
        }

        if to != stream.to {
            return Err(Error::NotAuthorized);
        }

        let current_time = env.ledger().timestamp();
        let time_elapsed = current_time.saturating_sub(stream.last_withdrawal);
        let available_amount = time_elapsed * stream.rate_per_sec;
        
        // Don't exceed total deposited amount
        let max_withdrawable = stream.total_deposited.saturating_sub(stream.total_withdrawn);
        let withdrawal_amount = available_amount.min(max_withdrawable);

        if withdrawal_amount == 0 {
            return Ok(0);
        }

        // Update stream
        stream.total_withdrawn += withdrawal_amount;
        stream.last_withdrawal = current_time;
        
        // Deactivate if fully withdrawn
        if stream.total_withdrawn >= stream.total_deposited {
            stream.active = false;
        }

        env.storage().persistent().set(&stream_key, &stream);

        // Emit event
        env.events().publish(
            ("stream_withdrawn",),
            (stream_id, to, withdrawal_amount)
        );

        Ok(withdrawal_amount)
    }

    /// Cancel a payroll (only employer)
    pub fn cancel_payroll(
        env: Env,
        payroll_id: u64,
        employer: Address,
    ) -> Result<(), Error> {
        employer.require_auth();

        let mut payroll: PayrollData = env.storage().persistent()
            .get(&payroll_id)
            .ok_or(Error::PayrollNotFound)?;

        if employer != payroll.employer {
            return Err(Error::NotAuthorized);
        }

        if payroll.status == PayrollStatus::Completed {
            return Err(Error::PayrollCompleted);
        }

        payroll.status = PayrollStatus::Cancelled;
        env.storage().persistent().set(&payroll_id, &payroll);

        // Emit event
        env.events().publish(
            ("payroll_cancelled",),
            (payroll_id, employer, payroll.deposited_amount)
        );

        Ok(())
    }

    /// Get payroll status and details
    pub fn get_payroll_status(
        env: Env,
        payroll_id: u64,
    ) -> Result<PayrollData, Error> {
        env.storage().persistent()
            .get(&payroll_id)
            .ok_or(Error::PayrollNotFound)
    }

    /// Get stream details
    pub fn get_stream_status(
        env: Env,
        stream_id: u64,
    ) -> Result<StreamData, Error> {
        let stream_key = format!("STREAM_{}", stream_id);
        env.storage().persistent()
            .get(&stream_key)
            .ok_or(Error::StreamNotFound)
    }

    /// Emergency circuit breaker (admin only)
    pub fn toggle_circuit_breaker(
        env: Env,
        admin: Address,
    ) -> Result<bool, Error> {
        admin.require_auth();

        let stored_admin: Address = env.storage().instance()
            .get(&ADMIN)
            .ok_or(Error::NotAuthorized)?;

        if admin != stored_admin {
            return Err(Error::NotAuthorized);
        }

        let current_state: bool = env.storage().instance()
            .get(&CIRCUIT_BREAKER)
            .unwrap_or(false);
        
        let new_state = !current_state;
        env.storage().instance().set(&CIRCUIT_BREAKER, &new_state);

        env.events().publish(
            ("circuit_breaker_toggled",),
            (admin, new_state)
        );

        Ok(new_state)
    }
}
