# FIP Test Plan v1

Status: draft

## Test Goals

- Verify classification is config-driven and explainable.
- Verify monthly metrics match source transactions and official facts.
- Verify risk alerts trigger from YAML thresholds.
- Verify API responses expose correct fields and do not imply money movement.
- Verify edge cases do not corrupt reports.

## Functional Tests

| Area | Case | Expected |
| --- | --- | --- |
| Import | Valid data package | Rows load and manifest records counts |
| Import | Missing required file | Import fails with actionable error |
| Rules | Generic payment rule matches | Treatment is `credit_card_payment` |
| Rules | No rule matches | Transaction enters review queue |
| Rules | User override priority | Override beats core module rule |
| Review | Edit classification | Transaction status becomes reviewed |
| Reports | Export monthly report | Metrics and data-quality flags present |

## Data Correctness Tests

| Metric | Fixture | Expected |
| --- | --- | --- |
| Net spending | Spending 100, refund 20 | Net spending 80 |
| Credit card payment | Payment 500 | Internal flow, not spending |
| Rewards | Reward 25 | Financial income, not refund |
| Official income | W-2 value 120000, tx value 119500 | Report uses 120000 |
| Savings | Employee 1000, employer 500 | Total 1500, split visible |

## Risk Tests

| Rule | Fixture | Expected |
| --- | --- | --- |
| Low cash | Cash below card bills | High/critical alert |
| Spending spike | 30% above trailing avg | Warning alert |
| Missing card payment | Statement exists, no payment | Alert |
| Classification drift | Review rate above 10% | Alert |
| Sync gap | Account stale over 7 days | Alert |

## Performance Tests

- 10,000 transactions classify under target runtime for local MVP.
- 100,000 transactions complete batch metrics without memory exhaustion.
- API list endpoints paginate and return stable cursors.

## Edge Cases

- Duplicate transaction IDs.
- Pending transactions that later post.
- Refunds without linked original purchase.
- Negative amounts from different bank export conventions.
- Multi-currency rows.
- Missing official facts.
- Conflicting official facts.
- Closed accounts with historical transactions.

## Regression Rule

Any change to treatment enums, cashflow layers, or rule operators requires:

- fixture update
- schema compatibility check
- data package validation update
- monthly metrics recalculation check

