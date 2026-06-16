# FIP Data Package Specification v1

Status: draft
Format: directory or zip archive

## Package Files

Required:

- `accounts.csv`
- `raw_transactions.csv`
- `classification_rules.yaml`

Generated:

- `classified_transactions.csv`
- `monthly_spending.csv`
- `credit_card_monthly.csv`
- `internal_flows.csv`
- `income_summary.csv`
- `official_facts.csv`
- `savings_flows.csv`
- `risk_alerts.csv`
- `reconciliation_report.csv`
- `run_manifest.json`

Optional inputs:

- `official_facts.csv`
- `credit_card_statements.csv`
- `manual_overrides.csv`

## `accounts.csv`

Fields:

- `account_id`
- `institution`
- `account_name`
- `official_name`
- `account_type`
- `account_subtype`
- `mask`
- `current_balance`
- `available_balance`
- `credit_limit`
- `currency`
- `sync_status`
- `data_start_date`
- `data_end_date`

## `raw_transactions.csv`

Fields:

- `transaction_id`
- `account_id`
- `source`
- `source_transaction_id`
- `date`
- `posted_datetime`
- `description`
- `merchant_name`
- `amount`
- `currency`
- `raw_category_primary`
- `raw_category_detailed`
- `pending`
- `raw_json`

## `classified_transactions.csv`

Fields:

- `transaction_id`
- `date`
- `account_id`
- `description`
- `merchant_name`
- `amount`
- `normalized_amount`
- `category`
- `subcategory`
- `treatment`
- `cashflow_layer`
- `is_spending`
- `is_income`
- `is_internal_flow`
- `is_refund`
- `is_excluded`
- `confidence`
- `rule_id`
- `rule_module_id`
- `review_status`
- `notes`

## Treatment Enum

- `spending`
- `refund_offset`
- `labor_income`
- `financial_income`
- `old_item_recovery`
- `credit_card_payment`
- `savings_transfer`
- `cash_consolidation`
- `liquidity_movement`
- `loan_proceeds`
- `loan_repayment`
- `exclude`
- `needs_review`

## Cashflow Layer Enum

- `income`
- `spending`
- `savings`
- `internal_flow`
- `asset_recovery`
- `financing`
- `excluded`
- `review`

## Reconciliation Report

`reconciliation_report.csv` fields:

- `period`
- `metric`
- `official_value`
- `hard_calculated_value`
- `difference`
- `difference_pct`
- `source_document`
- `reason`
- `action`

Allowed actions:

- `use_official_value`
- `use_transaction_value`
- `needs_manual_review`
- `missing_official_fact`

## Run Manifest

`run_manifest.json` records:

- `run_id`
- `created_at`
- `schema_version`
- `input_files`
- `rule_modules`
- `row_counts`
- `data_quality`
- `warnings`

