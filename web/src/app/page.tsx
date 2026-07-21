"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 md:px-10">
        <BrandMark compact />
        <nav className="flex items-center gap-1">
          <Link href="/login">
            <Button variant="ghost" className="px-4 py-2">
              ورود
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="flare" className="px-4 py-2">
              شروع
            </Button>
          </Link>
        </nav>
      </header>

      {/* One composition: brand + headline + sentence + CTA on full-bleed dawn plane */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="hero-dawn" aria-hidden />

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-14 pt-28 md:justify-center md:px-10 md:pb-20 md:pt-24">
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p
              className="font-display text-[clamp(3.25rem,12vw,7.5rem)] font-bold leading-[0.88] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PEPSINO
              <br />
              <span className="text-[var(--brand)]">LAB</span>
            </p>
            <h1
              className="mt-7 max-w-lg text-2xl font-semibold leading-snug md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              آزمایشگاه سیگنال برای مسیر تحصیلی
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              مأموریت، حضور، آزمون و کارنامه — یک سیستم زنده برای دانش‌آموز و منتور.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/register">
                <Button variant="flare" className="px-8 py-4 text-base">
                  ورود به آزمایشگاه
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ink" className="px-8 py-4 text-base">
                  قبلاً حساب دارم
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="sweep pointer-events-none absolute bottom-0 left-0 h-1.5 w-full bg-[var(--flare)]" />
      </section>

      <section className="lab-band lab-band--ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-5">
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--mint)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              برای دانش‌آموز
            </p>
            <h2
              className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              هر روز یک سیگنال واضح
            </h2>
          </div>
          <div className="md:col-span-7 md:flex md:flex-col md:justify-end">
            <p className="max-w-xl text-lg leading-relaxed text-white/70">
              داشبورد، مأموریت‌ها، لاگ‌بوک و کارت شناسایی — پیشرفت را مثل یک مسیر زنده
              می‌بینی، نه یک جدول خشک.
            </p>
            <Link href="/register" className="mt-8 inline-block">
              <Button variant="flare">ساخت حساب دانش‌آموز</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="lab-band lab-band--brand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-7 md:order-2">
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70"
              style={{ fontFamily: "var(--font-display)" }}
            >
              برای منتور
            </p>
            <h2
              className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              کلاس را مثل یک اتاق کنترل ببین
            </h2>
          </div>
          <div className="md:col-span-5 md:order-1 md:flex md:flex-col md:justify-end">
            <p className="max-w-md text-lg leading-relaxed text-white/75">
              حضور، آزمون، گزارش و وضعیت هر دانش‌آموز — بدون شلوغی داشبوردهای اداری.
            </p>
            <Link href="/register" className="mt-8 inline-block">
              <Button variant="ink">حساب منتور</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl text-3xl font-bold leading-tight text-[var(--ink)] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            از ثبت‌نام تا کارنامه — یک جریان پیوسته.
          </motion.p>
          <div className="mt-14 grid gap-px bg-[var(--line)] md:grid-cols-3">
            {[
              { n: "۰۱", t: "هویت", d: "ثبت‌نام، نقش، و کارت شناسایی شخصی." },
              { n: "۰۲", t: "اجرا", d: "مأموریت روزانه، حضور، و آزمون‌های زمان‌دار." },
              { n: "۰۳", t: "بازتاب", d: "لاگ‌بوک، سطح، و گزارش قابل چاپ." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="bg-[var(--paper)] p-8"
              >
                <p
                  className="text-4xl font-bold text-[var(--flare)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.n}
                </p>
                <h3
                  className="mt-4 text-xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BrandMark />
            <p className="mt-3 text-sm text-[var(--ink-soft)]">Gamified Education OS</p>
          </div>
          <p className="text-xs text-[var(--ink-soft)]">© {new Date().getFullYear()} PEPSINO LAB</p>
        </div>
      </footer>
    </div>
  );
}
