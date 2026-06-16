# FIP Product Requirements Document v1

Status: draft
Product: FIP, independent finance analytics module
Target milestone: MVP

## Product Goal

FIP helps the user understand personal finances beyond ordinary bookkeeping. It
imports account, transaction, statement, and official-document data; classifies
cash movement with editable rules; reconciles income and investment facts
against official sources; computes monthly and annual metrics; and surfaces
risks before they become expensive surprises.

## User Pain Points

- Credit card payments, refunds, rewards, transfers, and investment liquidity
  events are often mixed into "spending", making reports misleading.
- Bank exports differ by institution, so classification rules become fragile if
  they are embedded in code.
- Official documents such as W-2, paystubs, 1099s, and year-end statements are
  more authoritative than transaction arithmetic, but most tools do not make
  that precedence explicit.
- Month-end review is slow because unclear transactions, missing statements, and
  stale sync gaps are discovered too late.
- The user needs finance insight and risk flags, not payment automation or tax
  advice in MVP.

## Core Principles

- Official facts outrank transaction-derived estimates.
- Classification and treatment are separate concepts.
- Rules are configuration modules, not hard-coded logic.
- Every generated metric should be traceable to input rows and rules.
- MVP is advisory and analytical only.

## Primary Users

- Single user / owner operating personal finance analysis.
- Future Baohe toolbox user who accesses FIP as the `finance` module.
- Developer/operator reviewing data quality, rules, and reports.

## MVP Scope

### In Scope

- Import account, raw transaction, classified transaction, statement, and
  official fact data from CSV/JSON/YAML packages.
- Run config-driven classification rules.
- Maintain review queues for uncertain transactions.
- Compute monthly spending, income, internal flow, credit card, savings, and
  reconciliation metrics.
- Generate risk alerts for liquidity, spending anomalies, payment gaps,
  classification quality, sync quality, and missing official facts.
- Provide REST API specifications and mobile UI structure.
- Provide SQL schema and deployment/runbook guidance.

### Out of Scope

- Direct Plaid production connection.
- OAuth or bank credential management.
- Payment, transfer, cancellation, or account-changing actions.
- Tax filing, legal advice, investment recommendations, or portfolio trading.
- Multi-user household sharing.
- Production mobile app store release.

## Core Features

1. Dashboard: net cash, net worth, income, net spending, savings flow, risks.
2. Spending: monthly net spending, refunds, categories, merchants, anomalies.
3. Transactions: search, filter, review status, manual classification, export.
4. Rule Review: accept/edit suggestions and generate user override proposals.
5. Credit Cards: card-level spend, refunds, rewards, payments, statements.
6. Internal Flows: credit card payments, savings transfers, cash movements,
   liquidity events, loan flows.
7. Income and Savings: official-vs-transaction income and savings facts.
8. Reports: monthly and annual CSV/PDF-ready summaries.
9. Alerts: explainable risk alerts with thresholds and source metrics.

## Success Metrics

- At least 95% of recurring transactions auto-classified after initial tuning.
- Monthly net spending can be reproduced from classified transactions.
- Official income values override transaction-derived estimates where present.
- Review queue remains below 10% of monthly transaction count after tuning.
- Low-cash and missing-card-payment alerts can be traced to source rows.
- New card/institution rules can be added without editing engine code.

## MVP Acceptance

MVP is acceptable when a 2025 data package can be imported, classified,
reviewed, aggregated into monthly reports, reconciled against official facts,
and evaluated against risk rules without hard-coded bank logic.

