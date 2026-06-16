# FIP Reconciliation Flow v1

Status: draft

## Purpose

Reconciliation explains when official documents override transaction-derived
values. It prevents paychecks, investment income, card credits, and year-end
statement values from being double-counted or incorrectly treated as ordinary
spending/income.

## Source Priority

```text
W-2 / paystub / 1099 / year-end statement / card statement
  > imported transactions
  > manual estimate
```

## Official Fact Types

- `labor_income`
- `federal_tax_withheld`
- `state_tax_withheld`
- `financial_income`
- `dividends`
- `interest`
- `capital_gains`
- `employee_401k_contribution`
- `employer_401k_match`
- `hsa_contribution`
- `statement_balance`
- `minimum_payment`
- `interest_charged`

## Workflow

1. Import or manually enter parsed official facts.
2. Validate source type, period, metric name, value, and currency.
3. Compute hard-calculated metrics from classified transactions.
4. Compare official value and hard-calculated value.
5. Generate a reconciliation report row.
6. Use official value in reports when the metric has an official fact.
7. Preserve transaction-derived value as explanatory evidence.

## Difference Handling

- Small difference: keep official value and record reason.
- Large difference: keep official value and emit review warning.
- Missing official fact: use transaction value and mark lower confidence.
- Conflicting official facts: mark `needs_manual_review`.

## Output

`reconciliation_report.csv` and API responses should expose:

- official source
- official value
- hard-calculated value
- difference
- action taken
- review status

## Guardrails

- Do not infer tax advice from official facts.
- Do not modify raw transactions during reconciliation.
- Do not hide differences; every override must remain explainable.

