# FIP API and Mobile Specification v1

Status: draft
API style: REST JSON
Auth: JWT bearer token for MVP app calls

## Auth

### `POST /api/auth/login`

Request:

```json
{ "email": "user@example.com", "password": "example" }
```

Response:

```json
{ "access_token": "jwt", "user_id": "uuid", "expires_in": 3600 }
```

## Accounts

### `GET /api/accounts`

Response:

```json
{
  "accounts": [
    {
      "account_id": "acc_1",
      "institution": "Example Bank",
      "account_name": "Primary Checking",
      "account_type": "depository",
      "account_subtype": "checking",
      "current_balance": 12000.50,
      "available_balance": 11800.50,
      "currency": "USD",
      "sync_status": "imported"
    }
  ]
}
```

## Dashboard

### `GET /api/dashboard?year=2025`

Response fields:

- `net_cash`
- `net_worth`
- `labor_income`
- `financial_income`
- `old_item_recovery`
- `net_spending`
- `savings_flow`
- `internal_flow`
- `open_alert_count`
- `data_quality`

## Spending

### `GET /api/spending/monthly?year=2025`

Returns gross spending, merchant refunds, net spending, and category totals per
month.

### `GET /api/spending/categories?year=2025&month=01`

Returns category totals, share of net spending, trend deltas, and review amount.

### `GET /api/spending/merchants?year=2025&month=01`

Returns merchant totals and transaction counts.

## Transactions

### `GET /api/transactions`

Query parameters:

- `start_date`
- `end_date`
- `account_id`
- `category`
- `treatment`
- `review_status`
- `q`
- `limit`
- `cursor`

Response includes rows plus `sum_amount`, `sum_normalized_amount`, and cursor.

### `PATCH /api/transactions/{transaction_id}/classification`

Request:

```json
{
  "category": "Shopping",
  "subcategory": "Clothing",
  "treatment": "spending",
  "cashflow_layer": "spending",
  "review_status": "reviewed",
  "create_rule_proposal": true,
  "notes": "Recurring merchant pattern"
}
```

Response:

```json
{
  "transaction_id": "tx_1",
  "updated": true,
  "rule_proposal_id": "proposal_1"
}
```

## Rules

### `GET /api/rules/review-queue`

Returns low-confidence transactions and suggested actions.

### `POST /api/rules`

Creates a user override rule. System modules are immutable through this endpoint.

## Credit Cards

### `GET /api/credit-cards/monthly?year=2025`

Returns card-month rows with spend, refunds, rewards, statement balances,
payments, due dates, and interest.

### `GET /api/credit-cards/{card_id}`

Returns a single card summary and recent statement history.

## Income, Savings, Internal Flows

### `GET /api/income/summary?year=2025`

Returns official and transaction-derived income comparisons.

### `GET /api/savings?year=2025`

Returns 401k, HSA, IRA, brokerage, employer match, and loan repayment rows.

### `GET /api/internal-flows?year=2025`

Returns grouped internal movement rows.

## Reconciliation

### `POST /api/reconcile`

MVP request accepts metadata and parsed official fact rows, not raw PDF parsing:

```json
{
  "source_document": "2025-W2",
  "source_type": "w2",
  "facts": [
    { "metric": "labor_income", "value": 120000, "currency": "USD" }
  ]
}
```

## Alerts

### `GET /api/alerts?status=open`

Returns risk alerts with severity, source metric, threshold, and suggested
action.

### `PATCH /api/alerts/{alert_id}`

Request:

```json
{ "status": "acknowledged", "notes": "Reviewed in issuer account" }
```

## Mobile Structure

Bottom navigation:

- Dashboard
- Spending
- Transactions
- Cards
- More

More menu:

- Income
- Savings
- Internal Flows
- Rule Review
- Alerts
- Reports
- Settings

Mobile interaction rules:

- Money movement buttons are not shown in MVP.
- Risk alerts link to source metrics and transactions.
- Rule edits require confirmation before creating a reusable rule.
- Official-derived metrics show source labels such as `W-2` or `statement`.

