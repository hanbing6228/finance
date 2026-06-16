import { NextRequest, NextResponse } from "next/server";
import { dashboardDemo } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const year = Number(request.nextUrl.searchParams.get("year") ?? dashboardDemo.year);

  return NextResponse.json({
    year,
    net_cash: dashboardDemo.net_cash,
    net_worth: dashboardDemo.net_worth,
    labor_income: dashboardDemo.labor_income,
    net_spending: dashboardDemo.net_spending,
    savings_flow: dashboardDemo.savings_flow,
    open_alert_count: dashboardDemo.open_alert_count,
    data_quality: dashboardDemo.data_quality,
    alerts: dashboardDemo.alerts,
    monthly_trend: dashboardDemo.monthly_trend,
    categories: dashboardDemo.categories,
  });
}
