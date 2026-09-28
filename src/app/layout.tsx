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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bythursday-quiz-app.vercel.app"
  ),
  title: {
    default: "مركز عمّان التعليمي | Amman Tutoring Centre - Quiz & LMS Platform",
    template: "%s | مركز عمّان التعليمي",
  },
  description:
    "منصة مركز عمّان التعليمي للامتحانات التفاعلية المحوسبة والتقييم الأكاديمي الفوري. اختبارات ذكية، مؤقتات تلقائية، وتحليلات أداء شاملة للطلبة والمعلمين.",
  keywords: [
    "مركز عمّان التعليمي",
    "منصة امتحانات عمّان",
    "Amman Tutoring Centre",
    "byThursday Quiz App",
    "Jordan LMS",
    "امتحانات محوسبة الأردن",
    "تقييم الطلاب",
    "تعليم عمان",
    "online quiz platform jordan",
    "نظام إدارة التعلم",
  ],
  authors: [{ name: "Amman Tutoring Centre" }],
  creator: "Amman Tutoring Centre",
  publisher: "Amman Tutoring Centre",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "ar_JO",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Amman Tutoring Centre | مركز عمّان التعليمي",
    title: "مركز عمّان التعليمي | منصة التقييم والامتحانات الذكية",
    description:
      "منصة تعليمية متكاملة لتقييم الطلبة في عمّان - امتحانات محوسبة، تصحيح فوري، وتحليلات دقيقة للأداء الأكاديمي.",
  },
  twitter: {
    card: "summary_large_image",
    title: "مركز عمّان التعليمي | Amman Tutoring Centre",
    description:
      "منصة التقييم والامتحانات المحوسبة لطلبة ومعلمي مركز عمّان التعليمي.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#312e81",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Amman Tutoring Centre",
  alternateName: "مركز عمّان التعليمي",
  url: "https://bythursday-quiz-app.vercel.app",
  logo: "https://bythursday-quiz-app.vercel.app/icon.svg",
  description:
    "منصة مركز عمّان التعليمي للامتحانات التفاعلية المحوسبة والتقييم الأكاديمي الفوري.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amman",
    addressCountry: "JO",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bythursday-quiz-app.vercel.app/quizzes?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
