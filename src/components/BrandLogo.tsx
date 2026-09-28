import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  /** Size variant for the emblem */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether to show text alongside the emblem */
  showText?: boolean;
  /** Custom href link (defaults to "/" or no link if null) */
  href?: string | null;
  /** Optional extra CSS classes */
  className?: string;
  /** Optional theme override for dark or light backgrounds */
  variant?: "default" | "white" | "monochrome";
}

/**
 * Amman Tutoring Centre (مركز عمّان التعليمي) Brand Logo
 * A bespoke modern academic emblem combining an open book of knowledge,
 * rising pillars of learning, and a guiding star of academic excellence.
 */
export function BrandEmblem({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-13 h-13",
    xl: "w-16 h-16",
  };

  const pixelMap = {
    sm: 32,
    md: 40,
    lg: 52,
    xl: 64,
  };

  const dim = pixelMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-300/50 ${sizeMap[size]} ${className}`}
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #2563eb 100%)",
        boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.35)",
      }}
      aria-hidden="true"
    >
      <svg
        width={dim * 0.65}
        height={dim * 0.65}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white drop-shadow-sm"
      >
        {/* Subtle Ambient Backlight Glow */}
        <circle cx="24" cy="20" r="14" fill="url(#coreGlow)" opacity="0.25" />

        {/* Guiding Star of Academic Excellence */}
        <path
          d="M24 3L25.8 8.5L31.5 9.8L27.2 13.5L28.5 19.2L24 16.2L19.5 19.2L20.8 13.5L16.5 9.8L22.2 8.5L24 3Z"
          fill="url(#starGold)"
        />

        {/* Open Book Wings - Left Page */}
        <path
          d="M8 36.5C12.5 34.2 18 34.6 22.5 37.5V20.5C18 17.8 12.5 17.4 8 20V36.5Z"
          fill="url(#leftPageGrad)"
        />

        {/* Open Book Wings - Right Page */}
        <path
          d="M40 36.5C35.5 34.2 30 34.6 25.5 37.5V20.5C30 17.8 35.5 17.4 40 20V36.5Z"
          fill="url(#rightPageGrad)"
        />

        {/* Central Spine & Pillar */}
        <path
          d="M24 18.5V40"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Academic Degree Arch Line */}
        <path
          d="M12 28.5C15.5 26.5 19.5 26.8 22.5 28.8"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <path
          d="M36 28.5C32.5 26.5 28.5 26.8 25.5 28.8"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="coreGlow" x1="10" y1="6" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="starGold" x1="16.5" y1="3" x2="31.5" y2="19.2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.5" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="leftPageGrad" x1="8" y1="18" x2="23" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="rightPageGrad" x1="25" y1="18" x2="40" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#eff6ff" />
            <stop offset="1" stopColor="#bfdbfe" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function BrandLogo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
  variant = "default",
}: BrandLogoProps) {
  const textClasses = {
    default: {
      primary: "text-slate-900",
      secondary: "text-indigo-600",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    },
    white: {
      primary: "text-white",
      secondary: "text-indigo-200",
      badge: "bg-white/10 text-white border-white/20",
    },
    monochrome: {
      primary: "text-slate-800",
      secondary: "text-slate-500",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
    },
  }[variant];

  const content = (
    <div className={`flex items-center gap-3 min-w-0 group ${className}`}>
      <BrandEmblem size={size} />

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`block truncate font-extrabold tracking-tight ${textClasses.primary} ${
                size === "sm"
                  ? "text-xs sm:text-sm"
                  : size === "lg"
                  ? "text-base sm:text-lg"
                  : size === "xl"
                  ? "text-lg sm:text-xl"
                  : "text-sm sm:text-base"
              }`}
            >
              Amman Learning Centre
            </span>
            <span
              className={`hidden sm:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold border tracking-wide uppercase ${textClasses.badge}`}
            >
              LMS
            </span>
          </div>
          <span
            className={`block truncate font-bold text-xs ${textClasses.secondary}`}
            lang="ar"
            dir="rtl"
          >
            مركز عمّان التعليمي
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
