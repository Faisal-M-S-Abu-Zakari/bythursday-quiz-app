/**
 * Root Layout with RTL support and StudentProvider
 */

import type { Metadata } from "next";
import { StudentProvider } from "@/context/StudentContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "byThursday - Quiz Platform",
  description: "Mobile-first quiz assessment platform for Nour tutoring centre",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="antialiased bg-gray-50 font-sans">
        <StudentProvider>{children}</StudentProvider>
      </body>
    </html>
  );
}
