# FIP Monthly Metrics Logic v1

Status: draft
Scope: first-pass monthly computation model for the independent FIP module

## Inputs

Monthly metrics are computed from normalized, classified data:

- `accounts`
- `classified_transactions`
- `official_facts`
- `credit_card_statements`
- `classification_evidence`

Official facts are used to calibrate income and investment-related facts.
Transactions explain cash movement; they do not override official source
values where an official fact exists.

## Output Tables

- `monthly_metrics`
- `monthly_spending`
- `credit_card_monthly`
- `internal_flows`
- `savings_flows`
- `income_summary`
- `reconciliation_report`

## Computation Flow

```text
function compute_monthly_metrics(classified_transactions, accounts, official_facts, statement_facts, year):
    tx_by_month = group_by_year_month(classified_transactions, year)
    account_index = index_by_account_id(accounts)

    monthly_outputs = []

    for month in months_in_year(year):
        txs = tx_by_month[month]

        spending = compute_monthly_spending(txs)
        income = compute_monthly_income(txs, official_facts, year, month)
        credit_cards = compute_credit_card_monthly(txs, account_index, statement_facts, year, month)
        internal = compute_internal_flows(txs, account_index)
        savings = compute_savings_flows(txs, official_facts, year, month)
        reconciliation = reconcile_official_vs_hard_calculated(income, savings, official_facts, year, month)

        monthly_metrics = {
            year: year,
            month: month,
            labor_income: income.labor_income,
            financial_income: income.financial_income,
            old_item_recovery: income.old_item_recovery,
            gross_spending: spending.gross_spending,
            refunds: spending.merchant_refunds,
            net_spending: spending.net_spending,
            credit_card_payments: internal.credit_card_payments,
            savings_transfer: savings.total_savings_flow,
            cash_consolidation: internal.cash_consolidation,
            liquidity_movement: internal.liquidity_movement,
            loan_proceeds: internal.loan_proceeds,
            loan_repayment: internal.loan_repayment
        }

        monthly_outputs.append({
            monthly_metrics: monthly_metrics,
            monthly_spending: spending,
            credit_card_monthly: credit_cards,
            internal_flows: internal.rows,
            savings_flows: savings.rows,
            reconciliation_report: reconciliation
        })

    return monthly_outputs
```

## Spending Logic

```text
function compute_monthly_spending(txs):
    spending_txs = filter treatment == "spending"
    refund_txs = filter treatment == "refund_offset"

    gross_spending = sum_positive_normalized_amounts(spending_txs)
    merchant_refunds = abs(sum_negative_or_refund_amounts(refund_txs))
    net_spending = gross_spending - merchant_refunds

    categories = group spending_txs by category
    category_refunds = group refund_txs by linked_category if present else "Unallocated Refund"

    return {
        gross_spending,
        merchant_refunds,
        net_spending,
        categories: subtract_allocated_refunds(categories, category_refunds),
        top_merchants: aggregate_by_merchant(spending_txs),
        review_amount: sum tx where review_status != "auto_classified"
    }
```

Credit card payments, savings transfers, old item recovery, rewards, statement
credits, liquidity movement, and loan proceeds are excluded from spending.

## Income Logic

```text
function compute_monthly_income(txs, official_facts, year, month):
    hard_labor_income = sum treatment == "labor_income"
    hard_financial_income = sum treatment == "financial_income"
    old_item_recovery = sum treatment == "old_item_recovery"

    official_labor_income = lookup_official_fact("labor_income", year, month)
    official_financial_income = lookup_official_fact("financial_income", year, month)

    labor_income = official_labor_income.value if official_labor_income exists else hard_labor_income
    financial_income = official_financial_income.value if official_financial_income exists else hard_financial_income

    return {
        labor_income,
        labor_income_source: "official" or "transaction",
        financial_income,
        financial_income_source: "official" or "transaction",
        old_item_recovery
    }
```

Old item recovery is tracked separately as asset disposition cash recovery. It
is not treated as labor income.

## Credit Card Monthly Logic

```text
function compute_credit_card_monthly(txs, account_index, statement_facts, year, month):
    card_txs = filter account_type == "credit"
    grouped = group by account_id

    rows = []
    for card_id, txs_for_card in grouped:
        spend = sum treatment == "spending"
        refunds = abs(sum treatment == "refund_offset")
        rewards = sum treatment == "financial_income" and subcategory in reward-like categories
        payments = sum treatment == "credit_card_payment"

        statement = lookup_statement_fact(card_id, year, month)

        rows.append({
            card_account_id: card_id,
            card_name: account_index[card_id].account_name,
            gross_spend: spend,
            merchant_refunds: refunds,
            net_spend: spend - refunds,
            rewards: rewards,
            statement_credits: statement.statement_credits or derived_statement_credits(txs_for_card),
            payments: payments,
            statement_balance: statement.statement_balance,
            minimum_payment: statement.minimum_payment,
            due_date: statement.due_date,
            interest_charged: statement.interest_charged,
            apr: statement.apr
        })

    return rows
```

## Internal Flows Logic

```text
function compute_internal_flows(txs, account_index):
    internal_treatments = [
        "credit_card_payment",
        "savings_transfer",
        "cash_consolidation",
        "liquidity_movement",
        "loan_proceeds",
        "loan_repayment"
    ]

    internal_txs = filter treatment in internal_treatments
    rows = group by treatment, subcategory, source_account, destination_account

    return {
        rows,
        credit_card_payments: sum treatment == "credit_card_payment",
        cash_consolidation: sum treatment == "cash_consolidation",
        liquidity_movement: sum treatment == "liquidity_movement",
        loan_proceeds: sum treatment == "loan_proceeds",
        loan_repayment: sum treatment == "loan_repayment"
    }
```

Internal flows explain movement between balance-sheet locations. They should
not be counted as new income or living expense.

## Savings Flows Logic

```text
function compute_savings_flows(txs, official_facts, year, month):
    transaction_savings = group treatment == "savings_transfer" by savings_type
    official_savings = lookup official facts for 401k, HSA, IRA, employer_match

    rows = merge_transaction_and_official_savings(transaction_savings, official_savings)

    return {
        rows,
        employee_savings: sum rows.employee_amount,
        employer_savings: sum rows.employer_amount,
        loan_repayment_amount: sum rows.loan_repayment_amount,
        total_savings_flow: sum rows.total_amount
    }
```

Employer contributions should be visible separately from employee savings.

## Reconciliation Logic

```text
function reconcile_official_vs_hard_calculated(computed, official_facts, year, month):
    rows = []
    for official_fact in official_facts for year/month:
        hard_value = lookup_hard_calculated_value(official_fact.metric, computed)
        difference = official_fact.value - hard_value
        difference_pct = difference / official_fact.value if official_fact.value != 0 else null

        rows.append({
            period: year-month,
            metric: official_fact.metric,
            official_value: official_fact.value,
            hard_calculated_value: hard_value,
            difference,
            difference_pct,
            reason: infer_reconciliation_reason(official_fact, hard_value),
            action: "use_official_value"
        })

    return rows
```

## Data Quality Flags

Each monthly run should emit data quality fields:

- `classification_review_rate`
- `unmatched_transaction_count`
- `missing_statement_count`
- `official_fact_coverage`
- `sync_gap_days`
- `large_uncategorized_amount`

These fields feed the risk-monitoring YAML rules.

