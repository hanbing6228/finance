import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "fip-finance",
    version: "0.1.0",
    mode: "demo",
  });
}
