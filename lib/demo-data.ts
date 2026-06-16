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
      severity: "high",
      title: "Cash may not cover card bills",
      detail: "Projected card payments exceed available cash in 12 days.",
    },
    {
      id: "alert_2",
      severity: "warn",
      title: "Shopping above 6-month average",
      detail: "Shopping spend is 55% above the trailing 6-month average.",
    },
    {
      id: "alert_3",
      severity: "info",
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
};

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
