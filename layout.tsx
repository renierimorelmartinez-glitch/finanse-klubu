import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINANSE MAGAZYNU",
  description: "Cashflow Core v1 — zarządcze finanse jednoosobowej działalności",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
