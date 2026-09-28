import "./globals.css";

/**
 * Root Layout with RTL support, StudentProvider, and TeacherProvider
 */
import type { Metadata, Viewport } from "next";
import { StudentProvider } from "@/context/StudentContext";
import { TeacherProvider } from "@/context/TeacherContext";
import { AuthProvider } from "@/context/AuthContext";
import { CommunicationProvider } from "@/context/CommunicationContext";

export const metadata: Metadata = {
  title: "Amman Tutoring Centre | Learning Platform",
  description:
    "A mobile-first quiz and learning platform for Amman Tutoring Centre",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="bg-slate-50 font-sans antialiased">
        <AuthProvider>
          <CommunicationProvider>
            <StudentProvider>
              <TeacherProvider>{children}</TeacherProvider>
            </StudentProvider>
          </CommunicationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
