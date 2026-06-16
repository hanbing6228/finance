# FIP MVP Documentation Pack

FIP is an independent personal finance analytics module. It can later be
registered in the Baohe toolbox through a static module contract, but MVP v1 is
kept standalone and data-package driven.

## Files

- `prd-v1.md` - product goals, users, pain points, MVP scope, success metrics.
- `technical-design-v1.md` - architecture, modules, data flow, extensibility.
- `api-mobile-spec-v1.md` - REST API contract and mobile UI structure.
- `data-package-spec-v1.md` - import/export files, fields, enums, report format.
- `rule-engine-pseudocode-v1.md` - config-driven classification engine design.
- `config/classification-rules-v1.yaml` - initial editable rule modules.
- `db/schema-v1.sql` - PostgreSQL schema, indexes, and constraints.
- `monthly-metrics-logic-v1.md` - monthly metrics computation logic.
- `reconciliation-flow-v1.md` - official-document reconciliation workflow.
- `risk-monitoring-rules-v1.md` - human-readable risk rules.
- `config/risk-monitoring-rules-v1.yaml` - machine-readable risk rules.
- `ui/wireframes-v1.md` - MVP wireframes for major screens.
- `qa/test-plan-v1.md` - functional, data, performance, and edge-case tests.
- `ops/deployment-runbook-v1.md` - dependencies, config, startup, operations.

## MVP Boundary

MVP v1 supports CSV/Excel/data-package imports and manually entered official
facts. Plaid, real-time sync, bank authorization, payment execution, tax advice,
investment advice, and automated money movement are out of scope until an
explicit approval gate is passed.

