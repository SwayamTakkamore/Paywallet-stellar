/**
 * PayrollEscrow Contract Tests
 * 
 * Comprehensive test suite covering:
 * - Payroll creation and funding
 * - Payment releases
 * - Streaming payments
 * - Access control
 * - Error conditions
 */

#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation}, Address, Env, IntoVal, Vec};

fn create_test_contract() -> (Env, Address, PayrollEscrowContractClient) {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_address = env.register_contract(None, PayrollEscrowContract);
    let client = PayrollEscrowContractClient::new(&env, &contract_address);
    
    (env, contract_address, client)
}

#[test]
fn test_create_payroll() {
    let (env, _contract_address, client) = create_test_contract();
    
    // Create test addresses
    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let recipient1 = Address::generate(&env);
    let recipient2 = Address::generate(&env);
    let usdc_asset = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Create recipients
    let recipients = Vec::from_array(
        &env,
        [
            Recipient {
                address: recipient1,
                amount: 1000,
                paid: false,
                stream_id: None,
            },
            Recipient {
                address: recipient2,
                amount: 2000,
                paid: false,
                stream_id: None,
            },
        ],
    );
    
    // Create payroll
    let payroll_id = client.create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    assert_eq!(payroll_id, 1);
    
    // Verify payroll was created
    let payroll = client.get_payroll_status(&payroll_id);
    assert_eq!(payroll.employer, employer);
    assert_eq!(payroll.total_amount, 3000);
    assert_eq!(payroll.status, PayrollStatus::Created);
    assert_eq!(payroll.deposited_amount, 0);
}

#[test]
fn test_deposit_and_release() {
    let (env, _contract_address, client) = create_test_contract();
    
    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let recipient = Address::generate(&env);
    let usdc_asset = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Create payroll
    let recipients = Vec::from_array(
        &env,
        [Recipient {
            address: recipient.clone(),
            amount: 1000,
            paid: false,
            stream_id: None,
        }],
    );
    
    let payroll_id = client.create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    // Deposit funds
    client.deposit(&payroll_id, &employer, &1000);
    
    // Verify deposit
    let payroll = client.get_payroll_status(&payroll_id);
    assert_eq!(payroll.deposited_amount, 1000);
    assert_eq!(payroll.status, PayrollStatus::Funded);
    
    // Release payment
    client.release_payment(&payroll_id, &employer);
    
    // Verify release
    let payroll = client.get_payroll_status(&payroll_id);
    assert_eq!(payroll.status, PayrollStatus::Completed);
    assert_eq!(payroll.recipients.get(0).unwrap().paid, true);
}

#[test]
fn test_streaming_payment() {
    let (env, _contract_address, client) = create_test_contract();
    
    let admin = Address::generate(&env);
    let from = Address::generate(&env);
    let to = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Start stream: 10 tokens per second for 100 seconds
    let stream_id = client.start_stream(
        &from,
        &to,
        &10,      // rate per second
        &100,     // duration in seconds
        &1000,    // total amount
    );
    
    assert_eq!(stream_id, 1);
    
    // Verify stream was created
    let stream = client.get_stream_status(&stream_id);
    assert_eq!(stream.from, from);
    assert_eq!(stream.to, to);
    assert_eq!(stream.rate_per_sec, 10);
    assert_eq!(stream.total_deposited, 1000);
    assert_eq!(stream.active, true);
    
    // Simulate time passage and withdrawal
    // Note: In real tests, you'd advance ledger time
    let withdrawn = client.withdraw_stream(&stream_id, &to);
    
    // Verify withdrawal (amount depends on time elapsed in test environment)
    let stream_after = client.get_stream_status(&stream_id);
    assert!(stream_after.total_withdrawn > 0);
}

#[test]
#[should_panic(expected = "Error(NotAuthorized, 1)")]
fn test_unauthorized_deposit() {
    let (env, _contract_address, client) = create_test_contract();
    
    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let unauthorized = Address::generate(&env);
    let recipient = Address::generate(&env);
    let usdc_asset = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Create payroll
    let recipients = Vec::from_array(
        &env,
        [Recipient {
            address: recipient,
            amount: 1000,
            paid: false,
            stream_id: None,
        }],
    );
    
    let payroll_id = client.create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    // Try to deposit from unauthorized address - should panic
    client.deposit(&payroll_id, &unauthorized, &1000);
}

#[test]
#[should_panic(expected = "Error(PayrollNotFunded, 5)")]
fn test_release_unfunded_payroll() {
    let (env, _contract_address, client) = create_test_contract();
    
    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let recipient = Address::generate(&env);
    let usdc_asset = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Create payroll but don't fund it
    let recipients = Vec::from_array(
        &env,
        [Recipient {
            address: recipient,
            amount: 1000,
            paid: false,
            stream_id: None,
        }],
    );
    
    let payroll_id = client.create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    // Try to release without funding - should panic
    client.release_payment(&payroll_id, &employer);
}

#[test]
fn test_cancel_payroll() {
    let (env, _contract_address, client) = create_test_contract();
    
    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let recipient = Address::generate(&env);
    let usdc_asset = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Create and fund payroll
    let recipients = Vec::from_array(
        &env,
        [Recipient {
            address: recipient,
            amount: 1000,
            paid: false,
            stream_id: None,
        }],
    );
    
    let payroll_id = client.create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    client.deposit(&payroll_id, &employer, &1000);
    
    // Cancel payroll
    client.cancel_payroll(&payroll_id, &employer);
    
    // Verify cancellation
    let payroll = client.get_payroll_status(&payroll_id);
    assert_eq!(payroll.status, PayrollStatus::Cancelled);
}

#[test]
fn test_circuit_breaker() {
    let (env, _contract_address, client) = create_test_contract();
    
    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let recipient = Address::generate(&env);
    let usdc_asset = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Activate circuit breaker
    let breaker_state = client.toggle_circuit_breaker(&admin);
    assert_eq!(breaker_state, true);
    
    // Try to create payroll with circuit breaker active - should fail
    let recipients = Vec::from_array(
        &env,
        [Recipient {
            address: recipient,
            amount: 1000,
            paid: false,
            stream_id: None,
        }],
    );
    
    let result = client.try_create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    assert!(result.is_err());
    
    // Deactivate circuit breaker
    let breaker_state = client.toggle_circuit_breaker(&admin);
    assert_eq!(breaker_state, false);
    
    // Now payroll creation should work
    let payroll_id = client.create_payroll(
        &employer,
        &recipients,
        &usdc_asset,
        &ScheduleType::Immediate,
        &None,
        &None,
    );
    
    assert_eq!(payroll_id, 1);
}
