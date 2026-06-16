# FIP MVP Wireframes v1

Status: draft
Format: low-fidelity text wireframes

## Dashboard

```text
┌─────────────────────────────────────────────┐
│ FIP Dashboard                    2025 ▾     │
├─────────────────────────────────────────────┤
│ Net Cash     Net Worth     Open Alerts      │
│ $12,400      $310,200      3 high           │
├─────────────────────────────────────────────┤
│ Income       Net Spending  Savings Flow     │
│ $120,000     $54,200       $28,500          │
├─────────────────────────────────────────────┤
│ Risk Alerts                                  │
│ [High] Cash may not cover card bills         │
│ [Warn] Shopping above 6-month average        │
├─────────────────────────────────────────────┤
│ Monthly Trend                                │
│ Jan Feb Mar Apr May Jun ...                  │
└─────────────────────────────────────────────┘
```

## Spending

```text
┌─────────────────────────────────────────────┐
│ Spending                         Month ▾    │
├─────────────────────────────────────────────┤
│ Gross $5,800  Refunds $420  Net $5,380      │
├─────────────────────────────────────────────┤
│ Category Breakdown                           │
│ Shopping        ███████ $1,420  +55% alert   │
│ Dining          ████    $820                 │
│ Travel          ██      $430                 │
├─────────────────────────────────────────────┤
│ Top Merchants                                 │
│ Merchant A      $390     5 tx                │
│ Merchant B      $210     2 tx                │
└─────────────────────────────────────────────┘
```

## Transactions

```text
┌─────────────────────────────────────────────┐
│ Transactions      Search...        Filter ▾ │
├─────────────────────────────────────────────┤
│ Date       Merchant       Amount   Status    │
│ 01/02      Store A        $42.10   auto      │
│ 01/04      Unknown        $88.20   review    │
│ 01/05      Payment        $900.00  auto      │
├─────────────────────────────────────────────┤
│ Selected: 1   Edit classification   Export  │
└─────────────────────────────────────────────┘
```

## Rule Review

```text
┌─────────────────────────────────────────────┐
│ Rule Review                         12 left │
├─────────────────────────────────────────────┤
│ Transaction                                  │
│ Unknown merchant - $88.20 - Credit Card      │
├─────────────────────────────────────────────┤
│ Suggested Classification                     │
│ Category: Services                           │
│ Treatment: spending                          │
│ Confidence: 0.72                             │
├─────────────────────────────────────────────┤
│ [Accept] [Edit] [Exclude] [Create Rule]      │
└─────────────────────────────────────────────┘
```

## Credit Cards

```text
┌─────────────────────────────────────────────┐
│ Credit Cards                                │
├─────────────────────────────────────────────┤
│ Card A                                      │
│ Balance $2,100  Due 02/15  Payment matched  │
│ Spend $1,400  Refunds $120  Rewards $35     │
├─────────────────────────────────────────────┤
│ Card B                                      │
│ Balance $900    Due 02/18  Missing payment  │
└─────────────────────────────────────────────┘
```

## Internal Flows

```text
┌─────────────────────────────────────────────┐
│ Internal Flows                    Type ▾    │
├─────────────────────────────────────────────┤
│ Credit Card Payments      $4,200            │
│ Savings Transfers         $2,000            │
│ Liquidity Movement        $0                │
│ Loan Flows                $0                │
└─────────────────────────────────────────────┘
```

## Mobile Navigation

Bottom tabs:

- Dashboard
- Spending
- Transactions
- Cards
- More

The MVP UI must never present payment execution as an available action.

