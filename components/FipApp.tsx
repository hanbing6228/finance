"use client";

import { useEffect, useMemo, useState } from "react";
import {
  dashboardDemo,
  formatUsd,
} from "@/lib/demo-data";
import {
  IconCards,
  IconDashboard,
  IconMore,
  IconSpending,
  IconTheme,
  IconTransactions,
} from "@/components/icons";

type Tab = "dashboard" | "spending" | "transactions" | "cards" | "more";

const tabs: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "总览" },
  { id: "spending", label: "支出" },
  { id: "transactions", label: "交易" },
  { id: "cards", label: "卡片" },
  { id: "more", label: "更多" },
];

const titles: Record<Tab, string> = {
  dashboard: "FIP 仪表盘",
  spending: "支出分析",
  transactions: "交易明细",
  cards: "信用卡",
  more: "更多",
};

export default function FipApp() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const data = dashboardDemo;
  const maxSpend = useMemo(
    () => Math.max(...data.monthly_trend.map((m) => m.net_spending)),
    [data.monthly_trend]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      return;
    }
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      return;
    }
    root.removeAttribute("data-theme");
  }, [theme]);

  function cycleTheme() {
    setTheme((t) => (t === "system" ? "light" : t === "light" ? "dark" : "system"));
  }

  return (
    <div className="app-root">
      <header className="app-top">
        <div>
          <div className="brand">FIP · Finance</div>
          <h1 className="display">{titles[tab]}</h1>
          <div className="sub">
            {data.year} · Demo · {data.data_quality}
          </div>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={cycleTheme}
          aria-label="切换主题"
          title={`主题：${theme === "system" ? "跟随系统" : theme === "light" ? "浅色" : "深色"}`}
        >
          <IconTheme />
        </button>
      </header>

      <div className="scroll">
        <section className={`screen ${tab === "dashboard" ? "active" : ""}`}>
          <div className="metric-grid">
            {[
              { label: "净现金", value: formatUsd(data.net_cash) },
              { label: "净资产", value: formatUsd(data.net_worth) },
              {
                label: "待处理告警",
                value: String(data.open_alert_count),
                hint: "3 项高优先级",
              },
            ].map((item) => (
              <div key={item.label} className="card metric">
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
                {item.hint ? <div className="hint">{item.hint}</div> : null}
              </div>
            ))}
          </div>

          <div className="metric-grid" style={{ marginTop: 10 }}>
            {[
              { label: "收入", value: formatUsd(data.labor_income) },
              { label: "净支出", value: formatUsd(data.net_spending) },
              { label: "储蓄流", value: formatUsd(data.savings_flow) },
            ].map((item) => (
              <div key={item.label} className="card metric">
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
              </div>
            ))}
          </div>

          <h2 className="section-title display">风险告警</h2>
          <div className="card" style={{ padding: 12 }}>
            {data.alerts.map((alert) => (
              <div key={alert.id} className={`alert ${alert.severity}`}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{alert.title}</div>
                <div style={{ marginTop: 4, fontSize: 12, opacity: 0.9 }}>
                  {alert.detail}
                </div>
              </div>
            ))}
          </div>

          <h2 className="section-title display">月度趋势</h2>
          <div className="card" style={{ padding: 16 }}>
            <div className="trend">
              {data.monthly_trend.map((point) => (
                <div key={point.month} className="trend-bar">
                  <div
                    className="trend-fill"
                    style={{
                      height: `${Math.round((point.net_spending / maxSpend) * 100)}%`,
                    }}
                    title={`${point.month}: ${formatUsd(point.net_spending)}`}
                  />
                  <span className="trend-label">{point.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`screen ${tab === "spending" ? "active" : ""}`}>
          <div className="card metric" style={{ marginBottom: 10 }}>
            <div className="label">本月净支出</div>
            <div className="value">{formatUsd(5380)}</div>
            <div className="sub" style={{ marginTop: 6 }}>
              毛支出 $5,800 · 退款 $420
            </div>
          </div>

          <h2 className="section-title display">分类占比</h2>
          <div className="card" style={{ padding: 16 }}>
            {data.categories.map((category) => {
              const width = Math.round(
                (category.amount / data.categories[0].amount) * 100
              );
              return (
                <div key={category.name} className="bar-row">
                  <div className="bar-head">
                    <span>{category.name}</span>
                    <span>
                      {formatUsd(category.amount)}
                      {category.delta_pct > 20 ? (
                        <span className="delta-up">+{category.delta_pct}%</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="section-title display">商户 Top</h2>
          <div className="card" style={{ padding: "4px 16px" }}>
            {data.merchants.map((m) => (
              <div key={m.name} className="list-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <span>{m.name}</span>
                <span>{formatUsd(m.amount)}</span>
                <span style={{ color: "var(--ink3)", fontSize: 12 }}>{m.count} 笔</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`screen ${tab === "transactions" ? "active" : ""}`}>
          <div className="card" style={{ padding: "8px 12px 4px" }}>
            <div
              className="list-row"
              style={{
                gridTemplateColumns: "72px 1fr auto auto",
                fontSize: 11,
                color: "var(--ink3)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              <span>日期</span>
              <span>商户</span>
              <span>金额</span>
              <span>状态</span>
            </div>
            {data.transactions.map((tx) => (
              <div key={`${tx.date}-${tx.merchant}`} className="list-row">
                <span style={{ color: "var(--ink3)" }}>{tx.date}</span>
                <span>{tx.merchant}</span>
                <span style={{ fontWeight: 600 }}>
                  {tx.amount < 0 ? "-" : "+"}
                  {formatUsd(tx.amount, 2)}
                </span>
                <span className={`pill ${tx.status}`}>
                  {tx.status === "auto" ? "自动" : "待审"}
                </span>
              </div>
            ))}
          </div>

          <h2 className="section-title display">规则审核</h2>
          <div className="card review-card">
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>
              剩余 {data.reviewQueue.remaining} 笔
            </div>
            <div style={{ marginTop: 10, fontWeight: 600 }}>
              {data.reviewQueue.sample.merchant} ·{" "}
              {formatUsd(data.reviewQueue.sample.amount, 2)}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink2)" }}>
              {data.reviewQueue.sample.account}
            </div>
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 12,
                background: "var(--blue-wash)",
                fontSize: 13,
              }}
            >
              建议分类：{data.reviewQueue.sample.category} ·{" "}
              {data.reviewQueue.sample.treatment}
              <br />
              置信度 {(data.reviewQueue.sample.confidence * 100).toFixed(0)}%
            </div>
            <div className="review-actions">
              <button type="button" className="btn btn-primary">
                接受
              </button>
              <button type="button" className="btn btn-ghost">
                编辑
              </button>
              <button type="button" className="btn btn-ghost">
                排除
              </button>
              <button type="button" className="btn btn-ghost">
                新建规则
              </button>
            </div>
          </div>
        </section>

        <section className={`screen ${tab === "cards" ? "active" : ""}`}>
          {data.cards.map((card) => (
            <div key={card.name} className="navy-card">
              <div style={{ fontWeight: 700, fontSize: 16 }}>{card.name}</div>
              <div className="muted" style={{ marginTop: 8 }}>
                余额 {formatUsd(card.balance)} · 到期 {card.due}
              </div>
              <div style={{ marginTop: 10 }}>
                <span className={`pill ${card.payment === "matched" ? "ok" : "miss"}`}>
                  {card.payment === "matched" ? "还款已匹配" : "缺少还款记录"}
                </span>
              </div>
              <div className="muted" style={{ marginTop: 12 }}>
                消费 {formatUsd(card.spend)} · 退款 {formatUsd(card.refunds)} · 奖励{" "}
                {formatUsd(card.rewards)}
              </div>
            </div>
          ))}

          <h2 className="section-title display">内部流转</h2>
          <div className="card" style={{ padding: "4px 16px" }}>
            {data.internalFlows.map((flow) => (
              <div
                key={flow.type}
                className="list-row"
                style={{ gridTemplateColumns: "1fr auto" }}
              >
                <span>{flow.type}</span>
                <span style={{ fontWeight: 600 }}>{formatUsd(flow.amount)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`screen ${tab === "more" ? "active" : ""}`}>
          <div className="card" style={{ overflow: "hidden" }}>
            <a className="more-link" href="https://github.com/hanbing6228/finance/tree/main/docs/fip" target="_blank" rel="noreferrer">
              FIP 文档
              <span style={{ color: "var(--accent)" }}>→</span>
            </a>
            <button type="button" className="more-link" onClick={cycleTheme} style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer" }}>
              主题模式
              <span style={{ color: "var(--ink3)" }}>
                {theme === "system" ? "跟随系统" : theme === "light" ? "浅色" : "深色"}
              </span>
            </button>
            <div className="more-link" style={{ fontSize: 12, color: "var(--ink3)" }}>
              API
              <span>/api/dashboard · /api/health</span>
            </div>
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: "var(--ink3)", lineHeight: 1.6 }}>
            MVP 不提供付款、转账或投资建议操作。数据包导入与规则引擎将按 FIP 规格逐步接入。
          </p>
        </section>
      </div>

      <nav className="tabbar" aria-label="主导航">
        {tabs.map((item) => {
          const active = tab === item.id;
          const Icon =
            item.id === "dashboard"
              ? IconDashboard
              : item.id === "spending"
                ? IconSpending
                : item.id === "transactions"
                  ? IconTransactions
                  : item.id === "cards"
                    ? IconCards
                    : IconMore;
          return (
            <button
              key={item.id}
              type="button"
              className={`tab ${active ? "active" : ""}`}
              onClick={() => setTab(item.id)}
              aria-current={active ? "page" : undefined}
            >
              <Icon active={active} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
