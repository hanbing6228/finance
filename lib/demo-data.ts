export const dashboardDemo = {
  year: 2025,
  net_cash: 12400,
  net_worth: 310200,
  labor_income: 120000,
  net_spending: 54200,
  savings_flow: 28500,
  open_alert_count: 3,
  data_quality: "demo",
  alerts: [
    {
      id: "alert_1",
      severity: "high" as const,
      title: "Cash may not cover card bills",
      detail: "Projected card payments exceed available cash in 12 days.",
    },
    {
      id: "alert_2",
      severity: "warn" as const,
      title: "Shopping above 6-month average",
      detail: "Shopping spend is 55% above the trailing 6-month average.",
    },
    {
      id: "alert_3",
      severity: "info" as const,
      title: "2 transactions need review",
      detail: "Unmatched merchants are waiting in the review queue.",
    },
  ],
  monthly_trend: [
    { month: "Jan", net_spending: 4200 },
    { month: "Feb", net_spending: 3900 },
    { month: "Mar", net_spending: 5100 },
    { month: "Apr", net_spending: 4600 },
    { month: "May", net_spending: 5380 },
    { month: "Jun", net_spending: 4800 },
  ],
  categories: [
    { name: "Shopping", amount: 1420, delta_pct: 55 },
    { name: "Dining", amount: 820, delta_pct: 8 },
    { name: "Travel", amount: 430, delta_pct: -12 },
    { name: "Services", amount: 310, delta_pct: 4 },
  ],
  merchants: [
    { name: "Merchant A", amount: 390, count: 5 },
    { name: "Merchant B", amount: 210, count: 2 },
    { name: "Merchant C", amount: 168, count: 3 },
  ],
  transactions: [
    { date: "01/02", merchant: "Store A", amount: -42.1, status: "auto" as const },
    { date: "01/04", merchant: "Unknown", amount: -88.2, status: "review" as const },
    { date: "01/05", merchant: "Payment", amount: -900, status: "auto" as const },
    { date: "01/07", merchant: "Cafe B", amount: -18.5, status: "auto" as const },
    { date: "01/09", merchant: "Refund Shop", amount: 42, status: "auto" as const },
  ],
  cards: [
    {
      name: "Card A",
      balance: 2100,
      due: "02/15",
      payment: "matched" as const,
      spend: 1400,
      refunds: 120,
      rewards: 35,
    },
    {
      name: "Card B",
      balance: 900,
      due: "02/18",
      payment: "missing" as const,
      spend: 620,
      refunds: 0,
      rewards: 12,
    },
  ],
  reviewQueue: {
    remaining: 12,
    sample: {
      merchant: "Unknown merchant",
      amount: -88.2,
      account: "Credit Card",
      category: "Services",
      treatment: "spending",
      confidence: 0.72,
    },
  },
  internalFlows: [
    { type: "Credit Card Payments", amount: 4200 },
    { type: "Savings Transfers", amount: 2000 },
    { type: "Liquidity Movement", amount: 0 },
    { type: "Loan Flows", amount: 0 },
  ],
};

export function formatUsd(value: number, fraction = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction,
  }).format(Math.abs(value));
}
