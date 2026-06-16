# FIP Deployment and Runbook v1

Status: draft
Environment: local MVP / staging-ready skeleton

## Dependencies

- Node.js 20+ for API/app implementation.
- PostgreSQL 15+ for persistent storage.
- YAML parser for rule and risk config.
- CSV parser for data package imports.
- JWT library for API authentication.

## Configuration

Environment variables:

```text
DATABASE_URL=postgres://user:password@localhost:5432/fip
JWT_SECRET=replace-in-local-env
FIP_RULE_CONFIG_PATH=docs/fip/config/classification-rules-v1.yaml
FIP_RISK_CONFIG_PATH=docs/fip/config/risk-monitoring-rules-v1.yaml
FIP_IMPORT_DIR=./data/imports
FIP_EXPORT_DIR=./data/exports
```

## Startup Contract

MVP services should start in this order:

1. Database.
2. API server.
3. Worker for import/classification/metrics jobs.
4. Web or mobile shell.

## Database Setup

Apply schema:

```text
psql "$DATABASE_URL" -f docs/fip/db/schema-v1.sql
```

## Import Run

Expected flow:

1. Place a data package in `FIP_IMPORT_DIR`.
2. Validate package files and row shape.
3. Insert accounts and raw transactions.
4. Load rule modules.
5. Classify transactions.
6. Compute monthly metrics.
7. Evaluate risk rules.
8. Export reports and run manifest.

## Operations Checks

- Rule config parses.
- Risk config parses.
- Database migrations apply cleanly.
- Import manifest has expected row counts.
- Review queue rate is visible.
- Alerts include source metrics.

## Backup Guidance

Back up:

- PostgreSQL database.
- imported source data packages.
- user override rules.
- generated run manifests.

Do not store bank credentials in MVP.

## Security Boundaries

- No real bank credentials in config files.
- No payment or transfer execution endpoints.
- No production Plaid secrets until explicit approval.
- No tax filing or investment advice claims in UI copy.

## Basic Maintenance

- Rotate JWT secret before production.
- Version every rule config change.
- Keep raw imports immutable.
- Recompute reports after rule changes and record the rule pack version.

