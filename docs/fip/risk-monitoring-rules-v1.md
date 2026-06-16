# FIP Risk Monitoring Rules v1

Status: draft
Machine config: `config/risk-monitoring-rules-v1.yaml`

## Rule Design

Risk monitoring is config-driven. The evaluator reads metrics and YAML
thresholds, then emits alerts. It must not hard-code bank/card/merchant behavior.

## MVP Risk Types

### Low Cash

Trigger when net cash is below or close to credit card statement balances due in
the next 45 days.

Default severity:

- critical: cash is below 75% of obligations
- high: cash is below 100%
- warning: cash is below 115%

### Spending Spike

Trigger when monthly net spending is more than 30% above the trailing 3-month
average and at least $500 above average.

### Category Anomaly

Trigger when configured categories such as Shopping, Travel, Dining, Services,
or Entertainment are more than 50% above their trailing 6-month average and at
least $300 above average.

### Missing Credit Card Payment

Trigger when a card has a statement balance above $50 but matched payments are
below 95% of the statement balance near the due-date window.

### Classification Drift

Trigger when more than 10% of monthly transactions need review, or more than
25% for high severity.

### Large Uncategorized Amount

Trigger when transactions needing review total more than $1,000 in a month.

### Sync Gap

Trigger when active account data is more than 7 days stale.

### Missing Official Facts

Trigger when income reporting depends on transaction-derived values because
official facts are missing.

## Alert Lifecycle

- `open`: newly emitted and visible.
- `acknowledged`: user reviewed the issue.
- `resolved`: underlying condition no longer applies.
- `dismissed`: user intentionally ignores the alert.

## Evidence Requirements

Every alert should link back to:

- source metric
- threshold
- period
- related account/card/category
- related transactions where applicable

