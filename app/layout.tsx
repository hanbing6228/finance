import type { Metadata, Viewport } from "next";
import "./globals.css";
import FipApp from "@/components/FipApp";

export const metadata: Metadata = {
  title: "FIP Finance",
  description:
    "个人财务分析 — 数据包驱动的支出、收入与风险监控 MVP。",
  applicationName: "FIP Finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#E9F1FC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
