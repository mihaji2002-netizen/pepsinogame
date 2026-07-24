"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/exam/Logo";

export default function HomePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/exams/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_code: accessCode,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در شروع آزمون");
        return;
      }

      sessionStorage.setItem(
        `exam_${data.attempt_id}`,
        JSON.stringify({
          startedAt: Date.now(),
          durationMinutes: data.exam.duration_minutes,
        })
      );

      router.push(`/exam/${data.attempt_id}`);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="text-center mb-8 hero-glow rounded-3xl p-6 border border-white/70 shadow-lg shadow-emerald-900/5">
          <Logo size="lg" showTagline className="mb-4" />
          <h1 className="text-3xl font-bold text-slate-900">سامانه آزمون آنلاین</h1>
          <p className="text-slate-500 mt-2">Pepsino LAB · ورود دانش‌آموزان</p>
        </div>

        <div className="card">
          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="label">نام</label>
              <input
                type="text"
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="مثال: علی"
                required
              />
            </div>

            <div>
              <label className="label">نام خانوادگی</label>
              <input
                type="text"
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="مثال: محمدی"
                required
              />
            </div>

            <div>
              <label className="label">کد آزمون</label>
              <input
                type="text"
                className="input-field text-center tracking-[0.3em] uppercase font-mono"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="کد را از مشاور دریافت کنید"
                required
                dir="ltr"
              />
              <p className="text-xs text-slate-400 mt-2">
                هر نام و نام خانوادگی فقط یک‌بار می‌تواند در آزمون شرکت کند
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "در حال ورود..." : "شروع آزمون"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          <a href="/admin" className="hover:text-emerald-700 transition-colors font-medium">
            ورود مشاور
          </a>
        </p>
      </div>
    </main>
  );
}
