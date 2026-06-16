import { dashboardDemo, formatUsd } from "@/lib/demo-data";

function severityClass(severity: string) {
  if (severity === "high") return "border-danger/30 bg-red-50 text-danger";
  if (severity === "warn") return "border-warn/30 bg-amber-50 text-warn";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function HomePage() {
  const data = dashboardDemo;
  const maxSpend = Math.max(...data.monthly_trend.map((m) => m.net_spending));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">FIP · Finance</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Personal Finance Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Data-package driven analytics MVP. Demo data only — import CSV/JSON
            packages and rule configs per{" "}
            <a
              className="text-accent underline-offset-2 hover:underline"
              href="https://github.com/hanbing6228/finance/tree/main/docs/fip"
              rel="noreferrer"
              target="_blank"
            >
              FIP docs
            </a>
            .
          </p>
        </div>
        <div className="card px-4 py-2 text-sm text-slate-600">
          Year <span className="font-semibold text-ink">{data.year}</span> · Demo
          mode
        </div>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Net Cash", value: formatUsd(data.net_cash) },
          { label: "Net Worth", value: formatUsd(data.net_worth) },
          {
            label: "Open Alerts",
            value: String(data.open_alert_count),
            hint: "3 high priority",
          },
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <div className="metric-label">{item.label}</div>
            <div className="metric-value mt-2">{item.value}</div>
            {item.hint ? (
              <div className="mt-1 text-xs text-danger">{item.hint}</div>
            ) : null}
          </div>
        ))}
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Income", value: formatUsd(data.labor_income) },
          { label: "Net Spending", value: formatUsd(data.net_spending) },
          { label: "Savings Flow", value: formatUsd(data.savings_flow) },
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <div className="metric-label">{item.label}</div>
            <div className="metric-value mt-2">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Risk Alerts</h2>
          <ul className="space-y-3">
            {data.alerts.map((alert) => (
              <li
                key={alert.id}
                className={`rounded-xl border px-4 py-3 ${severityClass(alert.severity)}`}
              >
                <div className="text-sm font-semibold">{alert.title}</div>
                <div className="mt-1 text-xs opacity-90">{alert.detail}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Monthly Trend</h2>
          <div className="flex h-40 items-end gap-2">
            {data.monthly_trend.map((point) => (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-accent/80"
                  style={{
                    height: `${Math.round((point.net_spending / maxSpend) * 100)}%`,
                    minHeight: "12px",
                  }}
                  title={`${point.month}: ${formatUsd(point.net_spending)}`}
                />
                <span className="text-xs text-slate-500">{point.month}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-lg font-semibold">Category Breakdown</h2>
        <div className="space-y-4">
          {data.categories.map((category) => {
            const width = Math.round(
              (category.amount / data.categories[0].amount) * 100
            );
            return (
              <div key={category.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-slate-600">
                    {formatUsd(category.amount)}
                    {category.delta_pct > 20 ? (
                      <span className="ml-2 text-danger">+{category.delta_pct}%</span>
                    ) : null}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-8 text-center text-xs text-slate-500">
        API: <code className="rounded bg-white px-1 py-0.5">/api/dashboard</code> ·{" "}
        <code className="rounded bg-white px-1 py-0.5">/api/health</code>
      </footer>
    </main>
  );
}
