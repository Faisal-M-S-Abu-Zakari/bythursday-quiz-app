"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";
import { BrandEmblem } from "@/components/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import {
  DEMO_CREDENTIALS,
  authenticateDemoUser,
  getDashboardPath,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const authenticatedUser = authenticateDemoUser(identifier, password);
    if (!authenticatedUser) {
      setError(
        "We couldn’t find a matching account. Check your details and try again. / تحقق من بيانات الدخول",
      );
      setLoading(false);
      return;
    }
    setUser(authenticatedUser);
    router.replace(getDashboardPath(authenticatedUser));
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <LMSHeader />
      <div className="items-center gap-10 grid lg:grid-cols-[1fr_0.85fr] mx-auto px-4 lg:px-8 py-10 max-w-6xl min-h-[calc(100vh-68px)]">
        <section className="hidden lg:block">
          <span className="inline-flex items-center gap-2 bg-indigo-50 mb-5 px-4 py-2 rounded-full font-semibold text-indigo-700 text-sm">
            <BookOpen size={16} /> Learning starts here
          </span>
          <h1 className="max-w-xl font-bold text-slate-950 text-5xl leading-tight tracking-tight">
            Your next learning milestone starts here.
          </h1>
          <p
            className="mt-5 max-w-xl text-slate-600 text-lg leading-8"
            lang="ar"
            dir="rtl"
          >
            مركز عمّان التعليمي | منصة التقييم الذكية
          </p>
          <div className="flex gap-3 mt-8">
            <span className="bg-white shadow-sm px-4 py-3 rounded-2xl font-semibold text-slate-700 text-sm">
              Timed assessments
            </span>
            <span className="bg-white shadow-sm px-4 py-3 rounded-2xl font-semibold text-slate-700 text-sm">
              Instant analytics
            </span>
          </div>
        </section>
        <section className="bg-white shadow-slate-200/70 shadow-xl mx-auto p-6 sm:p-8 border border-slate-200 rounded-3xl w-full max-w-md">
          <div className="mb-7 text-center">
            <BrandEmblem size="lg" className="mx-auto mb-4" />
            <h1 className="font-bold text-slate-900 text-2xl tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Sign in to your learning space · تسجيل الدخول
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="identifier"
                className="block mb-2 font-semibold text-slate-700 text-sm"
              >
                Student ID / Teacher email / Admin username
              </label>
              <div className="relative">
                <UserRound
                  size={18}
                  className="top-1/2 left-4 absolute text-slate-400 -translate-y-1/2"
                />
                <input
                  id="identifier"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="e.g. student_001"
                  className="bg-white pr-4 pl-11 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 w-full min-h-12 text-sm transition"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-semibold text-slate-700 text-sm"
              >
                Password / كلمة المرور
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="top-1/2 left-4 absolute text-slate-400 -translate-y-1/2"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="bg-white pr-12 pl-11 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 w-full min-h-12 text-sm transition"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="top-1/2 right-2 absolute place-items-center grid hover:bg-slate-100 rounded-lg w-9 h-9 text-slate-500 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="bg-rose-50 p-3 border border-rose-200 rounded-xl text-rose-700 text-sm"
              >
                {error}
              </p>
            )}
            <button
              disabled={loading}
              type="submit"
              className="bg-gradient-to-r from-indigo-700 hover:from-indigo-800 to-blue-600 hover:to-blue-700 disabled:opacity-60 shadow-indigo-200 shadow-md px-4 rounded-xl w-full min-h-12 font-semibold text-white transition disabled:cursor-wait"
            >
              {loading ? "Signing in…" : "Sign in / تسجيل الدخول"}
            </button>
          </form>
          <details className="bg-slate-50 mt-6 p-4 border border-slate-200 rounded-2xl">
            <summary className="content-center min-h-8 font-semibold text-slate-700 text-sm cursor-pointer">
              Demo credentials · بيانات تجريبية
            </summary>
            <div className="space-y-3 mt-3 text-slate-600 text-xs">
              <p>
                <strong>Student:</strong> {DEMO_CREDENTIALS.student.identifier}{" "}
                / {DEMO_CREDENTIALS.student.password}
              </p>
              <p>
                <strong>Teacher:</strong> {DEMO_CREDENTIALS.teacher.identifier}{" "}
                / {DEMO_CREDENTIALS.teacher.password}
              </p>
              <p>
                <strong>Admin:</strong> {DEMO_CREDENTIALS.admin.identifier} /{" "}
                {DEMO_CREDENTIALS.admin.password}
              </p>
              <p className="pt-3 border-slate-200 border-t text-amber-700">
                Demo only. Replace this client-side mock sign-in with a
                server-backed authentication provider before production.
              </p>
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
