# PayWallet Backend

## Folder Structure

```
backend/
├── src/
│   ├── api/           # API route handlers (Express/Fastify routes)
│   ├── controllers/   # Business logic controllers
│   ├── services/      # Service layer (business logic, external APIs)
│   ├── models/        # Database models and types
│   ├── stellar/       # Stellar SDK integration and helpers
│   ├── soroban/       # Soroban contract interaction layer
│   └── utils/         # Utility functions, middleware, validators
├── contracts/         # Soroban smart contracts (Rust)
├── migrations/        # Database migration files
├── tests/            # Test files (unit, integration, contract tests)
├── docker/           # Docker configuration files
└── package.json      # Dependencies and scripts
```

## Directory Descriptions

- **src/api/**: Express/Fastify route definitions and request/response handling
- **src/controllers/**: Business logic controllers that orchestrate services
- **src/services/**: Core business logic, Stellar/Soroban interactions, external API calls
- **src/models/**: TypeScript interfaces, database models, validation schemas
- **src/stellar/**: Stellar SDK wrappers, account management, payment utilities
- **src/soroban/**: Soroban contract deployment, interaction helpers, ABI management
- **src/utils/**: Authentication middleware, error handlers, validators, logging
- **contracts/**: Rust-based Soroban smart contracts for payroll escrow logic
- **migrations/**: PostgreSQL database schema migrations
- **tests/**: Comprehensive test suite for all layers
- **docker/**: Development environment containerization
