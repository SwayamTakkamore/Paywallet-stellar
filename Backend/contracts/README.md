# Soroban Payroll Escrow Contract

This directory contains the Rust-based Soroban smart contracts for payroll escrow functionality.

## Contracts

- `payroll_escrow/` - Main payroll escrow contract
- `streaming_payment/` - Streaming payment contract (future)

## Build Instructions

```bash
# Install Soroban CLI
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked soroban-cli

# Build contracts
soroban contract build

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payroll_escrow.wasm \
  --source alice \
  --network testnet
```
